import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./StaggeredMenu.css";

export default function StaggeredMenu({
  position = "right",
  colors = ["#3b82f6", "#14b8a6"],
  items = [],
  logoUrl = "/Weblane Logo.png",
  menuButtonColor = "#f8fafc",
  openMenuButtonColor = "#081316",
  accentColor = "#14b8a6",
  closeOnClickAway = true
}) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);
  const textInnerRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const busyRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      const preLayers = preContainer ? Array.from(preContainer.querySelectorAll(".sm-prelayer")) : [];
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInner, { yPercent: 0 });
      gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });

    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(panel.querySelectorAll(".sm-panel-item"));
    const offscreen = position === "left" ? -100 : 100;

    gsap.set(itemEls, { yPercent: 120, rotate: 5 });
    gsap.set(numberEls, { "--sm-num-opacity": 0 });

    const timeline = gsap.timeline({ paused: true });
    layers.forEach((layer, index) => {
      timeline.fromTo(layer, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: "power4.out" }, index * 0.07);
    });

    const panelStart = layers.length ? (layers.length - 1) * 0.07 + 0.08 : 0;
    timeline.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: 0.68, ease: "power4.out" }, panelStart);
    timeline.to(
      itemEls,
      {
        yPercent: 0,
        rotate: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: { each: 0.075, from: "start" }
      },
      panelStart + 0.12
    );
    timeline.to(numberEls, { duration: 0.5, ease: "power2.out", "--sm-num-opacity": 1, stagger: 0.055 }, panelStart + 0.2);

    openTlRef.current = timeline;
    return timeline;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const timeline = buildOpenTimeline();
    if (!timeline) {
      busyRef.current = false;
      return;
    }

    timeline.eventCallback("onComplete", () => {
      busyRef.current = false;
    });
    timeline.play(0);
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const offscreen = position === "left" ? -100 : 100;
    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        busyRef.current = false;
      }
    });
  }, [position]);

  const animateToggle = useCallback(
    (opening) => {
      gsap.to(iconRef.current, { rotate: opening ? 225 : 0, duration: opening ? 0.75 : 0.35, ease: "power4.out", overwrite: "auto" });
      gsap.to(textInnerRef.current, { yPercent: opening ? -50 : 0, duration: 0.46, ease: "power4.out", overwrite: "auto" });
      gsap.to(toggleBtnRef.current, { color: opening ? openMenuButtonColor : menuButtonColor, duration: 0.24, ease: "power2.out" });
    },
    [menuButtonColor, openMenuButtonColor]
  );

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    playClose();
    animateToggle(false);
  }, [animateToggle, playClose]);

  const toggleMenu = useCallback(() => {
    const nextOpen = !openRef.current;
    openRef.current = nextOpen;
    setOpen(nextOpen);
    if (nextOpen) {
      playOpen();
    } else {
      playClose();
    }
    animateToggle(nextOpen);
  }, [animateToggle, playClose, playOpen]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return undefined;

    const handleClickOutside = (event) => {
      if (panelRef.current?.contains(event.target) || toggleBtnRef.current?.contains(event.target)) return;
      closeMenu();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu, closeOnClickAway, open]);

  return (
    <div
      className="staggered-menu-wrapper fixed-wrapper"
      style={accentColor ? { "--sm-accent": accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {colors.map((color) => (
          <div key={color} className="sm-prelayer" style={{ background: color }} />
        ))}
      </div>
      <header className="staggered-menu-header" aria-label="Main navigation header">
        <a href="#top" className="sm-logo" aria-label="WebLane home" onClick={closeMenu}>
          <img src={logoUrl} alt="WebLane" className="sm-logo-img" draggable={false} />
        </a>
        <button
          ref={toggleBtnRef}
          className="sm-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              <span className="sm-toggle-line">Menu</span>
              <span className="sm-toggle-line">Close</span>
            </span>
          </span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span ref={plusHRef} className="sm-icon-line" />
            <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </header>

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <nav className="sm-panel-inner" aria-label="Primary navigation">
          <ul className="sm-panel-list" role="list" data-numbering>
            {items.map((item, index) => (
              <li className="sm-panel-itemWrap" key={item.label}>
                <a className="sm-panel-item" href={item.link} aria-label={item.ariaLabel || item.label} data-index={index + 1} onClick={closeMenu}>
                  <span className="sm-panel-itemLabel">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
