import { Fraunces, Inter } from "next/font/google";

/**
 * Display — Fraunces: variable high-contrast serif with optical sizing.
 * We pull a wide weight range + the soft/wonky axes off for an editorial,
 * restrained feel. Used for all hero + section headlines.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  // Variable font: omit `weight` so the full wght axis ships; control weight in
  // CSS. opsz drives optical sizing for big hero type. SOFT/WONK stay at their
  // defaults (off) in CSS, so we don't request those axes here — trims the font
  // payload with no visual change.
  axes: ["opsz"],
  style: ["normal", "italic"],
});

/**
 * Body / UI — Inter: clean grotesque, generous line-height set in CSS.
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
