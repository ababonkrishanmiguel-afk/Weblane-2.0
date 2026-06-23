import { existsSync, readdirSync, readFileSync } from "node:fs";
import { strict as assert } from "node:assert";

const source = readFileSync(new URL("../src/main.jsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

const requiredCopy = [
  "The WebLane Method",
  "A guided process that turns unclear business websites into polished, trustworthy, inquiry-ready experiences.",
  "Discovery",
  "Strategy turns scattered ideas into a guided direction.",
  "Audit",
  "Message &amp; Structure",
  "Experience makes the website feel clear, polished, and easy to move through.",
  "Experience and Launch"
];

for (const copy of requiredCopy) {
  assert(source.includes(copy), `Missing process copy: ${copy}`);
}

const requiredMarkers = [
  "const PROCESS_FRAME_COUNT = 237",
  "processFramePath",
  "/sequence/process/process_",
  "drawFrame",
  "imagesRef.current",
  "Math.round(progress * (PROCESS_FRAME_COUNT - 1))",
  "pin: sticky",
  "pinSpacing: false",
  'data-start-frame="0001"',
  'data-end-frame="0034"',
  'data-start-frame="0060"',
  'data-end-frame="0070"',
  'data-start-frame="0085"',
  'data-end-frame="0100"',
  'data-start-frame="0125"',
  'data-end-frame="0135"',
  'data-start-frame="0150"',
  'data-end-frame="0165"',
  'data-start-frame="0180"',
  'data-end-frame="0200"'
];

for (const marker of requiredMarkers) {
  assert(source.includes(marker), `Missing process sequence marker: ${marker}`);
}

const requiredStyles = [
  ".process-section",
  "height: 620svh",
  ".process-sticky",
  ".process-section::after",
  ".process-canvas",
  ".process-text-state",
  ".process-method-intro",
  ".process-method-heading",
  ".process-method-summary",
  "color: var(--text)",
  "background: transparent",
  "box-shadow: none",
  ".process-text-split"
];

for (const marker of requiredStyles) {
  assert(styles.includes(marker), `Missing process style marker: ${marker}`);
}

assert(!source.includes("function FlightPath"), "Old FlightPath component should be removed");
assert(!source.includes("1405+Plane_1.obj"), "Airplane OBJ should be removed");
assert(!source.includes("OBJLoader"), "OBJLoader should not be used for the process section");
assert(!source.includes("Takeoff"), "Old airplane process copy should be removed");
assert(!source.includes("Cruise"), "Old airplane process copy should be removed");
assert(!styles.includes(".flight-path"), "Old flight path styles should be removed");
assert(!styles.includes(".flight-canvas"), "Old flight canvas styles should be removed");
assert(!styles.includes(".flight-step"), "Old flight step styles should be removed");
assert(!styles.includes("background: rgba(248, 251, 255, 0.66)"), "Process text overlays should not use card backgrounds");
assert(!styles.includes("border: 1px solid rgba(8, 19, 22, 0.1)"), "Process text overlays should not use card borders");
assert(source.includes('className="process-text-state process-text-center" data-process-state="discovery"'), "Discovery process text should be centered");
assert(source.includes('className="process-text-state process-text-split" data-process-state="strategy"'), "Strategy process text should use the split side layout");
assert(source.includes('className="process-text-state process-text-right" data-process-state="audit"'), "Audit process text should be on the right");
assert(source.includes('className="process-text-state process-text-left" data-process-state="structure"'), "Message and Structure process text should be on the left");
assert(source.includes('className="process-text-state process-text-left" data-process-state="message"'), "Experience process text should be on the left");
assert(source.includes("SplitText"), "Process method heading should use SplitText");
assert(source.includes("{ autoAlpha: 0, y: 34, filter: \"blur(8px)\" }"), "Process text should reveal bottom-to-top instead of popping");

const frames = readdirSync(new URL("../public/sequence/process", import.meta.url)).filter((name) => /^process_\d{4}\.png$/.test(name));
assert.equal(frames.length, 237, "Process should use all 237 extracted frames");
assert(frames.includes("process_0001.png"), "Process should include first frame");
assert(frames.includes("process_0237.png"), "Process should include final frame");
assert(existsSync(new URL("../public/sequence/process/process_0200.png", import.meta.url)), "Process should include frame 200 for final text range");
