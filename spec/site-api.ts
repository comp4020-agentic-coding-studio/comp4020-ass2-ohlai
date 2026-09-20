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
  course: { code: string; level: number; startDate: string; endDate: string };
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

/** Every content source a student's eye lands on, read from disk. */
export function contentSources(): SourceFile[] {
  const roots = ["COURSE.md", "src/content", "src/decks", "src/pages"];
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
    if (!/\.(md|mdx)$/.test(full)) return;
    if (/(^|[\/])CLAUDE\.md$/.test(full)) return;
    files.push({ path: relative(resolve("."), full).split(sep).join("/"), text: readFileSync(full, "utf8") });
  };
  for (const root of roots) walk(root);
  return files;
}
