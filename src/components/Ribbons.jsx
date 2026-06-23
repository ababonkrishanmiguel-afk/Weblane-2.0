import { useEffect, useRef } from "react";

export default function Ribbons() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarsePointer) return undefined;

    const context = canvas.getContext("2d");
    const points = [];
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let animationFrame = 0;
    let hasPointer = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = "100vw";
      canvas.style.height = "100svh";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (event) => {
      hasPointer = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const render = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (hasPointer) {
        points.unshift({
          x: pointer.x,
          y: pointer.y,
          life: 1
        });
      }

      while (points.length > 42) points.pop();

      points.forEach((point, index) => {
        point.life -= 0.028 + index * 0.001;
      });

      for (let index = points.length - 1; index >= 0; index -= 1) {
        if (points[index].life <= 0) points.splice(index, 1);
      }

      if (points.length > 2) {
        context.lineCap = "round";
        context.lineJoin = "round";

        for (let pass = 0; pass < 2; pass += 1) {
          context.beginPath();
          context.moveTo(points[0].x, points[0].y);

          for (let index = 1; index < points.length - 1; index += 1) {
            const current = points[index];
            const next = points[index + 1];
            context.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
          }

          context.strokeStyle = pass === 0 ? "rgba(59, 130, 246, 0.16)" : "rgba(20, 184, 166, 0.2)";
          context.lineWidth = pass === 0 ? 18 : 4;
          context.globalAlpha = Math.max(0, Math.min(1, points[0].life));
          context.stroke();
        }
      }

      context.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="ribbons-cursor" aria-hidden="true" />;
}
