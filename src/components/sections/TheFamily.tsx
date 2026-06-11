import { Reveal } from "@/components/Reveal";
import { IconButterfly } from "@/components/SectionIcon";
import { BRAND, type FamilyMember } from "@/lib/brand";

/**
 * The Family. The brand's true center: whoever walks in is received as a guest
 * of the family. Five small, uniform portraits in a single row — restacking on
 * mobile — each with name and role beneath. A short paragraph names why a family
 * keeps a standard the way only a family can, and the section closes on the
 * house principle as a large pull-quote. Portraits render as designed monogram
 * placeholders until the client supplies photography (BRAND.family[].image is
 * wired for the swap).
 *
 * This is the last section and the brand's heart.
 */
export function TheFamily() {
  return (
    <section
      id="family"
      className="relative overflow-hidden border-t"
      style={{ borderColor: "var(--color-line)", paddingBlock: "var(--space-section)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <header className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="eyebrow flex items-center justify-center gap-2.5 text-amber-deep">
            <IconButterfly className="h-[1.15rem] w-[1.15rem]" />
            The Family
          </Reveal>
          <Reveal
            as="h2"
            variant="clip-reveal"
            className="font-display mt-5 text-balance"
            style={{ fontSize: "var(--text-4xl)", lineHeight: 1.04 }}
          >
            One house, five hands
          </Reveal>
          <Reveal as="p" delay={140} className="mx-auto mt-7 max-w-xl text-pretty text-lg text-ink-dim">
            Despoina built it. Konstantin opens the door. Mara carries the warmth.
            Nickolas mixes the night. Salvatore writes the next chapter. You are
            received the way we receive our own.
          </Reveal>
        </header>

        <ol className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:mt-20 md:grid-cols-5 md:gap-8">
          {BRAND.family.map((member, i) => (
            <FamilyPortrait key={member.name} member={member} index={i} />
          ))}
        </ol>

        <Reveal
          as="p"
          delay={120}
          className="mx-auto mt-20 max-w-2xl text-pretty text-center text-lg text-ink-dim md:mt-24"
        >
          Mariposa runs on one family&apos;s hands. The recipes and the rooms are
          Despoina&apos;s. The welcome is Konstantin&apos;s. The warmth passes from
          Mara to your table, from Nickolas to your glass, and now from Salvatore
          to the next plate of fresh pasta and bread. A family holds a standard the
          way only a family can — personally. You arrive as a guest and you are
          looked after as one of our own.
        </Reveal>

        <Reveal
          as="blockquote"
          variant="clip-reveal"
          className="font-display mx-auto mt-20 max-w-4xl text-balance text-center hanging-quote md:mt-24"
          style={{ fontSize: "var(--text-3xl)", lineHeight: 1.12 }}
        >
          <span className="italic">
            Every table here is set the way we set <span className="text-gold">our own.</span>
          </span>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * One member. A small, uniform square portrait placeholder with name and role
 * set beneath it. Uniform across the row so the family reads as one.
 */
function FamilyPortrait({ member, index }: { member: FamilyMember; index: number }) {
  return (
    <li className="flex flex-col items-center text-center">
      <Reveal variant="reveal" delay={index * 70} className="w-full">
        <PortraitPlaceholder name={member.name} index={index} />
        <h3 className="font-display mt-5" style={{ fontSize: "var(--text-lg)" }}>
          {member.name}
        </h3>
        <p className="eyebrow mt-1.5 text-amber-deep">{member.role}</p>
      </Reveal>
    </li>
  );
}

/**
 * Designed placeholder: a tonal gradient panel carrying the member's initial in
 * faint display serif, hairline-framed. Reads as intentional art direction, not
 * a missing image. Swap for a next/image fill when photography lands.
 */
function PortraitPlaceholder({ name, index }: { name: string; index: number }) {
  // Gently rotate the tint across the family so the row doesn't feel uniform.
  const tints = ["amber", "olive-light", "aegean-light", "amber-bright", "olive"] as const;
  const tint = tints[index % tints.length];

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-sm border"
      style={{
        borderColor: "var(--color-line)",
        background: `radial-gradient(120% 90% at 30% 0%, color-mix(in oklab, var(--color-${tint}) 26%, var(--color-surface)) 0%, var(--color-bg-alt) 78%)`,
      }}
    >
      <span
        aria-hidden
        className="font-display absolute inset-0 flex items-center justify-center select-none"
        style={{
          fontSize: "clamp(3.5rem, 9vw, 5.5rem)",
          lineHeight: 1,
          color: `color-mix(in oklab, var(--color-${tint}) 42%, transparent)`,
        }}
      >
        {name.charAt(0)}
      </span>
    </div>
  );
}
