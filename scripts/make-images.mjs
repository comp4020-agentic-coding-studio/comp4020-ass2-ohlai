// Generates the site's social card from the SVG source in this file.
//
// The starter shipped four placeholder images and `pnpm check:evidence`
// fails while any of them is still byte-for-byte the original. They could
// have been swapped for stock, but a course arguing that every wait is
// authored should not illustrate itself with pictures nobody chose. These
// are drawn from the course's own subject matter instead:
//
//   card      the social card, an indeterminate arc over the course code
//
// The header's artwork is not here any more. It was a drawing of a progress
// bar stopped at 99%, and it is now an actual progress bar that actually
// stops at 99% and then falls over: src/components/LyingProgress.astro, with
// its state machine in src/lib/lying-progress.ts. A course whose fourth week
// is called Ninety-Nine Percent should illustrate itself with the thing and
// not with a picture of the thing.
//
// The two staff portraits are not generated: they are gone. The first
// attempt drew a face and produced a smiley over a pair of shoulders, and
// the second reduced to a circle above a hill, which is the shape every
// "no photo" placeholder already has. Invented staff at an invented
// university do not need stock avatars, `photo` is optional in the people
// schema, and check-evidence says in as many words that an image-free
// treatment passes. The people pages carry role, contact and prose instead.
//
// Two inks only, matching the site: ink and the amber `--at-primary` from
// src/styles/wait.css. The risograph feel comes from offsetting a second
// pass of each shape and letting it multiply, which is what a two colour
// riso does when the paper shifts between passes.
//
// Run with: node scripts/make-images.mjs
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

// oklch(0.53 0.148 52) and its neighbours, resolved to sRGB. The site
// computes these from the token; SVG cannot, so they are written out here.
const AMBER = "#9f5b17";
const AMBER_LIGHT = "#c68a3c";
const INK = "#1a130d";
const BONE = "#fbf8f4";

const cardSvg = (w = 1200, h = 630) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${INK}" />
  <rect x="0" y="0" width="${w}" height="10" fill="${AMBER}" />

  <!-- An indeterminate arc: 300 degrees of a ring, which is the throbber
       the site draws in CSS, frozen. -->
  <g transform="translate(${w - 190} 150)">
    <circle r="66" fill="none" stroke="${BONE}" stroke-opacity="0.14" stroke-width="12" />
    <path d="M 0 -66 A 66 66 0 1 1 -57 33" fill="none" stroke="${AMBER_LIGHT}"
          stroke-width="12" stroke-linecap="butt" />
  </g>

  <text x="96" y="210" fill="${AMBER_LIGHT}" font-family="ui-monospace, monospace"
        font-size="30" letter-spacing="7">SLOP2034</text>
  <text x="96" y="330" fill="${BONE}" font-family="Georgia, serif" font-size="92"
        font-weight="600">Wait</text>
  <text x="96" y="424" fill="${BONE}" font-family="Georgia, serif" font-size="58"
        opacity="0.82">The Design of Delay</text>

  <g transform="translate(96 500)">
    <rect width="${w - 192}" height="6" fill="${BONE}" opacity="0.16" />
    <rect width="${(w - 192) * 0.99}" height="6" fill="${AMBER}" />
  </g>
  <text x="96" y="560" fill="${BONE}" font-family="ui-monospace, monospace"
        font-size="22" opacity="0.6">Slop University · Semester 1, 2027</text>
</svg>`;

const write = async (svg, out, format) => {
  const path = resolve(out);
  mkdirSync(dirname(path), { recursive: true });
  const pipeline = sharp(Buffer.from(svg));
  await (format === "avif"
    ? pipeline.avif({ quality: 62, effort: 4 })
    : pipeline.png({ compressionLevel: 9 })
  ).toFile(path);
  console.log(`wrote ${out}`);
};

await write(cardSvg(), "src/assets/images/card.png", "png");
