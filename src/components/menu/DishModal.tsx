"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { MenuItem } from "@/lib/menu";
import { StarRating } from "./StarRating";
import { Spin360 } from "./Spin360";

// Light landing palette to match the page.
const PANEL = "var(--color-bg)";
const LINE = "var(--color-line)";
const MUTED = "var(--color-ink-dim)";

type TabKey = "spin" | "plated" | "detail" | "video";
const TABS: { key: TabKey; label: string }[] = [
  { key: "spin", label: "360°" },
  { key: "plated", label: "Plated" },
  { key: "detail", label: "Detail" },
  { key: "video", label: "Video" },
];

export function DishModal({
  dish,
  onClose,
  onReserve,
}: {
  dish: MenuItem;
  onClose: () => void;
  onReserve: () => void;
}) {
  const has: Record<TabKey, boolean> = {
    spin: !!dish.spin && dish.spin.length > 1,
    plated: !!dish.plated,
    detail: !!(dish.detail || dish.photo),
    video: !!dish.video,
  };
  const [tab, setTab] = useState<TabKey>((TABS.find((t) => has[t.key])?.key as TabKey) ?? "spin");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const tags = [
    dish.vegan ? "Vegan" : dish.vegetarian ? "Vegetarian" : null,
    dish.glutenFree ? "Gluten-Free" : null,
  ].filter(Boolean) as string[];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      style={{ background: "color-mix(in oklab, var(--color-ink) 70%, transparent)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={dish.name}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border"
        style={{ background: PANEL, borderColor: LINE, color: "var(--color-ink)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border"
          style={{ background: "color-mix(in oklab, var(--color-bg) 80%, transparent)", borderColor: LINE, color: "var(--color-ink)" }}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Media */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <MediaArea dish={dish} tab={tab} has={has} />
        </div>

        {/* Media tabs */}
        <div className="flex gap-2 px-5 pt-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className="flex-1 rounded-lg border px-2 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors"
              style={{
                borderColor: tab === t.key ? "var(--color-amber)" : LINE,
                background: tab === t.key ? "color-mix(in oklab, var(--color-amber) 16%, transparent)" : "transparent",
                color: has[t.key] ? "var(--color-ink)" : MUTED,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-5 pb-5 pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display" style={{ fontSize: "var(--text-2xl)" }}>{dish.name}</h2>
            {dish.price ? (
              <span className="font-display tabular-nums" style={{ fontSize: "var(--text-xl)", color: "var(--color-amber-deep)" }}>€{dish.price}</span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {dish.rating ? <StarRating rating={dish.rating} count={dish.reviewCount} /> : null}
            {tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>

          {dish.description ? <p className="mt-4 text-pretty" style={{ color: MUTED }}>{dish.description}</p> : null}

          {dish.reviews && dish.reviews.length > 0 ? (
            <div className="mt-7 border-t pt-6" style={{ borderColor: LINE }}>
              <h3 className="font-display italic" style={{ fontSize: "var(--text-lg)" }}>What guests say</h3>
              <ul className="mt-4 flex flex-col gap-4">
                {dish.reviews.map((r, i) => (
                  <li key={i} className="rounded-xl border p-4" style={{ borderColor: LINE, background: "var(--color-surface)" }}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2.5">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium" style={{ background: "var(--color-amber)", color: "var(--color-on-accent)" }}>
                          {(r.author ?? "G").charAt(0)}
                        </span>
                        <span className="text-sm">{r.author ?? "Guest"}</span>
                      </span>
                      {r.rating ? <StarRating rating={r.rating} size={12} /> : null}
                    </div>
                    {r.quote ? <p className="mt-2 text-sm" style={{ color: MUTED }}>&ldquo;{r.quote}&rdquo;</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button type="button" onClick={onClose} className="rounded-full border px-5 py-3 text-sm font-medium" style={{ borderColor: LINE, color: "var(--color-ink)" }}>
              Back to menu
            </button>
            <button type="button" onClick={onReserve} className="rounded-full px-5 py-3 text-sm font-medium transition-[background-color] hover:bg-amber-bright" style={{ background: "var(--color-amber)", color: "var(--color-on-accent)" }}>
              Reserve a table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaArea({ dish, tab, has }: { dish: MenuItem; tab: TabKey; has: Record<TabKey, boolean> }) {
  if (tab === "spin" && has.spin) return <Spin360 frames={dish.spin!} alt={dish.name} />;
  if (tab === "plated" && dish.plated)
    return <Image src={dish.plated} alt={`${dish.name}, plated`} fill sizes="36rem" className="object-cover" />;
  if (tab === "detail" && (dish.detail || dish.photo))
    return <Image src={(dish.detail || dish.photo)!} alt={dish.name} fill sizes="36rem" className="object-cover" />;
  if (tab === "video" && dish.video)
    return <video src={dish.video} controls playsInline className="h-full w-full object-cover" />;
  return <Placeholder label={TABS.find((t) => t.key === tab)!.label} />;
}

function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, color-mix(in oklab, var(--color-olive) 16%, var(--color-bg-alt)) 0 14px, color-mix(in oklab, var(--color-olive) 8%, var(--color-bg-alt)) 14px 28px)",
        color: "var(--color-ink-dim)",
      }}
    >
      <span className="text-sm uppercase tracking-[0.18em]">{label}</span>
      <span className="text-xs" style={{ color: "var(--color-muted)" }}>Add in the Studio</span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em]"
      style={{ background: "color-mix(in oklab, var(--color-olive) 16%, var(--color-surface))", color: "var(--color-amber-deep)" }}
    >
      {children}
    </span>
  );
}
