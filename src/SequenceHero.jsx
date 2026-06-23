import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const RENDER_FPS = 50;
const FRAME_COUNT = 185;
const RENDER_DURATION_SECONDS = FRAME_COUNT / RENDER_FPS;
const HERO_TEXT_FADE_FRAME = 60;
const HERO_TEXT_FADE_PROGRESS = (HERO_TEXT_FADE_FRAME - 1) / (FRAME_COUNT - 1);
const framePath = (index) => `/sequence/hero/hero_${String(index + 1).padStart(4, "0")}.png`;

export default function SequenceHero() {
  const heroRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const bgVideoRef = useRef(null);
  const bgStartVideoRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const isReadyRef = useRef(false);
  const frameSources = useMemo(() => Array.from({ length: FRAME_COUNT }, (_, index) => framePath(index)), []);

  const drawFrame = useCallback((frameIndex = currentFrameRef.current) => {
    const canvas = canvasRef.current;
    let image = imagesRef.current[frameIndex];

    if (!image?.complete) {
      for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
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

    const isMobileCanvas = window.matchMedia("(max-width: 768px)").matches;
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = width / height;
    const coverByHeight = imageRatio > canvasRatio;
    const containScale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = isMobileCanvas ? image.naturalWidth * containScale : coverByHeight ? height * imageRatio : width;
    const drawHeight = isMobileCanvas ? image.naturalHeight * containScale : coverByHeight ? height : width / imageRatio;
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
    const idleHandles = [];
    const timeoutHandles = [];

    const announceReady = () => {
      if (hasAnnouncedReady || cancelled) return;
      hasAnnouncedReady = true;
      window.__WEBLANE_HERO_SEQUENCE_READY = true;
      window.dispatchEvent(new CustomEvent("weblane:hero-sequence-ready"));
    };

    imagesRef.current = new Array(FRAME_COUNT);

    const schedule = (callback, delay = 0) => {
      if ("requestIdleCallback" in window) {
        const handle = window.requestIdleCallback(callback, { timeout: 900 });
        idleHandles.push(handle);
        return;
      }

      const handle = window.setTimeout(callback, delay);
      timeoutHandles.push(handle);
    };

    const loadFrame = (index) => {
      if (cancelled || imagesRef.current[index]) return;

      const image = new Image();
      image.decoding = "async";
      imagesRef.current[index] = image;
      image.onload = () => {
        loadedFrames += 1;

        if (cancelled) return;

        if (index === 0) {
          drawFrame(0);
          announceReady();
        }

        if (loadedFrames === FRAME_COUNT) {
          isReadyRef.current = true;
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
      if (cancelled || startIndex >= FRAME_COUNT) return;

      const endIndex = Math.min(FRAME_COUNT, startIndex + 8);
      for (let index = startIndex; index < endIndex; index += 1) {
        loadFrame(index);
      }

      schedule(() => loadBatch(endIndex), 50);
    };

    loadFrame(0);
    schedule(() => loadBatch(1), 120);

    const onResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      idleHandles.forEach((handle) => window.cancelIdleCallback?.(handle));
      timeoutHandles.forEach((handle) => window.clearTimeout(handle));
      window.removeEventListener("resize", onResize);
    };
  }, [drawFrame, frameSources]);

  useEffect(() => {
    const video = bgVideoRef.current;
    const startVideo = bgStartVideoRef.current;
    if (!video || !startVideo) return undefined;

    let isCrossfading = false;
    let restoreTimer;
    const fadeWindow = 0.58;

    const hideStartFrame = () => {
      window.clearTimeout(restoreTimer);
      restoreTimer = window.setTimeout(() => {
        startVideo.classList.remove("is-start-visible");
        isCrossfading = false;
      }, 90);
    };

    const prepareStartFrame = () => {
      if (Number.isFinite(startVideo.duration) && startVideo.duration > 0) {
        startVideo.pause();
        startVideo.currentTime = 0;
      }
    };

    const handleTimeUpdate = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      const remaining = video.duration - video.currentTime;

      if (!isCrossfading && remaining <= fadeWindow) {
        isCrossfading = true;
        prepareStartFrame();
        startVideo.classList.add("is-start-visible");
        return;
      }

      if (isCrossfading && video.currentTime <= 0.18) {
        hideStartFrame();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    startVideo.addEventListener("loadedmetadata", prepareStartFrame);

    return () => {
      window.clearTimeout(restoreTimer);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      startVideo.removeEventListener("loadedmetadata", prepareStartFrame);
    };
  }, []);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobileCanvas = window.matchMedia("(max-width: 768px)").matches;

      gsap.set(".sequence-hero-title", {
        autoAlpha: 1,
        yPercent: 0,
        filter: "blur(0px)"
      });

      gsap.set(".sequence-hero-canvas-wrap", {
        scale: isMobileCanvas ? 1 : 1.05,
        yPercent: isMobileCanvas ? 0 : 2,
        rotateX: 0,
        transformOrigin: "50% 50%"
      });

      const renderByProgress = (progress) => {
        const frame = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(progress * (FRAME_COUNT - 1))));

        if (frame !== currentFrameRef.current || isReadyRef.current) {
          currentFrameRef.current = frame;
          drawFrame(frame);
        }
      };

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: reduceMotion ? false : 0.45,
          pin: stickyRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -10,
          onUpdate: (self) => renderByProgress(self.progress)
        }
      });

      timeline
        .to(".sequence-hero-canvas-wrap", { scale: 1, yPercent: 0, duration: 0.38 }, 0)
        .to(".sequence-hero-title", { yPercent: -1.5, filter: "blur(0px)", autoAlpha: 1, duration: HERO_TEXT_FADE_PROGRESS }, 0)
        .to(".sequence-hero-title", { yPercent: -8, filter: "blur(12px)", autoAlpha: 0, duration: 0.08 }, HERO_TEXT_FADE_PROGRESS)
        .to(".sequence-hero-bg-video", { yPercent: -3, scale: 1.04, duration: 1 }, 0);

      renderByProgress(0);
      ScrollTrigger.refresh();
    },
    { scope: heroRef, dependencies: [drawFrame] }
  );

  return (
    <section className="sequence-hero" id="top" ref={heroRef}>
      <div className="sequence-hero-sticky" ref={stickyRef}>
        <video
          className="sequence-hero-bg-video sequence-hero-bg-video-main"
          src="/weblane-bkg.mp4"
          ref={bgVideoRef}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <video
          className="sequence-hero-bg-video sequence-hero-bg-video-start"
          src="/weblane-bkg.mp4"
          ref={bgStartVideoRef}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="sequence-hero-bg-overlay" aria-hidden="true" />
        <div className="sequence-hero-canvas-wrap" aria-label="Scroll-controlled WebLane 3D website visual">
          <canvas
            className="sequence-hero-canvas"
            ref={canvasRef}
            data-frame-count={FRAME_COUNT}
            data-fps={RENDER_FPS}
            data-duration={RENDER_DURATION_SECONDS}
          />
        </div>
        <h1 className="sequence-hero-title" aria-label="You Deserve the kind of website your competitors wish they had.">
          <span className="phrase-line">
            <span className="phrase-regular">You </span>
            <span className="phrase-heavy">Deserve</span>
          </span>
          <span className="phrase-line">
            <span className="phrase-regular">the kind of </span>
            <span className="phrase-heavy">website</span>
          </span>
          <span className="phrase-line">
            <span className="phrase-regular">your </span>
            <span className="phrase-heavy">competitors</span>
            <span className="phrase-regular"> wish</span>
          </span>
          <span className="phrase-line">
            <span className="phrase-regular">they </span>
            <span className="phrase-heavy">had.</span>
          </span>
        </h1>
      </div>
    </section>
  );
}
