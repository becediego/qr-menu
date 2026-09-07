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

export function formatPrice(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(2)}`;
}
