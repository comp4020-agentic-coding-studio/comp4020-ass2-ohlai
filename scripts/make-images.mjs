// Generates the site's two images from SVG sources in this file.
//
// The starter shipped four placeholder images and `pnpm check:evidence`
// fails while any of them is still byte-for-byte the original. They could
// have been swapped for stock, but a course arguing that every wait is
// authored should not illustrate itself with pictures nobody chose. These
// are drawn from the course's own subject matter instead:
//
//   hero      a determinate bar stopped at 99% over a queue of seven
//             figures, which is weeks 4 and 7 in one frame
//   card      the social card, an indeterminate arc over the course code
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

/** A standing figure: head and shoulders, drawn as one path. */
const figure = (x, y, scale, fill, opacity = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})" fill="${fill}" opacity="${opacity}">
    <circle cx="0" cy="-58" r="26" />
    <path d="M -30 0 a 30 42 0 0 1 60 0 L 30 66 L -30 66 Z" />
  </g>`;

/** The queue: seven figures, evenly spaced, the one at the head picked out. */
const queue = (baseline, width, headFill, tailFill) => {
  const count = 7;
  const gap = width / (count + 1);
  return Array.from({ length: count }, (_, index) => {
    const x = gap * (index + 1);
    const isHead = index === 0;
    // The tail of a queue fades because you cannot see the end of one you
    // are standing in. The head does not.
    const opacity = isHead ? 1 : 0.86 - index * 0.1;
    return figure(x, baseline, 1, isHead ? headFill : tailFill, opacity);
  }).join("");
};

const heroSvg = (w = 1600, h = 900) => {
  const trackX = 120;
  const trackW = w - 240;
  // The gap has to be visible or the picture does not make the point, and
  // 1% of this width is four pixels. The bar is drawn in ten segments with
  // the last one empty, which reads as "nearly done" at a glance and is the
  // same lie week 4 takes apart.
  const segments = 10;
  const segW = trackW / segments;
  const bars = Array.from({ length: segments }, (_, index) => {
    const filled = index < segments - 1;
    return `<rect x="${trackX + index * segW + 4}" y="0" width="${segW - 8}" height="30"
      fill="${filled ? AMBER_LIGHT : BONE}" opacity="${filled ? 1 : 0.18}" />`;
  }).join("");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${INK}" />

  <!-- The bar, stopped one segment short. The empty segment is drawn rather
       than omitted, because the gap is the part week 4 is about. The offset
       amber pass underneath is the second riso impression. -->
  <g transform="translate(0 ${h * 0.2})">
    <g transform="translate(7 7)" opacity="0.4">${bars}</g>
    ${bars}
  </g>

  <!-- The queue sits in the upper middle, clear of the band where the theme
       lays the page title over this image. -->
  <g transform="translate(6 6)" opacity="0.45">
    ${queue(h * 0.6, w, AMBER, AMBER)}
  </g>
  ${queue(h * 0.6, w, AMBER_LIGHT, BONE)}
</svg>`;
};

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

await write(heroSvg(), "src/assets/images/hero-home.avif", "avif");
await write(cardSvg(), "src/assets/images/card.png", "png");
