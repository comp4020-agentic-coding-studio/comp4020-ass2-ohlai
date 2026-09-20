import type { CourseMetaInput } from "astro-course-university";
import { z } from "astro/zod";

// The level digits ANU uses: 1000--4000 undergraduate, 6000 and 8000
// postgraduate. Both the code pattern and the level field derive from this.
const LEVELS = [1, 2, 3, 4, 6, 8] as const;
const allowedCode = new RegExp(`^SLOP[${LEVELS.join("")}]\\d{3}$`);

export const slopCourseMetaSchema = z
  .strictObject({
    code: z.string().regex(allowedCode, {
      message: "use SLOP plus a 1000–4000, 6000 or 8000 level code",
    }),
    title: z.string().trim().min(1).max(100),
    session: z.string().trim().min(1).max(40),
    year: z.number().int().min(2026).max(2200),
    level: z.literal(LEVELS),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    description: z.string().trim().min(80).max(300),
    tags: z.array(z.string().trim().min(2).max(24)).min(1).max(3),
  })
  .superRefine((course, ctx) => {
    const codeLevel = Number(course.code.at(4));
    if (course.level !== codeLevel) {
      ctx.addIssue({
        code: "custom",
        path: ["level"],
        message: `must match ${course.code}'s first digit (${codeLevel})`,
      });
    }
    if (course.startDate > course.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "must not be after endDate",
      });
    }
  });

// The single source of truth for the course record. The generated homepage,
// navigation label and /api/index.json all read this object.
// Replace every placeholder value, but keep the shape: the catalogue ingests
// this API contract when the course is published.
//
// The code's last three digits were assigned to this repo when it was
// provisioned, and no other course in the cohort has them. Only the leading
// level digit is ours, and it is 2.
//
// `description` is capped at 300 characters by the schema above, and the
// course's own paragraph runs to 356. The first two sentences are here,
// which is the part a catalogue entry needs. The third sentence, on what
// students actually do, is on the outline page in full. See
// notes/questions.md, question 6.
export const courseMeta = slopCourseMetaSchema.parse({
  code: "SLOP2034",
  title: "Wait: The Design of Delay",
  session: "Semester 1",
  year: 2027,
  level: 2,
  startDate: "2027-02-15",
  endDate: "2027-05-21",
  description:
    "Every system you use has decided how long you will wait and what you " +
    "will be told while you do. This course treats that decision as design " +
    "work: the thresholds, the progress indicators, the hold scripts, the " +
    "queues, and the politics of who is asked to wait.",
  // The schema allows three. The fourth the course wanted was "time".
  tags: ["delay", "interaction-design", "service-design"],
}) satisfies CourseMetaInput;
