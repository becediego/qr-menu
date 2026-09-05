import { MenuWithCart } from "@/components/menu-with-cart";
import { DEMO_MENU } from "@/lib/menu";

type PageProps = {
  params: Promise<{ restaurant: string; table: string }>;
};

export default async function CustomerMenuPage({ params }: PageProps) {
  const { restaurant, table } = await params;

  return (
    <MenuWithCart restaurant={restaurant} table={table} menu={DEMO_MENU} />
  );
}
