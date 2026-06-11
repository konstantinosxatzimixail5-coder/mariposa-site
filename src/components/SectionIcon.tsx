import type { SVGProps } from "react";

/**
 * Bespoke section icon set — one cohesive line family drawn to a single spec:
 * 24×24 grid, no fill, 1px hairline strokes in currentColor, round caps and
 * joins, a shared visual weight. Each marks a section the way the cloche marks
 * the menu. Decorative by default (aria-hidden); pass a title for a labelled
 * use. Tint via the parent's text color.
 */

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Svg({ title, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/** Cloche — a domed silver cover resting on a plate, steam rising from the top.
 *  The most-used mark: it heads the menu / signature plates. */
export function IconCloche(props: IconProps) {
  return (
    <Svg {...props}>
      {/* plate, with a slim foot */}
      <path d="M2.6 19.4h18.8" />
      <path d="M4.6 19.4a7.4 7.4 0 0 1 14.8 0" />
      {/* finial resting on the dome's apex */}
      <circle cx="12" cy="11.2" r="0.85" />
      {/* three steam wisps curling up from the cover */}
      <path d="M12 9.6c-1-1 1-2 0-3" />
      <path d="M8.7 9.9c-0.9-0.9 0.9-1.8 0-2.7" />
      <path d="M15.3 9.9c-0.9-0.9 0.9-1.8 0-2.7" />
    </Svg>
  );
}

/** Sprig — a stem with paired leaves. Marks the garden & philosophy. */
export function IconSprig(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21V7.5" />
      <path d="M12 13.5c-3.4 0-5-1.6-5-4.4 2.9 0 5 1.5 5 4.4Z" />
      <path d="M12 10.5c3.1 0 4.7-1.5 4.7-4.2C13.9 6.3 12 7.7 12 10.5Z" />
      <path d="M12 7.5c0-1.8 1.2-3 3.1-3.3C15.1 6 13.9 7.3 12 7.5Z" />
    </Svg>
  );
}

/** Clock — a calm dial. Marks The Experience / hours. */
export function IconClock(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  );
}

/** Fork & knife — the table set. Marks the chef's words. */
export function IconChefMark(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 3.5v17" />
      <path d="M6 3.5v4a2 2 0 0 0 4 0v-4" />
      <path d="M16 20.5V13c2 0 2.8-1.6 2.8-4.5C18.8 5.3 17.8 3.5 16 3.5Z" />
    </Svg>
  );
}

/** Flute — a slender glass with a rising bubble. Marks celebrations. */
export function IconFlute(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 3.5h6l-.8 7.2a2.2 2.2 0 0 1-4.4 0L9 3.5Z" />
      <path d="M12 13v6.5" />
      <path d="M9 20.5h6" />
      <circle cx="12" cy="6.6" r="0.5" />
    </Svg>
  );
}

/** Question — a calm dial with a quiet query stroke. Marks the FAQ. */
export function IconQuestion(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.4 9.4a2.6 2.6 0 0 1 5 1c0 1.7-2.4 1.9-2.4 3.4" />
      <path d="M12 16.6v.05" />
    </Svg>
  );
}

/** Butterfly — wings either side of a slim body, in the same line family as the
 *  brand mark. Marks The Family. */
export function IconButterfly(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 6v12" />
      <path d="M12 8.5C12 5.5 9.5 3.5 6.8 3.5 4.8 3.5 3.5 5 3.5 7c0 3 3.4 4.8 8.5 4.8" />
      <path d="M12 8.5C12 5.5 14.5 3.5 17.2 3.5 19.2 3.5 20.5 5 20.5 7c0 3-3.4 4.8-8.5 4.8" />
      <path d="M12 12.3c-3.6 0-6.4 1.6-6.4 4.3 0 1.7 1.2 2.9 2.9 2.9 2 0 3.5-2 3.5-4.6" />
      <path d="M12 12.3c3.6 0 6.4 1.6 6.4 4.3 0 1.7-1.2 2.9-2.9 2.9-2 0-3.5-2-3.5-4.6" />
      <path d="M12 5.6V4.2" />
    </Svg>
  );
}
