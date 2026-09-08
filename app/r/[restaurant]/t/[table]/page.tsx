import { MenuWithCart } from "@/components/menu-with-cart";
import { getRestaurantMenu } from "@/lib/get-restaurant-menu";

type PageProps = {
  params: Promise<{ restaurant: string; table: string }>;
};

export default async function CustomerMenuPage({ params }: PageProps) {
  const { restaurant, table } = await params;

  try {
    const data = await getRestaurantMenu(restaurant, table);

    if (!data) {
      return (
        <main className="mx-auto flex min-h-full w-full max-w-lg flex-col gap-4 px-4 py-16 text-zinc-900">
          <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
          <p className="text-base text-zinc-600">
            No menu for restaurant{" "}
            <span className="font-medium text-zinc-900">{restaurant}</span> /
            table <span className="font-medium text-zinc-900">{table}</span>.
          </p>
        </main>
      );
    }

    return (
      <MenuWithCart
        restaurant={data.restaurantSlug}
        restaurantName={data.restaurantName}
        table={String(data.tableNumber)}
        menu={data.menu}
      />
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load menu.";

    return (
      <main className="mx-auto flex min-h-full w-full max-w-lg flex-col gap-4 px-4 py-16 text-zinc-900">
        <h1 className="text-2xl font-semibold tracking-tight">
          Couldn’t load menu
        </h1>
        <p className="text-base text-zinc-600">{message}</p>
      </main>
    );
  }
}
