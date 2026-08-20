"use client";

import { useEffect, useRef } from "react";

type Ridge = {
  baseY: number;
  amp: number;
  freq: number;
  phase: number;
  speed: number;
  fill: string;
  shadow: string;
};

/**
 * Animated ridge background. Left side of the scene glows red, right side glows
 * blue, with shadowy depth between ridges. Ridges drift slowly with sine motion.
 */
export default function RidgeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Ridge layers, back-to-front. Each gets progressively less amplitude.
    const ridges: Ridge[] = [
      {
        baseY: 0.62,
        amp: 30,
        freq: 0.004,
        phase: 0,
        speed: 0.15,
        fill: "rgba(20, 12, 18, 0.55)",
        shadow: "rgba(255, 45, 85, 0.10)",
      },
      {
        baseY: 0.7,
        amp: 38,
        freq: 0.0055,
        phase: 1.2,
        speed: 0.22,
        fill: "rgba(16, 12, 22, 0.65)",
        shadow: "rgba(48, 84, 255, 0.10)",
      },
      {
        baseY: 0.78,
        amp: 44,
        freq: 0.007,
        phase: 2.4,
        speed: 0.3,
        fill: "rgba(10, 8, 16, 0.78)",
        shadow: "rgba(0, 0, 0, 0.5)",
      },
      {
        baseY: 0.86,
        amp: 50,
        freq: 0.009,
        phase: 3.6,
        speed: 0.4,
        fill: "rgba(5, 4, 10, 0.9)",
        shadow: "rgba(0, 0, 0, 0.6)",
      },
    ];

    const drawRidge = (r: Ridge, width: number, height: number) => {
      const baseY = height * r.baseY;
      const points: [number, number][] = [];
      const step = 4;
      for (let x = 0; x <= width; x += step) {
        const y =
          baseY +
          Math.sin(x * r.freq + t * r.speed + r.phase) * r.amp +
          Math.sin(x * r.freq * 2.3 + t * r.speed * 0.7 + r.phase) * (r.amp * 0.35);
        points.push([x, y]);
      }

      // Fill path
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, points[0][1]);
      for (const [px, py] of points) ctx.lineTo(px, py);
      ctx.lineTo(width, height);
      ctx.closePath();

      // Gradient fill: red on left, blue on right, mixed with shadowy base
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, r.fill);
      grad.addColorStop(0.35, r.fill);
      grad.addColorStop(1, r.fill);
      ctx.fillStyle = grad;
      ctx.fill();

      // Shadow glow on top edge: red left, blue right
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, points[0][1]);
      for (const [px, py] of points) ctx.lineTo(px, py);
      ctx.lineWidth = 1.5;
      const edgeGrad = ctx.createLinearGradient(0, 0, width, 0);
      // Red on left side
      edgeGrad.addColorStop(0, r.shadow);
      edgeGrad.addColorStop(0.45, r.shadow);
      edgeGrad.addColorStop(0.5, "rgba(0,0,0,0)");
      // Blue on right side
      edgeGrad.addColorStop(0.55, "rgba(0,0,0,0)");
      edgeGrad.addColorStop(1, "rgba(48, 84, 255, 0.15)");
      ctx.strokeStyle = edgeGrad;
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 2;
      ctx.stroke();
      ctx.restore();

      // Ambient glow blobs on the top edge for red/blue cast
      if (r === ridges[0] || r === ridges[1]) {
        // Red glow on left
        const redY = points[Math.floor(points.length * 0.2)]?.[1] ?? baseY;
        const rg = ctx.createRadialGradient(width * 0.18, redY, 0, width * 0.18, redY, 200);
        rg.addColorStop(0, "rgba(255, 45, 85, 0.12)");
        rg.addColorStop(1, "rgba(255, 45, 85, 0)");
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, width, height);

        // Blue glow on right
        const blueY = points[Math.floor(points.length * 0.8)]?.[1] ?? baseY;
        const bg = ctx.createRadialGradient(width * 0.82, blueY, 0, width * 0.82, blueY, 200);
        bg.addColorStop(0, "rgba(48, 84, 255, 0.12)");
        bg.addColorStop(1, "rgba(48, 84, 40, 0)");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Base background gradient
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#020203");
      bg.addColorStop(0.5, "#050508");
      bg.addColorStop(1, "#030308");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Top-left red ambient
      const tl = ctx.createRadialGradient(w * 0.12, h * 0.1, 0, w * 0.12, h * 0.1, w * 0.5);
      tl.addColorStop(0, "rgba(255, 45, 85, 0.06)");
      tl.addColorStop(1, "rgba(255, 45, 85, 0)");
      ctx.fillStyle = tl;
      ctx.fillRect(0, 0, w, h);

      // Top-right blue ambient
      const tr = ctx.createRadialGradient(w * 0.88, h * 0.1, 0, w * 0.88, h * 0.1, w * 0.5);
      tr.addColorStop(0, "rgba(48, 84, 255, 0.06)");
      tr.addColorStop(1, "rgba(48, 84, 255, 0)");
      ctx.fillStyle = tr;
      ctx.fillRect(0, 0, w, h);

      // Draw ridges back-to-front
      for (const r of ridges) drawRidge(r, w, h);

      t += 0.016;
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
