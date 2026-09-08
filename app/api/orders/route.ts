import { getSupabase } from "@/lib/supabase";

type OrderItemInput = {
  id?: unknown;
  quantity?: unknown;
  note?: unknown;
};

type CreateOrderBody = {
  restaurant?: unknown;
  table?: unknown;
  items?: unknown;
  note?: unknown;
};

type MenuItemRow = {
  id: string;
  name: string;
  price_cents: number;
  is_available: boolean;
  menu_categories: { restaurant_id: string } | { restaurant_id: string }[] | null;
};

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function restaurantIdFromJoin(
  join: MenuItemRow["menu_categories"],
): string | null {
  if (!join) return null;
  if (Array.isArray(join)) {
    return join[0]?.restaurant_id ?? null;
  }
  return join.restaurant_id ?? null;
}

export async function POST(request: Request) {
  let body: CreateOrderBody;
  try {
    body = (await request.json()) as CreateOrderBody;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const restaurantSlug =
    typeof body.restaurant === "string" ? body.restaurant.trim() : "";
  if (!restaurantSlug) {
    return jsonError("Missing restaurant slug.", 400);
  }

  const tableNumber = Number(body.table);
  if (!Number.isInteger(tableNumber) || tableNumber < 1) {
    return jsonError("Invalid table number.", 400);
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return jsonError("Cart must include at least one item.", 400);
  }

  const customerNote =
    typeof body.note === "string" && body.note.trim().length > 0
      ? body.note.trim()
      : null;

  const quantityByItemId = new Map<string, { quantity: number; note: string | null }>();

  for (const raw of body.items as OrderItemInput[]) {
    if (typeof raw?.id !== "string" || raw.id.length === 0) {
      return jsonError("Each item needs a valid id.", 400);
    }

    const quantity = Number(raw.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return jsonError("Each item quantity must be a whole number ≥ 1.", 400);
    }

    const note =
      typeof raw.note === "string" && raw.note.trim().length > 0
        ? raw.note.trim()
        : null;

    const existing = quantityByItemId.get(raw.id);
    if (existing) {
      quantityByItemId.set(raw.id, {
        quantity: existing.quantity + quantity,
        note: existing.note ?? note,
      });
    } else {
      quantityByItemId.set(raw.id, { quantity, note });
    }
  }

  const itemIds = [...quantityByItemId.keys()];

  try {
    const supabase = getSupabase();

    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id, slug")
      .eq("slug", restaurantSlug)
      .maybeSingle();

    if (restaurantError) {
      return jsonError(`Failed to load restaurant: ${restaurantError.message}`, 500);
    }
    if (!restaurant) {
      return jsonError("Restaurant not found.", 404);
    }

    const { data: table, error: tableError } = await supabase
      .from("tables")
      .select("id, table_number")
      .eq("restaurant_id", restaurant.id)
      .eq("table_number", tableNumber)
      .maybeSingle();

    if (tableError) {
      return jsonError(`Failed to load table: ${tableError.message}`, 500);
    }
    if (!table) {
      return jsonError("Table not found.", 404);
    }

    const { data: menuRows, error: menuError } = await supabase
      .from("menu_items")
      .select(
        `
        id,
        name,
        price_cents,
        is_available,
        menu_categories!inner (
          restaurant_id
        )
      `,
      )
      .in("id", itemIds);

    if (menuError) {
      return jsonError(`Failed to load menu items: ${menuError.message}`, 500);
    }

    const rows = (menuRows ?? []) as MenuItemRow[];
    const menuById = new Map(rows.map((row) => [row.id, row]));

    for (const itemId of itemIds) {
      const row = menuById.get(itemId);
      if (!row || restaurantIdFromJoin(row.menu_categories) !== restaurant.id) {
        return jsonError("One or more items are not on this restaurant’s menu.", 400);
      }
      if (!row.is_available) {
        return jsonError(`“${row.name}” is unavailable.`, 400);
      }
    }

    const orderId = crypto.randomUUID();

    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      restaurant_id: restaurant.id,
      table_id: table.id,
      status: "new",
      customer_note: customerNote,
    });

    if (orderError) {
      return jsonError(`Failed to create order: ${orderError.message}`, 500);
    }

    const orderItems = itemIds.map((itemId) => {
      const row = menuById.get(itemId)!;
      const line = quantityByItemId.get(itemId)!;
      return {
        order_id: orderId,
        menu_item_id: itemId,
        quantity: line.quantity,
        unit_price_cents: row.price_cents,
        note: line.note,
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return jsonError(`Failed to save order items: ${itemsError.message}`, 500);
    }

    const totalCents = orderItems.reduce(
      (sum, line) => sum + line.unit_price_cents * line.quantity,
      0,
    );

    return Response.json(
      {
        id: orderId,
        restaurant: restaurant.slug,
        table: table.table_number,
        status: "new",
        totalCents,
        items: orderItems.map((line) => ({
          id: line.menu_item_id,
          name: menuById.get(line.menu_item_id)!.name,
          quantity: line.quantity,
          unitPriceCents: line.unit_price_cents,
          note: line.note,
        })),
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create order.";
    return jsonError(message, 500);
  }
}
