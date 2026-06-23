import { existsSync, readdirSync, readFileSync } from "node:fs";
import { strict as assert } from "node:assert";

const source = readFileSync(new URL("../src/main.jsx", import.meta.url), "utf8");
const sequenceHero = readFileSync(new URL("../src/SequenceHero.jsx", import.meta.url), "utf8");
const staggeredMenu = readFileSync(new URL("../src/components/StaggeredMenu.jsx", import.meta.url), "utf8");
const borderGlow = readFileSync(new URL("../src/components/BorderGlow.jsx", import.meta.url), "utf8");
const gradualBlur = readFileSync(new URL("../src/components/GradualBlur.jsx", import.meta.url), "utf8");
const decryptedText = readFileSync(new URL("../src/components/DecryptedText.jsx", import.meta.url), "utf8");
const rotatingText = readFileSync(new URL("../src/components/RotatingText.jsx", import.meta.url), "utf8");
const scrollVelocity = readFileSync(new URL("../src/components/ScrollVelocity.jsx", import.meta.url), "utf8");
const viteConfig = readFileSync(new URL("../vite.config.js", import.meta.url), "utf8");
const packageJson = readFileSync(new URL("../package.json", import.meta.url), "utf8");
const combinedSource = `${source}\n${sequenceHero}\n${staggeredMenu}\n${borderGlow}\n${gradualBlur}\n${decryptedText}\n${rotatingText}\n${scrollVelocity}`;
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const staggeredMenuStyles = readFileSync(new URL("../src/components/StaggeredMenu.css", import.meta.url), "utf8");
const combinedStyles = `${styles}\n${staggeredMenuStyles}`;

const requiredSections = [
  "<SequenceHero />",
  "<BestForStrip />",
  "<VelocityTransition />",
  "<ImageBentoSection />",
  "<BeforeAfter />",
  "<Process />",
  "<Outcomes />",
  "<Packages />",
  "<WhyWebLane />",
  "<FinalCTA />"
];

let previousIndex = -1;
for (const marker of requiredSections) {
  const index = source.indexOf(marker);
  assert(index > previousIndex, `Homepage section is missing or out of order: ${marker}`);
  previousIndex = index;
}

const requiredCopy = [
  "You Deserve the kind of website your competitors wish they had.",
  "/sections/Long.png",
  "/sections/short1.png",
  "/sections/short2.png",
  "/sections/before image.png",
  "/sections/after image.png",
  "Wake-up call",
  "Your website already made an impression.",
  "People judge your business before they read a single word.",
  "Most websites are forgotten within seconds.",
  "Local Businesses",
  "Clinics & Dentals",
  "Barbershops & Salons",
  "Physical & online businesses",
  "Hardware & Construction services",
  "and more!",
  "Weblane Never Settle For Less",
  "What changes after launch?",
  "More trust",
  "Better first impressions",
  "More inquiries",
  "Stronger positioning",
  "Higher perceived value",
  "Basic Website",
  "From $799",
  "Enhanced Website",
  "From $1,499",
  "Signature Website",
  "Up to $10,000",
  "Are you really gonna settle for a basic, slow, non-converting website?",
  "ababonkrishanmiguel@gmail.com"
];

for (const copy of requiredCopy) {
  assert(combinedSource.includes(copy), `Missing required WebLane copy: ${copy}`);
}

const motionMarkers = [
  "useGSAP",
  "ScrollTrigger",
  "scrub:",
  "pin: stickyRef.current",
  "Math.round(progress * (FRAME_COUNT - 1))",
  "HERO_TEXT_FADE_FRAME = 60",
  "const FRAME_COUNT = 185",
  "sequence-hero-bg-video",
  "weblane-bkg.mp4",
  "autoPlay",
  "playsInline",
  "is-start-visible",
  "fadeWindow",
  "drawFrame",
  "currentFrameRef"
];

for (const marker of motionMarkers) {
  assert(combinedSource.includes(marker), `Missing scroll-motion marker: ${marker}`);
}

const styleMarkers = [
  ".staggered-menu-wrapper",
  ".staggered-menu-header",
  ".staggered-menu-panel",
  ".sm-panel-item",
  ".sequence-hero",
  ".sequence-hero-sticky",
  ".sequence-hero-bg-video",
  ".sequence-hero-canvas",
  ".sequence-hero-title",
  ".sequence-hero-title::before",
  ".phrase-regular",
  ".phrase-heavy",
  ".image-bento-section",
  ".image-bento-grid",
  ".image-bento-card",
  ".image-bento-card figcaption",
  ".border-glow",
  ".gradual-blur",
  ".best-for-strip",
  ".rotating-text",
  ".scroll-velocity",
  ".transformation-stage",
  ".comparison-slider",
  ".comparison-divider",
  ".process-section",
  ".process-canvas",
  ".outcome-row",
  ".package-card",
  ".cta-form",
  ".horizontal-belief-track",
  ".cta-panel"
];

for (const marker of styleMarkers) {
  assert(combinedStyles.includes(marker), `Missing required style marker: ${marker}`);
}

assert(styles.includes('font-family: "Neue Montreal"'), "Headings should use Neue Montreal first");
assert(combinedStyles.includes('font-family: "Clash Display"'), "Bento overlay words should use Clash Display first");
assert(styles.includes('font-family: "General Sans"'), "Subtext should use General Sans first");
assert(styles.includes('font-family: "Manrope"'), "Hero regular words should use Manrope");
assert(styles.includes('font-family: "DM Sans"'), "Hero heavy words should use DM Sans");
assert(styles.includes("--text: #081316"), "Light theme text should use readable dark ink");
assert(styles.includes("--on-dark: #f8fafc"), "Dark panels should keep a separate readable text token");
assert(styles.includes("color: var(--on-dark-soft)"), "Dark panel paragraph copy should use the on-dark muted token");
assert(packageJson.includes('"tailwindcss"'), "Tailwind should be installed");
assert(packageJson.includes('"@tailwindcss/vite"'), "Tailwind Vite plugin should be installed");
assert(viteConfig.includes("tailwindcss()"), "Tailwind should be configured in Vite");
assert(styles.includes('@import "tailwindcss"'), "Tailwind CSS should be imported into the app styles");
assert(source.includes("DecryptedText"), "Loading intro should use DecryptedText");
assert(source.includes("speed={720}"), "Loading WebLane title should decrypt over about 5 seconds");
assert(source.includes("MIN_LOAD_TIME = 5000"), "Loading intro should stay visible for at least 5 seconds");
assert(source.includes('document.readyState === "complete"'), "Loading intro should wait for window resource loading");
assert(source.includes("waitForDocumentMedia"), "Loading intro should wait for document images and videos");
assert(source.includes("weblane:hero-sequence-ready"), "Loading intro should wait for the hero sequence frames");
assert(!source.includes('waitForEventOrFlag("weblane:process-sequence-ready"'), "Loading intro should not block on below-the-fold process frames");
assert(source.includes("IntersectionObserver"), "Process sequence should lazy-load near the process section");
assert(source.includes("requestIdleCallback"), "Image sequences should preload in idle batches");
assert(source.includes("MAX_LOAD_TIME = 45000"), "Loading intro should have a safety timeout if resources hang");
assert(styles.includes(".loading-intro.is-exiting"), "Loading intro should fade out after the loading gate completes");
assert(!styles.includes("loadingIntroExit 1450ms"), "Loading intro should not auto-hide after 1.45 seconds");
assert(source.includes("RotatingText"), "Best-for strip should use RotatingText");
assert(source.includes("ScrollVelocity"), "Velocity transition should use ScrollVelocity");
assert(source.includes("BorderGlow"), "Bento cards and copy should use BorderGlow");
assert(source.includes("GradualBlur"), "Bento cards should use GradualBlur");
assert(source.indexOf("<BestForStrip />") > source.indexOf("<SequenceHero />"), "Best-for strip should appear after the hero");
assert(source.indexOf("<ImageBentoSection />") > source.indexOf("<BestForStrip />"), "Bento should appear after the best-for strip");
assert(sequenceHero.includes('end: "bottom bottom"'), "Sequence hero should release smoothly as the next section enters");
assert(sequenceHero.includes("scrub: reduceMotion ? false : 0.45"), "Sequence hero should use softened scrub instead of a hard release");
assert(sequenceHero.includes("pinSpacing: false"), "Sequence hero spacing should be handled by the hero section height");
assert(styles.includes("height: 430svh"), "Sequence hero should reserve enough physical scroll space before the bento section");
assert(sequenceHero.includes("<h1 className=\"sequence-hero-title\""), "Hero headline should render as real text above the image sequence");
assert(styles.includes("z-index: 30"), "Hero headline should sit above the canvas/image sequence layer");
assert(styles.includes("0 0 18px rgba(59, 130, 246, 0.35)"), "Hero headline should have a subtle readable glow");
assert(sequenceHero.includes('window.matchMedia("(max-width: 768px)")'), "Hero canvas should switch to mobile contain sizing below 768px");
assert(source.includes('window.matchMedia("(max-width: 768px)")'), "Process canvas should switch to mobile contain sizing below 768px");
assert(combinedSource.includes("containScale"), "Mobile canvas rendering should use contain-style image scaling");
assert(styles.includes("@media (max-width: 768px)"), "Mobile-only animation sizing rules should be scoped below 768px");
assert(styles.includes(".sequence-hero-canvas,") && styles.includes(".process-canvas {") && styles.includes("max-width: 100vw"), "Mobile canvases should not overflow horizontally");
assert(styles.includes("object-fit: cover"), "Hero media should cover the viewport without side gaps");
assert(source.includes('<section className="section image-bento-section"'), "Bento section should not parallax upward into the hero");
assert(source.includes('<div className="image-bento-grid"'), "Bento grid should not use parallax transforms before its section starts");
assert(styles.includes("margin-top: clamp(90px, 12svh, 170px)"), "Bento section spacing should be narrower and intentional");
assert(styles.includes("box-shadow: none"), "Bento images should not sit inside created frame shadows");
assert(styles.includes("overflow: visible"), "Bento photos should not be clipped inside a created frame");
assert(!styles.includes("border: 1px solid rgba(248, 250, 252, 0.26)"), "Bento words should not be inside a bordered card");
assert(!styles.includes("box-shadow: 0 36px 110px rgba(15, 23, 42, 0.2)"), "Bento photos should not be wrapped in a created frame");
assert(!styles.includes(".image-bento-card::after"), "Bento photos should not use decorative overlay frames");
assert(!source.includes('".image-bento-card, .flight-step'), "Bento cards should not be clipped by generic reveal animation");
assert(source.includes("const PROCESS_FRAME_COUNT = 237"), "Process should use the extracted 237-frame image sequence");
assert(source.includes("/sequence/process/process_"), "Process should read frames from public/sequence/process");
assert(styles.includes(".process-text-state"), "Process should use dark text state overlays");
assert(styles.includes(".before-after-section"), "Before/After section should have its own visible section spacing");
assert(styles.includes("opacity: 1"), "Before/After slider should be visible by default after the bento cards");
assert(styles.includes("clip-path: polygon(var(--reveal-top) 0"), "After image should reveal with the shared slanted clip-path boundary");
assert(styles.includes("skewX(-13deg)"), "Before/After divider should be slanted");
assert(source.includes("setComparisonRevealPercent(4)") && source.includes("gsap.utils.interpolate(4, 50, self.progress)"), "Before/After auto reveal should stop around 50%");
assert(source.includes("onPointerDown={startComparisonDrag}"), "Before/After divider should support manual dragging");
assert(source.indexOf('className="comparison-layer comparison-before"') < source.indexOf('className="comparison-layer comparison-after"'), "Before image should be the base layer before the After reveal layer");
assert(source.includes("onKeyDown={handleComparisonKeyDown}"), "Before/After slider should support keyboard adjustment");
assert(source.includes("pin: true"), "Why WebLane should use pinned horizontal scrolling on desktop");
assert(styles.includes(".horizontal-belief-track"), "Why WebLane should use a horizontal track");
assert(!source.includes('".image-bento-card, .comparison-slider'), "Before/After slider should not be hidden by generic reveal animation");
assert(styles.includes("weblaneLiveGradient"), "Page background should use a live animated gradient");
assert(styles.includes("brightness(1.38)"), "Hero background video should be visually lightened");
assert(!combinedSource.includes("SplineHero"), "Previous Spline hero should be removed");
assert(!combinedSource.includes("FloatingLines"), "ReactBits FloatingLines should be removed from source");
assert(!styles.includes("hero-floating-lines"), "ReactBits hero background styles should be removed");
assert(!staggeredMenuStyles.includes("backdrop-filter"), "Navbar glassmorphism should be removed");
assert(!styles.includes(".site-nav nav"), "Closed navbar should not expose old section-label nav styling");
assert(!combinedSource.includes("service-card"), "Generic service-card layout should be removed");
assert(!styles.includes(".service-card"), "Generic service-card styles should be removed");
assert(!combinedSource.includes("state-block"), "Before/After should use a slider, not generic state cards");
assert(!styles.includes(".state-block"), "Before/After card styles should be removed");
assert(!source.includes("<Services"), "Services section should not be present");
assert(!source.includes("<SelectedWork"), "Selected Work section should be removed");
assert(!combinedSource.includes("Featured Project"), "Selected Work placeholder projects should be removed");
assert(source.includes('type="date"'), "CTA form should include a native date picker");
assert(source.includes("<select name=\"time\""), "CTA form should include a time slot dropdown");

const frames = readdirSync(new URL("../public/sequence/hero", import.meta.url)).filter((name) => /^hero_\d{4}\.png$/.test(name));
assert.equal(frames.length, 185, "Hero should use the final 185-frame sequence");
assert(frames.includes("hero_0185.png"), "Hero should include frame 185");
assert(existsSync(new URL("../public/weblane-bkg.mp4", import.meta.url)), "Hero background video should exist in public assets");
for (const asset of ["Long.png", "short1.png", "short2.png", "before image.png", "after image.png"]) {
  assert(existsSync(new URL(`../public/sections/${asset}`, import.meta.url)), `Missing provided section asset: ${asset}`);
}
assert(source.includes("StaggeredMenu"), "Navbar should use the React Bits StaggeredMenu integration");
assert(source.includes("ScrollTrigger.batch(cardTargets"), "Cards should use batched GSAP in/out animation");
assert(styles.includes("will-change: transform, opacity, filter"), "Animated cards should use compositor-friendly hints");
assert(staggeredMenuStyles.includes("font-size: clamp(1.7rem, 4vw, 3.35rem)"), "Staggered menu tab fonts should be smaller");
