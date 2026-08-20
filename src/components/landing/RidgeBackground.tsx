/**
 * Image-based background. The downloaded pills image is scaled to cover the
 * full screen. Left side gets a blue tint, right side gets a red tint, and the
 * center fades to dark so foreground content stays readable.
 */
export default function RidgeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Image scaled to cover the full screen, big enough to reach both edges */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/pills-bg.jpg)" }}
      />

      {/* Blue tint on left side, fading toward center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(48,84,255,0.55) 0%, rgba(48,84,255,0.3) 18%, rgba(48,84,255,0.08) 35%, transparent 48%)",
        }}
      />

      {/* Red tint on right side, fading toward center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(270deg, rgba(255,45,85,0.55) 0%, rgba(255,45,85,0.3) 18%, rgba(255,45,85,0.08) 35%, transparent 48%)",
        }}
      />

      {/* Center fade: dark radial so the middle blends into the black bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 75% at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.3) 50%, transparent 75%)",
        }}
      />

      {/* Bottom fade to pure black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </div>
  );
}
