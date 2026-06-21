/**
 * Honeypot field — a decoy input that humans never see or fill, but bots tend
 * to. The server treats any non-empty value as spam. Hidden off-screen (not
 * `display:none`, which some bots skip), removed from the tab order and the
 * accessibility tree, and opted out of autofill.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden
      style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
    >
      <label>
        Company
        <input name="company" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
