import { getSupabase } from "@/lib/supabase";
import type { MenuCategory } from "@/lib/menu";

export type RestaurantMenu = {
  restaurantName: string;
  restaurantSlug: string;
  tableNumber: number;
  menu: MenuCategory[];
};

type CategoryRow = {
  id: string;
  name: string;
  sort_order: number;
  menu_items: {
    id: string;
    name: string;
    description: string;
    price_cents: number;
    is_available: boolean;
  }[] | null;
};

export async function getRestaurantMenu(
  restaurantSlug: string,
  tableParam: string,
): Promise<RestaurantMenu | null> {
  const tableNumber = Number(tableParam);
  if (!Number.isInteger(tableNumber) || tableNumber < 1) {
    return null;
  }

  const supabase = getSupabase();

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("id, name, slug")
    .eq("slug", restaurantSlug)
    .maybeSingle();

  if (restaurantError) {
    throw new Error(`Failed to load restaurant: ${restaurantError.message}`);
  }
  if (!restaurant) {
    return null;
  }

  const { data: table, error: tableError } = await supabase
    .from("tables")
    .select("id, table_number")
    .eq("restaurant_id", restaurant.id)
    .eq("table_number", tableNumber)
    .maybeSingle();

  if (tableError) {
    throw new Error(`Failed to load table: ${tableError.message}`);
  }
  if (!table) {
    return null;
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("menu_categories")
    .select(
      `
      id,
      name,
      sort_order,
      menu_items (
        id,
        name,
        description,
        price_cents,
        is_available
      )
    `,
    )
    .eq("restaurant_id", restaurant.id)
    .order("sort_order", { ascending: true });

  if (categoriesError) {
    throw new Error(`Failed to load menu: ${categoriesError.message}`);
  }

  const menu: MenuCategory[] = ((categories ?? []) as CategoryRow[]).map(
    (category) => ({
      id: category.id,
      name: category.name,
      items: (category.menu_items ?? [])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          priceCents: item.price_cents,
          isAvailable: item.is_available,
        })),
    }),
  );

  return {
    restaurantName: restaurant.name,
    restaurantSlug: restaurant.slug,
    tableNumber: table.table_number,
    menu,
  };
}
