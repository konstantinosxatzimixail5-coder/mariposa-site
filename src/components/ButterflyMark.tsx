/**
 * Mariposa trademark, the real four-leaf butterfly mark.
 *
 * Rather than redraw the logo, we paint the genuine asset
 * (public/images/logo/trademark.webp) as a CSS mask and fill it with
 * `currentColor`. That keeps the exact brand silhouette pixel-faithful while
 * letting any call site tint it (ivory for structure, amber for accent) and
 * scale it crisply from the nav pill to the footer lockup.
 */
const MARK_URL = "/images/logo/trademark.webp";

export function ButterflyMark({
  className,
  title = "Mariposa butterfly mark",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <span
      role="img"
      aria-label={title}
      className={className}
      style={{
        display: "inline-block",
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${MARK_URL})`,
        maskImage: `url(${MARK_URL})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
