export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  isAvailable: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

/** Hardcoded demo menu for Phase B (no database yet). */
export const DEMO_MENU: MenuCategory[] = [
  {
    id: "pizza",
    name: "Pizza",
    items: [
      {
        id: "pizza-margherita",
        name: "Margherita",
        description: "Tomato, mozzarella, fresh basil",
        priceCents: 1200,
        isAvailable: true,
      },
      {
        id: "pizza-pepperoni",
        name: "Pepperoni",
        description: "Tomato, mozzarella, pepperoni",
        priceCents: 1400,
        isAvailable: true,
      },
      {
        id: "pizza-quattro-formaggi",
        name: "Quattro Formaggi",
        description: "Mozzarella, gorgonzola, fontina, parmesan",
        priceCents: 1500,
        isAvailable: true,
      },
      {
        id: "pizza-bbq-chicken",
        name: "BBQ Chicken",
        description: "BBQ sauce, chicken, red onion, cilantro",
        priceCents: 1550,
        isAvailable: true,
      },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    items: [
      {
        id: "drink-cola",
        name: "Cola",
        description: "Chilled 12 oz can",
        priceCents: 250,
        isAvailable: true,
      },
      {
        id: "drink-sparkling-water",
        name: "Sparkling Water",
        description: "Sparkling mineral water",
        priceCents: 300,
        isAvailable: true,
      },
      {
        id: "drink-lemonade",
        name: "Lemonade",
        description: "Fresh-squeezed lemonade",
        priceCents: 350,
        isAvailable: true,
      },
      {
        id: "drink-iced-tea",
        name: "Iced Tea",
        description: "House-brewed black tea, unsweetened",
        priceCents: 300,
        isAvailable: true,
      },
    ],
  },
];

export function formatPrice(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(2)}`;
}
