// The only thing in the repo that knows COURSE.md's syntax.
//
// COURSE.md is the course's single source of truth, so the checks that read
// it have to agree on what they are reading. Seven separate regexes over the
// same file would drift apart the first time a heading moved. Change the
// format here and every check follows.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface ThesisClause {
  id: string;
  text: string;
}

export interface CalendarEntry {
  week: number;
  date: string;
}

export interface WeekEntry {
  week: number;
  title: string;
  does: string;
  keyTerm: string;
}

export interface AssessmentEntry {
  name: string;
  weight: number;
  due: string;
  tests: string[];
}

export interface CourseBible {
  raw: string;
  thesis: string;
  clauses: ThesisClause[];
  calendar: CalendarEntry[];
  weeks: WeekEntry[];
  assessment: AssessmentEntry[];
  voice: string[];
}

const HEADINGS = {
  thesis: "Thesis",
  clauses: "Thesis clauses",
  calendar: "Teaching calendar",
  weeks: "Weeks",
  assessment: "Assessment",
  voice: "Voice",
} as const;

function sectionBody(raw: string, heading: string): string[] {
  const lines = raw.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) {
    throw new Error(
      `COURSE.md has no "## ${heading}" section. The section headings are the ` +
        `parse contract; spec/course-md.ts defines them.`,
    );
  }
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith("## "));
  return end === -1 ? rest : rest.slice(0, end);
}

function parseThesis(raw: string): string {
  const quoted = sectionBody(raw, HEADINGS.thesis).find((line) => line.startsWith("> "));
  if (!quoted) {
    throw new Error(
      'COURSE.md\'s "## Thesis" section has no blockquote. The thesis is the ' +
        "line beginning `> ` and it is stored verbatim.",
    );
  }
  return quoted.slice(2).trim();
}

function parseClauses(raw: string): ThesisClause[] {
  const clauses: ThesisClause[] = [];
  for (const line of sectionBody(raw, HEADINGS.clauses)) {
    const match = /^-\s+`([A-Z]\d+)`\s+(.+?)\s*$/.exec(line);
    if (match) clauses.push({ id: match[1]!, text: match[2]! });
  }
  return clauses;
}

function parseCalendar(raw: string): CalendarEntry[] {
  const calendar: CalendarEntry[] = [];
  for (const line of sectionBody(raw, HEADINGS.calendar)) {
    const match = /^-\s+week\s+(\d+):\s*(\S+)\s*$/i.exec(line);
    if (match) calendar.push({ week: Number(match[1]), date: match[2]! });
  }
  return calendar;
}

function parseWeeks(raw: string): WeekEntry[] {
  const weeks: WeekEntry[] = [];
  let current: WeekEntry | undefined;
  for (const line of sectionBody(raw, HEADINGS.weeks)) {
    const heading = /^###\s+Week\s+(\d+)\.\s+(.+?)\s*$/.exec(line);
    if (heading) {
      current = { week: Number(heading[1]), title: heading[2]!, does: "", keyTerm: "" };
      weeks.push(current);
      continue;
    }
    if (!current) continue;
    const does = /^-\s+does:\s*(.+?)\s*$/.exec(line);
    if (does) current.does = does[1]!;
    const keyTerm = /^-\s+key-term:\s*(.+?)\s*$/.exec(line);
    if (keyTerm) current.keyTerm = keyTerm[1]!;
  }
  return weeks;
}

function parseAssessment(raw: string): AssessmentEntry[] {
  const items: AssessmentEntry[] = [];
  let current: AssessmentEntry | undefined;
  for (const line of sectionBody(raw, HEADINGS.assessment)) {
    const heading = /^###\s+(.+?)\s*$/.exec(line);
    if (heading) {
      current = { name: heading[1]!, weight: Number.NaN, due: "", tests: [] };
      items.push(current);
      continue;
    }
    if (!current) continue;
    const weight = /^-\s+weight:\s*([\d.]+)\s*$/.exec(line);
    if (weight) current.weight = Number(weight[1]);
    const due = /^-\s+due:\s*(\S+)\s*$/.exec(line);
    if (due) current.due = due[1]!;
    const tests = /^-\s+tests:\s*(.+?)\s*$/.exec(line);
    if (tests) current.tests = tests[1]!.split(/[,\s]+/).filter(Boolean);
  }
  return items;
}

function parseVoice(raw: string): string[] {
  return sectionBody(raw, HEADINGS.voice)
    .filter((line) => /^-\s+\S/.test(line))
    .map((line) => line.replace(/^-\s+/, "").trim());
}

export function readCourseBible(path = resolve("COURSE.md")): CourseBible {
  const raw = readFileSync(path, "utf8");
  return {
    raw,
    thesis: parseThesis(raw),
    clauses: parseClauses(raw),
    calendar: parseCalendar(raw),
    weeks: parseWeeks(raw),
    assessment: parseAssessment(raw),
    voice: parseVoice(raw),
  };
}

export const TEACHING_WEEKS = 12;
