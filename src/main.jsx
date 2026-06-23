import { createRoot } from "react-dom/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SequenceHero from "./SequenceHero.jsx";
import BorderGlow from "./components/BorderGlow.jsx";
import DecryptedText from "./components/DecryptedText.jsx";
import GradualBlur from "./components/GradualBlur.jsx";
import RotatingText from "./components/RotatingText.jsx";
import ScrollVelocity from "./components/ScrollVelocity.jsx";
import StaggeredMenu from "./components/StaggeredMenu.jsx";
import "./styles.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const bentoImages = [
  {
    className: "image-bento-card-long",
    src: "/sections/Long.png",
    alt: "WebLane premium website concept with 3D digital presence",
    eyebrow: "Wake-up call",
    copy: "Your website already made an impression."
  },
  {
    className: "image-bento-card-short",
    src: "/sections/short1.png",
    alt: "Handshake over planning documents for a WebLane project",
    eyebrow: "Trust check",
    copy: "People judge your business before they read a single word."
  },
  {
    className: "image-bento-card-short",
    src: "/sections/short2.png",
    alt: "Laptop planning workspace for website modification",
    eyebrow: "Second look",
    copy: "Most websites are forgotten within seconds."
  }
];

const processStages = [
  {
    id: "discovery",
    frameStart: 1,
    frameEnd: 34,
    heading: "Discovery",
    subheading: "We begin by understanding your business, your audience, and what makes you different.",
    position: "center"
  },
  {
    id: "strategy",
    frameStart: 60,
    frameEnd: 70,
    heading: "Strategy",
    subheading: "We map the journey, define the message, and plan every interaction.",
    position: "split"
  },
  {
    id: "audit",
    frameStart: 85,
    frameEnd: 100,
    heading: "Audit",
    subheading: "We analyze what works, identify gaps, and find the opportunity.",
    position: "right"
  },
  {
    id: "structure",
    frameStart: 125,
    frameEnd: 135,
    heading: "Structure",
    subheading: "We build the architecture that makes your message clear and your site fast.",
    position: "right"
  },
  {
    id: "message",
    frameStart: 150,
    frameEnd: 165,
    heading: "Message",
    subheading: "We craft the words and visuals that make people remember you.",
    position: "split"
  },
  {
    id: "experience",
    frameStart: 180,
    frameEnd: 200,
    heading: "Experience & Launch",
    subheading: "We refine every detail, test everything, and launch with confidence.",
    position: "center"
  }
];

const outcomes = ["More trust", "Better first impressions", "More inquiries", "Stronger positioning", "Higher perceived value"];

const packages = [
  {
    title: "Basic Website",
    price: "From $799",
    description: "One-time professional website build for businesses that need a clean, trustworthy online presence.",
    includes: ["No 3D website", "Clean responsive design", "Service/content structure", "Basic conversion-focused layout", "Contact section"]
  },
  {
    title: "Enhanced Website",
    price: "From $1,499",
    description: "A sharper website with minimal animation and subtle 3D/premium visual depth.",
    includes: ["Minimal animation", "Light 3D or interactive visual elements", "Stronger homepage storytelling", "Responsive layout", "Conversion-focused CTA flow"]
  },
  {
    title: "Signature Website",
    price: "Up to $10,000",
    description: "Full award-worthy website experience for brands that want a premium, memorable, high-converting online presence.",
    includes: ["Advanced motion direction", "Full 3D/interactive website experience", "Premium section design", "High-end visual system", "Unlimited requests during the agreed build period"]
  }
];

const menuItems = [
  { label: "Reality Check", link: "#reality" },
  { label: "Before / After", link: "#before-after" },
  { label: "Process", link: "#process" },
  { label: "Outcomes", link: "#outcomes" },
  { label: "Packages", link: "#packages" },
  { label: "Why WebLane", link: "#why-weblane" },
  { label: "Start a Project", link: "#cta" }
];

const bestForItems = [
  "Local Businesses",
  "Clinics & Dentals",
  "Barbershops & Salons",
  "Physical & online businesses",
  "Hardware & Construction services",
  "and more!"
];

function Nav() {
  return (
    <StaggeredMenu
      items={menuItems}
      colors={["#3b82f6", "#14b8a6"]}
      accentColor="#14b8a6"
      menuButtonColor="#f8fafc"
      openMenuButtonColor="#081316"
      logoUrl="/Weblane Logo.png"
    />
  );
}

function LoadingIntro({ isVisible, isExiting }) {
  if (!isVisible) return null;

  return (
    <div className={`loading-intro ${isExiting ? "is-exiting" : ""}`} role="status" aria-live="polite">
      <DecryptedText
        text="WebLane"
        speed={720}
        maxIterations={7}
        sequential
        revealDirection="center"
        animateOn="view"
        className="loading-intro-text"
        encryptedClassName="loading-intro-encrypted"
      />
      <span>Loading the signature moment</span>
    </div>
  );
}

function BestForStrip() {
  return (
    <section className="best-for-strip" aria-label="Who WebLane is best for">
      <span>Best for</span>
      <RotatingText items={bestForItems} />
    </section>
  );
}

function VelocityTransition() {
  return (
    <section className="velocity-transition" aria-label="WebLane brand motion statement">
      <ScrollVelocity text="Weblane Never Settle For Less" />
    </section>
  );
}

function ImageBentoSection() {
  return (
    <section className="section image-bento-section" id="reality">
      <div className="image-bento-grid" aria-label="WebLane visual bento gallery">
        {bentoImages.map((image) => (
          <BorderGlow as="figure" className={`image-bento-card ${image.className}`} key={image.src}>
            <img src={image.src} alt={image.alt} loading="eager" fetchPriority="high" />
            <GradualBlur />
            <figcaption>
              <span>{image.eyebrow}</span>
              <BorderGlow as="strong" className="bento-copy-glow">{image.copy}</BorderGlow>
            </figcaption>
          </BorderGlow>
        ))}
      </div>
    </section>
  );
}

function BeforeAfter() {
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);
  const isDraggingRef = useRef(false);

  const setComparisonReveal = useCallback((clientX) => {
    const slider = sliderRef.current;
    const stage = sectionRef.current?.querySelector(".transformation-stage");
    if (!slider || !stage) return;

    const rect = slider.getBoundingClientRect();
    const nextReveal = Math.min(96, Math.max(4, ((clientX - rect.left) / rect.width) * 100));
    stage.style.setProperty("--reveal", `${nextReveal}%`);
  }, []);

  const startComparisonDrag = useCallback((event) => {
    isDraggingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setComparisonReveal(event.clientX);
  }, [setComparisonReveal]);

  const moveComparisonDrag = useCallback((event) => {
    if (!isDraggingRef.current) return;
    setComparisonReveal(event.clientX);
  }, [setComparisonReveal]);

  const endComparisonDrag = useCallback((event) => {
    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }, []);

  useGSAP(
    () => {
      const stage = sectionRef.current?.querySelector(".transformation-stage");
      if (!stage) return undefined;

      gsap.set(stage, { "--reveal": "1%" });
      gsap.fromTo(
        stage,
        { "--reveal": "1%" },
        {
          "--reveal": "90%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 76%",
            end: "bottom 28%",
            scrub: true
          }
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section className="section before-after-section parallax-section" id="before-after" ref={sectionRef}>
      <div className="section-copy">
        <p className="section-kicker">Before / After</p>
        <h2>One of the strongest sections.</h2>
      </div>
      <div className="transformation-stage parallax-visual">
        <div
          className="comparison-slider"
          ref={sliderRef}
          aria-label="Before and after website transformation slider"
          role="slider"
          aria-valuemin="4"
          aria-valuemax="96"
          aria-valuenow="50"
          tabIndex={0}
          onPointerDown={startComparisonDrag}
          onPointerMove={moveComparisonDrag}
          onPointerUp={endComparisonDrag}
          onPointerCancel={endComparisonDrag}
        >
          <div className="comparison-layer comparison-after">
            <img src="/sections/after image.png" alt="After website state" loading="eager" fetchPriority="high" />
            <span>After</span>
          </div>
          <div className="comparison-layer comparison-before">
            <img src="/sections/before image.png" alt="Before website state" loading="eager" fetchPriority="high" />
            <span>Before</span>
          </div>
          <div className="comparison-divider" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}

const PROCESS_FRAME_COUNT = 237;
const processFramePath = (index) => `/sequence/process/process_${String(index + 1).padStart(4, "0")}.png`;

function Process() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const activeStageRef = useRef(null);
  const frameSources = useMemo(() => Array.from({ length: PROCESS_FRAME_COUNT }, (_, index) => processFramePath(index)), []);

  const drawFrame = useCallback((frameIndex = currentFrameRef.current) => {
    const canvas = canvasRef.current;
    let image = imagesRef.current[frameIndex];

    if (!image?.complete) {
      for (let offset = 1; offset < PROCESS_FRAME_COUNT; offset += 1) {
        const previous = imagesRef.current[frameIndex - offset];
        const next = imagesRef.current[frameIndex + offset];
        if (previous?.complete) {
          image = previous;
          break;
        }
        if (next?.complete) {
          image = next;
          break;
        }
      }
    }

    if (!canvas || !image?.complete) return;

    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.clearRect(0, 0, width, height);

    const imageRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = width / height;
    const coverByHeight = imageRatio > canvasRatio;
    const drawWidth = coverByHeight ? height * imageRatio : width;
    const drawHeight = coverByHeight ? height : width / imageRatio;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, x, y, drawWidth, drawHeight);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let loadedFrames = 0;
    let hasAnnouncedReady = false;
    let hasStartedLoading = false;
    let observer;
    const idleHandles = [];
    const timeoutHandles = [];

    const announceReady = () => {
      if (hasAnnouncedReady || cancelled) return;
      hasAnnouncedReady = true;
      window.__WEBLANE_PROCESS_SEQUENCE_READY = true;
      window.dispatchEvent(new CustomEvent("weblane:process-sequence-ready"));
    };

    const loadedImages = new Array(PROCESS_FRAME_COUNT);
    imagesRef.current = loadedImages;

    const schedule = (callback, delay = 0) => {
      if ("requestIdleCallback" in window) {
        const handle = window.requestIdleCallback(callback, { timeout: 1000 });
        idleHandles.push(handle);
        return;
      }

      const handle = window.setTimeout(callback, delay);
      timeoutHandles.push(handle);
    };

    const loadFrame = (index) => {
      if (cancelled || loadedImages[index]) return;

      const image = new Image();
      image.decoding = "async";
      loadedImages[index] = image;
      image.onload = () => {
        loadedFrames += 1;
        if (cancelled) return;

        if (index === 0) {
          window.requestAnimationFrame(() => drawFrame(0));
          announceReady();
        }
        if (loadedFrames === PROCESS_FRAME_COUNT) {
          drawFrame(currentFrameRef.current);
          ScrollTrigger.refresh();
        }
      };
      image.onerror = () => {
        loadedFrames += 1;
        if (index === 0) announceReady();
      };
      image.src = frameSources[index];
    };

    const loadBatch = (startIndex) => {
      if (cancelled || startIndex >= PROCESS_FRAME_COUNT) return;

      const endIndex = Math.min(PROCESS_FRAME_COUNT, startIndex + 8);
      for (let index = startIndex; index < endIndex; index += 1) {
        loadFrame(index);
      }

      schedule(() => loadBatch(endIndex), 70);
    };

    const startLoading = () => {
      if (hasStartedLoading || cancelled) return;
      hasStartedLoading = true;
      loadFrame(0);
      schedule(() => loadBatch(1), 160);
    };

    if ("IntersectionObserver" in window && sectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            startLoading();
            observer?.disconnect();
          }
        },
        { rootMargin: "1800px 0px" }
      );
      observer.observe(sectionRef.current);
    } else {
      schedule(startLoading, 1000);
    }

    const onResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      observer?.disconnect();
      idleHandles.forEach((handle) => window.cancelIdleCallback?.(handle));
      timeoutHandles.forEach((handle) => window.clearTimeout(handle));
      window.removeEventListener("resize", onResize);
    };
  }, [drawFrame, frameSources]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      if (!section || !sticky) return undefined;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const states = gsap.utils.toArray(".process-text-state", section);

      const updateTextState = (frameNumber) => {
        const activeStage = processStages.find((stage) => frameNumber >= stage.frameStart && frameNumber <= stage.frameEnd)?.id || null;
        if (activeStage === activeStageRef.current) return;

        activeStageRef.current = activeStage;
        gsap.to(states, { autoAlpha: 0, duration: reduceMotion ? 0 : 0.28, ease: "power2.out", overwrite: true });

        if (activeStage) {
          const activeElement = section.querySelector(`[data-process-state="${activeStage}"]`);
          gsap.to(activeElement, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.42, ease: "power2.out", overwrite: true });
        }
      };

      const renderByProgress = (progress) => {
        const frame = Math.min(PROCESS_FRAME_COUNT - 1, Math.max(0, Math.round(progress * (PROCESS_FRAME_COUNT - 1))));
        currentFrameRef.current = frame;
        drawFrame(frame);
        updateTextState(frame + 1);
      };

      gsap.set(states, { autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: reduceMotion ? false : 0.45,
        pin: sticky,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => renderByProgress(self.progress)
      });

      renderByProgress(0);
      ScrollTrigger.refresh();
    },
    { scope: sectionRef, dependencies: [drawFrame] }
  );

  return (
    <section className="process-section" id="process" ref={sectionRef} aria-label="WebLane process sequence">
      <div className="process-sticky" ref={stickyRef}>
        <div className="process-canvas-wrap" aria-label="Scroll-controlled WebLane process animation">
          <canvas className="process-canvas" ref={canvasRef} data-frame-count={PROCESS_FRAME_COUNT} />
        </div>
        <div className="process-text-layer" aria-live="polite">
          <article className="process-text-state process-text-center" data-process-state="discovery" data-start-frame="0001" data-end-frame="0034">
            <h3>Discovery</h3>
            <p>We uncover what your website needs to make your business clearer, easier to trust, and easier to choose.</p>
          </article>

          <article className="process-text-state process-text-split" data-process-state="strategy" data-start-frame="0060" data-end-frame="0070">
            <p>Strategy turns scattered ideas into a guided direction.</p>
            <p>Every page, section, and action gets a reason to exist.</p>
          </article>

          <article className="process-text-state process-text-right" data-process-state="audit" data-start-frame="0085" data-end-frame="0100">
            <h3>Audit</h3>
            <p>We find the trust gaps, confusing moments, and missed opportunities that stop visitors from becoming inquiries.</p>
          </article>

          <article className="process-text-state process-text-left" data-process-state="structure" data-start-frame="0125" data-end-frame="0135">
            <h3>Message &amp; Structure</h3>
            <p>We shape the message and organize the flow so visitors understand the offer quickly and know exactly what to do next.</p>
          </article>

          <article className="process-text-state process-text-left" data-process-state="message" data-start-frame="0150" data-end-frame="0165">
            <h3>Experience</h3>
            <p>Experience makes the website feel clear, polished, and easy to move through. Smooth flow. Strong trust. No confusing friction.</p>
          </article>

          <article className="process-text-state process-text-center" data-process-state="experience" data-start-frame="0180" data-end-frame="0200">
            <h3>Experience and Launch</h3>
            <p>We polish the interaction, test the details, and launch a website that feels ready for real visitors.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function Outcomes() {
  return (
    <section className="section outcomes parallax-section" id="outcomes">
      <div className="section-copy">
        <p className="section-kicker">What changes after launch?</p>
        <h2>This is where the website sells outcomes.</h2>
      </div>
      <div className="outcome-list parallax-visual">
        {outcomes.map((outcome) => (
          <div className="outcome-row" key={outcome}>
            <span>{outcome}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Packages() {
  return (
    <section className="section packages-section parallax-section" id="packages">
      <div className="section-copy">
        <p className="section-kicker">Packages</p>
        <h2>Choose the build that matches how memorable you want the website to feel.</h2>
      </div>
      <div className="package-grid parallax-visual">
        {packages.map((packageItem) => (
          <article className="package-card" key={packageItem.title}>
            <div>
              <span>{packageItem.title}</span>
              <strong>{packageItem.price}</strong>
              <p>{packageItem.description}</p>
            </div>
            <ul>
              {packageItem.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a href="#cta">Start this package</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function WhyWebLane() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return undefined;

      const media = gsap.matchMedia();

      media.add("(min-width: 821px)", () => {
        const scrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

        return gsap.to(track, {
          x: () => -scrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${scrollDistance()}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section className="why-weblane horizontal-belief" id="why-weblane" ref={sectionRef}>
      <div className="horizontal-belief-track" ref={trackRef}>
        <p>Most websites are forgotten within seconds.</p>
        <p>We create the moment people remember.</p>
        <p>Every great brand has a signature.</p>
        <p>
          Your website should feel like: <strong>“I get it. I want this. Let’s talk.”</strong>
        </p>
        <p>
          not <span>“Please continue scrolling through my 14-page brochure.”</span>
        </p>
      </div>
    </section>
  );
}

function FinalCTA() {
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    country: "",
    phone: "",
    email: "",
    date: "",
    time: ""
  });

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitInquiry = (event) => {
    event.preventDefault();

    const body = [
      `Name: ${form.name}`,
      `Business name: ${form.businessName}`,
      `Country: ${form.country}`,
      `Phone Number: ${form.phone}`,
      `Email: ${form.email}`,
      `Meeting availability: ${form.date} at ${form.time}`
    ].join("\n");

    window.location.href = `mailto:ababonkrishanmiguel@gmail.com?subject=${encodeURIComponent("New WebLane project inquiry")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="section final-cta parallax-section" id="cta">
      <div className="cta-panel parallax-visual">
        <div className="cta-copy">
          <p className="section-kicker">Start the upgrade</p>
          <h2>Are you really gonna settle for a basic, slow, non-converting website?</h2>
        </div>
        <form className="cta-form" onSubmit={submitInquiry}>
          <label>
            Name
            <input name="name" value={form.name} onChange={updateForm} required />
          </label>
          <label>
            Business name
            <input name="businessName" value={form.businessName} onChange={updateForm} required />
          </label>
          <label>
            Country
            <input name="country" value={form.country} onChange={updateForm} required />
          </label>
          <label>
            Phone Number
            <input name="phone" type="tel" value={form.phone} onChange={updateForm} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateForm} required />
          </label>
          <div className="meeting-fields">
            <label>
              Meeting date
              <input name="date" type="date" value={form.date} onChange={updateForm} required />
            </label>
            <label>
              Time slot
              <select name="time" value={form.time} onChange={updateForm} required>
                <option value="">Select a time</option>
                <option>9:00 AM</option>
                <option>10:30 AM</option>
                <option>1:00 PM</option>
                <option>3:00 PM</option>
                <option>5:00 PM</option>
              </select>
            </label>
          </div>
          <button type="submit">Send Project Inquiry</button>
        </form>
      </div>
    </section>
  );
}

function App() {
  const pageRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const MIN_LOAD_TIME = 5000;
    const MAX_LOAD_TIME = 45000;

    const waitForEventOrFlag = (eventName, flagName) => new Promise((resolve) => {
      if (window[flagName]) {
        resolve();
        return;
      }

      window.addEventListener(eventName, resolve, { once: true });
    });

    const waitForWindowLoad = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }

      window.addEventListener("load", resolve, { once: true });
    });

    const waitForFonts = document.fonts?.ready?.catch(() => undefined) ?? Promise.resolve();

    const waitForDocumentMedia = new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        const images = Array.from(document.images);
        const videos = Array.from(document.querySelectorAll("video"));

        const imagePromises = images.map((image) => {
          if (image.complete && image.naturalWidth > 0) return Promise.resolve();
          if (image.decode) return image.decode().catch(() => undefined);

          return new Promise((imageResolve) => {
            image.addEventListener("load", imageResolve, { once: true });
            image.addEventListener("error", imageResolve, { once: true });
          });
        });

        const videoPromises = videos.map((video) => {
          if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return Promise.resolve();

          return new Promise((videoResolve) => {
            video.addEventListener("loadeddata", videoResolve, { once: true });
            video.addEventListener("error", videoResolve, { once: true });
          });
        });

        Promise.all([...imagePromises, ...videoPromises]).then(resolve);
      });
    });

    const minimumDuration = new Promise((resolve) => {
      window.setTimeout(resolve, MIN_LOAD_TIME);
    });

    const maximumDuration = new Promise((resolve) => {
      window.setTimeout(resolve, MAX_LOAD_TIME);
    });

    const resourceGate = Promise.all([
      waitForWindowLoad,
      waitForFonts,
      waitForDocumentMedia,
      waitForEventOrFlag("weblane:hero-sequence-ready", "__WEBLANE_HERO_SEQUENCE_READY"),
      minimumDuration
    ]);

    Promise.race([resourceGate, maximumDuration]).then(() => {
      if (!isMounted) return;

      setIsLoaderExiting(true);

      window.setTimeout(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      }, 650);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.from(".staggered-menu-header", {
        y: -24,
        autoAlpha: 0,
        duration: reduceMotion ? 0 : 0.8,
        ease: "power3.out"
      });

      gsap.utils.toArray(".parallax-section").forEach((section) => {
        const sectionCopy = section.querySelector(".section-copy");
        const parallaxVisual = section.querySelector(".parallax-visual");

        if (sectionCopy) {
          gsap.fromTo(
            sectionCopy,
            { y: 80, autoAlpha: 0, filter: "blur(12px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                end: "top 38%",
                scrub: reduceMotion ? false : true
              }
            }
          );
        }

        if (parallaxVisual) {
          gsap.fromTo(
            parallaxVisual,
            { y: 90, scale: 0.96 },
            {
              y: -30,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: reduceMotion ? false : true
              }
            }
          );
        }
      });

      const cardTargets = gsap.utils.toArray(".image-bento-card, .outcome-row, .package-card, .work-panel");
      gsap.set(cardTargets, {
        autoAlpha: 0,
        y: 58,
        scale: 0.965,
        rotateZ: -0.75,
        filter: "blur(10px)",
        transformOrigin: "50% 60%",
        willChange: "transform, opacity, filter"
      });

      ScrollTrigger.batch(cardTargets, {
        interval: 0.08,
        batchMax: 4,
        start: "top 88%",
        end: "bottom 12%",
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateZ: 0,
            filter: "blur(0px)",
            duration: reduceMotion ? 0 : 0.9,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: true
          });
        },
        onEnterBack: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateZ: 0,
            filter: "blur(0px)",
            duration: reduceMotion ? 0 : 0.7,
            ease: "power3.out",
            stagger: 0.06,
            overwrite: true
          });
        },
        onLeave: (batch) => {
          gsap.to(batch, {
            autoAlpha: 0.28,
            y: -42,
            scale: 0.985,
            rotateZ: 0.45,
            filter: "blur(8px)",
            duration: reduceMotion ? 0 : 0.55,
            ease: "power2.out",
            stagger: 0.04,
            overwrite: true
          });
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            autoAlpha: 0,
            y: 58,
            scale: 0.965,
            rotateZ: -0.75,
            filter: "blur(10px)",
            duration: reduceMotion ? 0 : 0.5,
            ease: "power2.out",
            stagger: 0.04,
            overwrite: true
          });
        }
      });

      ScrollTrigger.refresh();
    },
    { scope: pageRef }
  );

  return (
    <main className="page-shell antialiased" ref={pageRef}>
      <LoadingIntro isVisible={isLoading} isExiting={isLoaderExiting} />
      <Nav />
      <SequenceHero />
      <BestForStrip />
      <VelocityTransition />
      <ImageBentoSection />
      <BeforeAfter />
      <Process />
      <Outcomes />
      <Packages />
      <WhyWebLane />
      <FinalCTA />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
