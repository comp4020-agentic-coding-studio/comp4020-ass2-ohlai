// Shared read of the generated API and of the content sources.
//
// The build already resolves frontmatter, applies the schemas and passes
// undeclared keys through into each node's `meta`, so `serves`, `readings`,
// `tests` and `claims` arrive here typed as loosely as they were written.
// Reading the built API rather than the markdown means the checks see what
// the site actually publishes.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

export interface ApiNode {
  id: string;
  type: string;
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;
  body?: string;
}

export interface CourseApi {
  course: {
    code: string;
    title: string;
    session: string;
    year: number;
    level: number;
    startDate: string;
    endDate: string;
  };
  nodes: ApiNode[];
}

export const api = JSON.parse(
  readFileSync(resolve("dist/api/index.json"), "utf8"),
) as CourseApi;

export const nodesOfType = (type: string): ApiNode[] =>
  api.nodes.filter((node) => node.type === type);

/** Frontmatter list values arrive as unknown. Narrow them without throwing. */
export const stringList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((entry) => String(entry).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(/[,\s]+/).filter(Boolean);
  return [];
};

export interface SourceFile {
  path: string;
  text: string;
}

/**
 * Every content source a student's eye lands on, read from disk.
 *
 * `.astro` pages are in here as well as markdown ones. The home page is an
 * `.astro` file carrying as much reader-facing prose as any `.md`, and
 * leaving it out meant the voice check had never once looked at the first
 * page anybody sees.
 *
 * `src/components` joined the list for the same reason, one step later. The
 * hold screen's copy and the thesis block's labels are read by every visitor
 * and lived in a directory nothing scanned, which is the page-level hole
 * again at component level. A component is reader-facing copy the moment it
 * contains a sentence.
 */
/**
 * Blanks the parts of an `.astro` file that are code rather than copy.
 *
 * Scanning components found two things on the first run, and both were the
 * scanner's fault: a `--bar-value: 99%` in a style attribute reported as an
 * undeclared figure, and a `1500ms` inside a comment in an inline script.
 * Neither is a sentence anybody reads. A rule that cries wolf on CSS gets
 * switched off, so the scanner learns the difference instead.
 *
 * `<script>` and `<style>` blocks go, and so do `style` attributes. Every
 * other attribute stays: `alt`, `title` and `aria-label` are copy a reader
 * meets, and they are exactly the kind that escapes review.
 *
 * Content is replaced with blank lines rather than removed, so the line
 * numbers a failure reports still point at the real line.
 */
function stripCode(text: string): string {
  const blank = (match: string): string => match.replace(/[^\n]/g, " ");
  return text
    .replace(/<script\b[\s\S]*?<\/script>/gi, blank)
    .replace(/<style\b[\s\S]*?<\/style>/gi, blank)
    .replace(/\sstyle=(?:"[^"]*"|'[^']*'|\{[^}]*\})/gi, blank);
}

export function contentSources(): SourceFile[] {
  const roots = ["COURSE.md", "src/content", "src/decks", "src/pages", "src/components"];
  const files: SourceFile[] = [];
  const walk = (entry: string): void => {
    const full = resolve(entry);
    let stats;
    try {
      stats = statSync(full);
    } catch {
      return;
    }
    if (stats.isDirectory()) {
      for (const child of readdirSync(full)) walk(join(entry, child));
      return;
    }
    if (!/\.(md|mdx|astro)$/.test(full)) return;
    if (/(^|[\/])CLAUDE\.md$/.test(full)) return;
    const path = relative(resolve("."), full).split(sep).join("/");
    const raw = readFileSync(full, "utf8");
    files.push({ path, text: path.endsWith(".astro") ? stripCode(raw) : raw });
  };
  for (const root of roots) walk(root);
  return files;
}

export interface DeclaredClaim {
  text: string;
  source: string;
  retrieved: string;
  measures: string;
}

/**
 * Reads the `claims:` list out of a file's frontmatter.
 *
 * The generated API drops page bodies and does not reach decks at all, and
 * the repo has no YAML dependency, so provenance reads the source directly.
 * The shape is deliberately narrow: a list of items with single line scalar
 * values. A block scalar is a parse miss, which shows up as an empty field
 * and fails the check rather than passing silently.
 */
export function readClaims(text: string): DeclaredClaim[] {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!frontmatter) return [];
  const lines = frontmatter[1]!.split(/\r?\n/);
  const start = lines.findIndex((line) => /^claims:\s*$/.test(line));
  if (start === -1) return [];
  const unquote = (value: string): string => value.trim().replace(/^["']|["']$/g, "").trim();
  const claims: DeclaredClaim[] = [];
  let current: Record<string, string> | undefined;
  for (const line of lines.slice(start + 1)) {
    if (/^\S/.test(line)) break;
    const item = /^\s*-\s+(\w+):\s*(.*)$/.exec(line);
    if (item) {
      current = { [item[1]!]: unquote(item[2]!) };
      claims.push(current as unknown as DeclaredClaim);
      continue;
    }
    const field = /^\s+(\w+):\s*(.*)$/.exec(line);
    if (field && current) current[field[1]!] = unquote(field[2]!);
  }
  return claims.map((claim) => ({
    text: claim.text ?? "",
    source: claim.source ?? "",
    retrieved: claim.retrieved ?? "",
    measures: claim.measures ?? "",
  }));
}

/** Everything after the frontmatter: what a reader actually reads. */
export function bodyOf(text: string): { body: string; offset: number } {
  const frontmatter = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(text);
  if (!frontmatter) return { body: text, offset: 0 };
  const consumed = frontmatter[0];
  return { body: text.slice(consumed.length), offset: consumed.split(/\r?\n/).length - 1 };
}
