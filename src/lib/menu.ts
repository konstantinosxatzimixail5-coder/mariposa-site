/**
 * Full à la carte menu for the /menu page.
 *
 * Real content, migrated from the restaurant's WordPress/Elementor menu page
 * (prices in EUR, dietary tags preserved). The page reads Sanity first and falls
 * back to this; edit the live menu in the Studio under "Menu (full)".
 */
export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
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
      {
        name: "Burrata & Heirloom Tomato",
        description: "Creamy Pugliese burrata, confit cherry tomatoes, basil oil and a sourdough crisp.",
        price: "14",
        vegetarian: true,
      },
      {
        name: "Charred Octopus",
        description: "Slow-cooked octopus over fava purée, capers, red onion and smoked paprika oil.",
        price: "18",
        glutenFree: true,
      },
      {
        name: "Stuffed Zucchini Flowers",
        description: "Crisp blossoms filled with feta and mint, finished with thyme honey.",
        price: "12",
        vegetarian: true,
      },
      {
        name: "Honey Saganaki",
        description: "Pan-seared graviera, sesame crust, thyme honey and a squeeze of bergamot.",
        price: "13",
        vegetarian: true,
      },
    ],
  },
  {
    title: "Salads",
    subtitle: "Σαλάτες",
    items: [
      {
        name: "Mariposa Garden Salad",
        description: "Heirloom leaves, pomegranate, candied walnuts and a 12-year aged balsamic.",
        price: "11",
        vegan: true,
        glutenFree: true,
      },
      {
        name: "Watermelon & Feta",
        description: "Chilled watermelon, barrel-aged feta, kalamata, mint and toasted pistachio.",
        price: "12",
        vegetarian: true,
        glutenFree: true,
      },
      {
        name: "Roasted Beetroot & Goat Cheese",
        description: "Citrus-roasted beets, whipped goat cheese, orange segments and dill oil.",
        price: "13",
        vegetarian: true,
        glutenFree: true,
      },
    ],
  },
  {
    title: "Main",
    subtitle: "Κυρίως",
    items: [
      {
        name: "Slow-Braised Lamb Shank",
        description: "Eight-hour lamb, smoked aubergine purée, gremolata and roasting jus.",
        price: "28",
        glutenFree: true,
      },
      {
        name: "Aegean Sea Bass",
        description: "Whole-fillet sea bass, fennel, samphire, caper-lemon butter and new potatoes.",
        price: "26",
        glutenFree: true,
      },
      {
        name: "Wild Mushroom Risotto",
        description: "Carnaroli rice, porcini, truffle, aged parmesan and crispy sage.",
        price: "22",
        vegetarian: true,
      },
      {
        name: "Black Angus Ribeye",
        description: "300g dry-aged ribeye, bone-marrow butter, charred greens and triple-cooked chips.",
        price: "34",
        glutenFree: true,
      },
    ],
  },
  {
    title: "Dessert",
    subtitle: "Γλυκά",
    items: [
      {
        name: "Pistachio Baklava Cheesecake",
        description: "Layered filo, pistachio cream cheese, orange-blossom syrup and crushed nuts.",
        price: "10",
        vegetarian: true,
      },
      {
        name: "Dark Chocolate Soufflé",
        description: "70% Valrhona soufflé, salted caramel centre, vanilla-bean ice cream.",
        price: "12",
        vegetarian: true,
      },
      {
        name: "Lemon & Thyme Panna Cotta",
        description: "Silky vanilla panna cotta, lemon curd, thyme and a brown-butter crumble.",
        price: "9",
        vegetarian: true,
        glutenFree: true,
      },
    ],
  },
];
