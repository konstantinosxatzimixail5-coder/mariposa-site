/**
 * Frequently-asked questions, written answer-first: the opening sentence states
 * the fact plainly (so search engines and AI assistants can lift it whole), then
 * one or two lines in the house voice refine it. Shared by the FAQ section UI
 * and the FAQPage JSON-LD so the two never drift. Facts are drawn from BRAND;
 * nothing here is invented.
 */
export const FAQS = [
  {
    q: "Where is Mariposa?",
    a: "Mariposa is in the village of Theologos on the west coast of Rhodes, Greece, about a twenty-five minute drive south of Rhodes Town. We sit just off the Ialysos to Kameiros road, up in the green hills above the village at Epar.Od. Ialisou-Katavias, Theologos 85106.",
  },
  {
    q: "What kind of food do you serve?",
    a: "Mariposa serves Mediterranean food, Greek at its heart with Italian alongside. Much of what reaches the table is grown in our own garden, and the menu follows the season and the morning's catch, with favourites like grilled octopus, beef stifado and a refined moussaka always close at hand.",
  },
  {
    q: "Do you have vegetarian and vegan dishes?",
    a: "Yes, there are always vegetarian dishes on the menu, many of them built around vegetables picked from our garden that morning, such as the zucchini balls. Vegan guests are looked after too, so let us know when you book and the kitchen will prepare for you.",
  },
  {
    q: "How do I book a table?",
    a: "You can book by phone or WhatsApp on +30 690 648 9686, or by email at mariposa.rhodos@gmail.com. We keep only a small number of tables each service, so reserving ahead is the surest way to a seat, especially for dinner.",
  },
  {
    q: "What are your opening hours?",
    a: "Mariposa is open every day, from nine in the morning until midnight. The morning opens quietly in the garden, and the day runs long under the vines through to the last of the evening light.",
  },
  {
    q: "Why does the menu change?",
    a: "The menu changes because we cook from our own garden and the day's market, so the plates follow what is ripe and freshly caught. A handful of favourites stay year round, the grilled octopus and zucchini balls among them, while the rest moves with the season.",
  },
  {
    q: "Can you host special occasions and weddings?",
    a: "Yes, Mariposa hosts birthdays, anniversaries, proposals and wedding dinners, with an intimate table for up to sixty in the garden. We also arrange private and corporate evenings, so tell us the occasion when you book and we will plan it with you.",
  },
  {
    q: "Is Mariposa family-run?",
    a: "Yes, Mariposa is run by one family. Despoina founded the kitchen and created the menu, Konstantin hosts the room, Mara looks after guests, Nickolas tends the cocktail bar, and Salvatore makes the fresh pasta and bread.",
  },
  {
    q: "Does Mariposa have a view?",
    a: "Mariposa is a garden restaurant set in the hills above the Aegean coast, shaded by its own vines. The terrace opens onto the countryside and the evening light, which makes it a favourite place for a sunset dinner.",
  },
  {
    q: "What is the price range?",
    a: "Mariposa sits in the moderate range, around the mid-level for a sit-down restaurant on Rhodes. It works for an easy lunch or a long celebration dinner, and the full, daily-changing menu is on our menu page.",
  },
] as const;

export type Faq = (typeof FAQS)[number];
