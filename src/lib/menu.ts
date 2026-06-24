/**
 * Full à la carte menu for the /menu page.
 *
 * Content migrated from the restaurant's updated menu PDF (CorelDRAW export).
 * Prices in EUR; ligatures and OCR artefacts from the export were cleaned. Items
 * with an inline "FLAG" comment had an ambiguous price/section in the source —
 * verify them in the Studio.
 * Per-dish media (photo, plated, detail, video, 360°) and guest reviews are added
 * in the Studio under "Menu (full)". The page reads Sanity first, falls back here.
 */
export type MenuReview = { author?: string; quote?: string; rating?: number };

export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
  /** Daily on/off switch from Sanity. Missing/true = shown; false = hidden. */
  available?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  rating?: number;
  reviewCount?: number;
  photo?: string;
  plated?: string;
  detail?: string;
  video?: string;
  spin?: string[];
  reviews?: MenuReview[];
};

export type MenuSection = {
  title: string;
  subtitle?: string;
  items: MenuItem[];
};

export const MENU: MenuSection[] = [
  {
    title: "Starters",
    subtitle: "Πρώτα",
    items: [
      { name: "Crispy Calamari", description: "Lightly dusted local calamari with tarama.", price: "16,00" },
      { name: "Spanakopita", description: "Traditional Greek spinach pie with spinach, feta cheese, fresh herbs and flaky phyllo pastry.", price: "8,50" },
      { name: "Chef's Daily Selection", description: "Chios “Mastelo” cheese with almonds, arugula & lemon marmalade.", price: "9,50" },
      { name: "Tarama Mousse", description: "Fish roe spread.", price: "8,00" },
      { name: "Octopus Carpaccio", description: "Lemon & olive oil dressing, tarama mousse & arugula.", price: "14,50" },
      { name: "Shrimp Saganaki", description: "Saganaki with fresh shrimp, tomato sauce, red peppers, aromatic herbs and feta cheese.", price: "17,00" },
      { name: "Delicious Dips", description: "A variety of Mediterranean-inspired dips served with warm bread.", price: "9,50" },
      { name: "Garlic Bread", description: "Homemade focaccia with garlic, various local cheeses and rocket.", price: "8,00" },
      { name: "Beef Carpaccio", description: "Thinly sliced raw beef served with rocket leaves, Parmesan shavings and a lemon dressing.", price: "14,50" },
      { name: "Beetroot Carpaccio with Walnut Dressing", description: "Thinly sliced roasted beetroot with a creamy walnut dressing, fresh herbs, and extra virgin olive oil.", price: "10,50", vegan: true },
      { name: "Cheese Balls", description: "Crispy golden cheese croquettes with a creamy melted center, served with a light dipping sauce.", price: "9,00" },
      { name: "Feta Melokouni", description: "A traditional baked feta cheese delicacy combining honey and sesame seeds.", price: "9,50" },
      { name: "Zucchini Balls — Al Mare", description: "With crab, cod and prawns.", price: "9,50" },
      { name: "Bruschetta with Anchovy", description: "Crunchy bread topped with marinated anchovy and Mediterranean aromas.", price: "9,50" },
    ],
  },
  {
    title: "Salads",
    subtitle: "Σαλάτες",
    items: [
      { name: "Summer Salad", description: "Cherry tomatoes with soft local white cheese, carob rusk, aromatic herbs, and extra virgin olive oil.", price: "13,00" },
      { name: "Mariposa Salad", description: "Goat cheese (manouri), fresh vegetables, cherry tomatoes, apple, walnuts, Parmesan & mustard dressing.", price: "14,50" },
      { name: "Burrata Salad", description: "Creamy burrata cheese served with cherry tomatoes, basil, extra virgin olive oil, and balsamic glaze.", price: "13,50" },
    ],
  },
  {
    title: "Main Courses",
    subtitle: "Κυρίως",
    items: [
      { name: "Pappardelle with Mussels and Calamari", description: "Artisanal pappardelle pasta with fresh mussels and calamari, sautéed with cherry tomatoes, garlic, white wine, and parsley.", price: "" /* FLAG: price not legible in PDF */ },
      { name: "Spinach Tagliatelle with Fresh Salmon", description: "Fresh spinach tagliatelle with sautéed salmon, cherry tomatoes, extra virgin olive oil, and fragrant Mediterranean herbs.", price: "24,00" },
      { name: "Grilled Black Angus Entrecôte", description: "Premium grilled Black Angus (250gr) entrecôte served with Jerusalem artichoke purée and a rich three-peppercorn sauce.", price: "42,00" },
      { name: "Black Linguine with Salmon", description: "Black fresh linguine with salmon, dill & Parmesan.", price: "24,00" },
      { name: "Fresh Ravioli", description: "Fresh ravioli with a variety of mushrooms, truffle oil, in an abundant Parmesan cream.", price: "19,00", vegetarian: true },
      { name: "Beef Stroganoff with Homemade Tagliatelle", description: "Tender beef strips in a rich mushroom and cream sauce served with fresh homemade tagliatelle.", price: "23,00" },
      { name: "Penne with Chicken, Broccoli & Basil Pesto", description: "Penne pasta with grilled chicken, broccoli florets, cherry tomato, basil pesto and Parmesan cheese.", price: "17,50" },
      { name: "Mariposa Moussaka", description: "A creative reinterpretation of the traditional Greek moussaka, combining handmade ravioli filled with roasted vegetables and creamy béchamel sauce for a unique experience.", price: "21,50" },
      { name: "Marinated Lamb", description: "Marinated lamb long braised in a wood-fired oven with grated feta cheese and baby potatoes on the side.", price: "28,00" },
      { name: "Battered Cauliflower", description: "Golden battered cauliflower served on a smooth velouté of green peas and coconut milk, creating a delicate balance of crisp texture and creamy, aromatic flavors.", price: "17,50", vegan: true },
      { name: "Beef Stifado", description: "Beef cooked in tomato sauce with cinnamon stick and whole onions (French fries & bread as a side dish).", price: "23,00" },
    ],
  },
  {
    title: "From the Sea",
    subtitle: "Από τη Θάλασσα",
    items: [
      { name: "Grilled Calamari", description: "Fresh grilled calamari (300gr.) served with lemon polenta, edamame beans, herb green sauce, and extra virgin olive oil.", price: "28,00" },
      { name: "Tuna Steak", description: "Tuna with grilled polenta and avocado cream.", price: "32,00" },
      { name: "Prawn Risotto", description: "Creamy Arborio rice cooked with prawns, white wine, Parmesan cheese and fresh herbs.", price: "24,50" },
      { name: "Sea Bass", description: "Fresh sea bass fillet grilled to perfection, served with seasonal vegetables and lemon-herb dressing.", price: "26,00" },
      { name: "Octopus with Fava", description: "Tender grilled octopus served on creamy Santorini-style fava purée with capers and olive oil.", price: "26,00" },
    ],
  },
  {
    title: "Kids Menu",
    subtitle: "Παιδικό Μενού",
    items: [
      { name: "Pasta", description: "Pasta with tomato or white sauce & Parmesan cheese.", price: "12,00" },
      { name: "Chicken Nuggets", description: "Served with French fries.", price: "14,00" /* FLAG: price digits scrambled in PDF */ },
    ],
  },
  {
    title: "Desserts of the Day",
    subtitle: "Γλυκά",
    items: [
      { name: "Chef's Inspiration", description: "A creative dessert prepared daily by our Chef using fresh seasonal ingredients.", price: "12,00" },
      { name: "Homemade Chocolate Soufflé", description: "Served with ice cream.", price: "12,00" },
      { name: "Pavlova", description: "With cream cheese and strawberries.", price: "12,00" },
      { name: "Homemade Chocolate Cake", description: "Served with ice cream.", price: "12,00" },
      { name: "Homemade Baklava", description: "With pistachio ice cream, caramelized pistachios and pistachio cream.", price: "12,00" },
      { name: "Homemade Orange Cake", description: "Served with ice cream.", price: "12,00" },
      { name: "Homemade Soft Cookies", description: "Served with ice cream.", price: "12,00" },
      { name: "Galaktoboureko", description: "Traditional Greek dessert with puff pastry soaked in syrup and custard cream.", price: "12,00" },
      { name: "Homemade Cheesecake", description: "American style, with fruits.", price: "12,00" },
      { name: "Homemade Pistachio Tiramisu", description: "", price: "12,00" },
    ],
  },
  {
    title: "Homemade Ice Cream",
    items: [
      { name: "White Chocolate & Tonka Bean", price: "9,50" },
      { name: "Pistachio", price: "9,50" },
      { name: "Vanilla Stracciatella", price: "9,50" },
      { name: "Lotus Biscoff", price: "9,50" },
      { name: "Cheesecake", price: "9,50" },
      { name: "Yogurt Ice Cream with Walnuts and Honey", price: "9,50" },
    ],
  },
  {
    title: "Smoothies",
    items: [
      { name: "Berry Burst", description: "Black currant, blueberry, banana, blackberry.", price: "7,50" },
      { name: "Green Reviver", description: "Banana, kale, mango, lemongrass.", price: "7,50" },
      { name: "Mango Dream", description: "Mango, pear.", price: "7,50" },
      { name: "Passion Storm", description: "Peach, pineapple, papaya, passion fruit, guava, aloe vera.", price: "7,50" },
      { name: "Ginger Beets", description: "Beetroot, pineapple, wild blueberry, ginger.", price: "7,50" },
      { name: "Tropical Carrot", description: "Mango, carrot, kiwi, banana, guava.", price: "7,50" },
      { name: "Strawberry Delight", description: "Strawberry, peach, papaya.", price: "7,50" },
    ],
  },
  {
    title: "Milkshakes",
    items: [
      { name: "Espresso", price: "9,00" },
      { name: "Oreo", price: "9,00" },
      { name: "Pistachio", price: "9,00" },
      { name: "Strawberry", price: "9,00" },
      { name: "Lotus Biscoff", price: "9,00" },
    ],
  },
  {
    title: "Special Cocktails",
    items: [
      { name: "Caramel Espresso Martini", description: "Vodka, espresso, kahlua and a salted caramel syrup blended to perfection.", price: "12,00" },
      { name: "Hornet", description: "Bourbon, peach purée, pineapple juice, passion fruit and lime juice create a captivating blend.", price: "14,00" },
      { name: "Mariposa Special", description: "Gin, lychee purée, rose syrup, lime juice and frothy egg white combine in a refreshing symphony of flavors.", price: "14,00" },
      { name: "Mediterranean Mule", description: "Brandy, lime, cucumber and ginger beer for a refreshing twist.", price: "12,00" },
      { name: "Mastiha Fresh", description: "Mastiha, gin, cucumber and lemon juice for a refreshing delight.", price: "12,00" },
    ],
  },
  {
    title: "Classic Cocktails",
    items: [
      { name: "Mojito", description: "White rum, lime juice, sugar syrup and mint.", price: "10,00" },
      { name: "Margarita", description: "Bianco tequila, cointreau and lime juice.", price: "12,00" },
      { name: "Mai Tai", description: "Light rum, dark rum, lime, pineapple juice, orgeat syrup and aromatic bitters.", price: "12,00" },
      { name: "Aperol Spritz", description: "Aperol, prosecco and a dash of soda.", price: "10,00" },
      { name: "Zombie", description: "Light rum, dark rum, lime, pineapple juice and falernum syrup.", price: "12,00" },
      { name: "Negroni", description: "Gin, Campari and sweet vermouth.", price: "14,00" },
      { name: "Pina Colada", description: "Bacardi rum, Malibu coconut cream, pineapple and lime juice.", price: "12,00" },
      { name: "Tonka Blaze", description: "Tequila blanco, mezcal, lime, grapefruit and tonka syrup mixed for perfection.", price: "14,00" },
    ],
  },
];
