"use client";

import { useState } from "react";
import { formatPrice, type MenuCategory } from "@/lib/menu";

type CartLine = {
  itemId: string;
  name: string;
  priceCents: number;
  quantity: number;
};

type PlacedOrder = {
  restaurant: string;
  table: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }[];
  totalCents: number;
  totalFormatted: string;
};

type MenuWithCartProps = {
  restaurant: string;
  table: string;
  menu: MenuCategory[];
};

export function MenuWithCart({ restaurant, table, menu }: MenuWithCartProps) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  function addToCart(item: {
    id: string;
    name: string;
    priceCents: number;
    isAvailable: boolean;
  }) {
    if (!item.isAvailable) return;

    setCart((current) => {
      const existing = current.find((line) => line.itemId === item.id);
      if (existing) {
        return current.map((line) =>
          line.itemId === item.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [
        ...current,
        {
          itemId: item.id,
          name: item.name,
          priceCents: item.priceCents,
          quantity: 1,
        },
      ];
    });
  }

  function updateQuantity(itemId: string, delta: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.itemId === itemId
            ? { ...line, quantity: line.quantity + delta }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const totalCents = cart.reduce(
    (sum, line) => sum + line.priceCents * line.quantity,
    0,
  );

  function placeOrder() {
    if (cart.length === 0) return;

    const order: PlacedOrder = {
      restaurant,
      table,
      items: cart.map((line) => ({
        id: line.itemId,
        name: line.name,
        quantity: line.quantity,
        unitPriceCents: line.priceCents,
        lineTotalCents: line.priceCents * line.quantity,
      })),
      totalCents,
      totalFormatted: formatPrice(totalCents),
    };

    setPlacedOrder(order);
    setCart([]);
  }

  function startNewOrder() {
    setPlacedOrder(null);
  }

  if (placedOrder) {
    const orderJson = JSON.stringify(placedOrder, null, 2);

    return (
      <main className="mx-auto min-h-full w-full max-w-lg bg-zinc-50 px-4 py-8 text-zinc-900">
        <header className="mb-6 border-b border-zinc-200 pb-6">
          <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
            {placedOrder.restaurant} · Table {placedOrder.table}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Order placed
          </h1>
          <p className="mt-2 text-base text-zinc-600">
            Fake submit for Phase B — nothing was sent to a server. Cart JSON:
          </p>
        </header>

        <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm leading-relaxed text-zinc-100">
          {orderJson}
        </pre>

        <button
          type="button"
          onClick={startNewOrder}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-zinc-900 text-base font-medium text-white"
        >
          Back to menu
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-full w-full max-w-lg bg-zinc-50 px-4 pb-44 pt-8 text-zinc-900">
      <header className="mb-8 border-b border-zinc-200 pb-6">
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
          {restaurant}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Menu</h1>
        <p className="mt-2 text-base text-zinc-600">Table {table}</p>
      </header>

      <div className="flex flex-col gap-10">
        {menu.map((category) => (
          <section key={category.id} aria-labelledby={`category-${category.id}`}>
            <h2
              id={`category-${category.id}`}
              className="mb-4 text-lg font-semibold tracking-tight"
            >
              {category.name}
            </h2>
            <ul className="flex flex-col gap-4">
              {category.items.map((item) => {
                const inCart = cart.find((line) => line.itemId === item.id);

                return (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-medium">{item.name}</p>
                      <p className="mt-1 text-sm leading-snug text-zinc-600">
                        {item.description}
                      </p>
                      <p className="mt-2 text-base font-medium tabular-nums">
                        {formatPrice(item.priceCents)}
                      </p>
                    </div>
                    {inCart ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-300 bg-white text-xl leading-none"
                          aria-label={`Remove one ${item.name}`}
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-base font-medium tabular-nums">
                          {inCart.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-300 bg-white text-xl leading-none"
                          aria-label={`Add one ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                        className="h-11 shrink-0 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
                      >
                        Add
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <aside
        className="fixed inset-x-0 bottom-0 z-10 border-t border-zinc-200 bg-white"
        aria-live="polite"
      >
        <div className="mx-auto w-full max-w-lg px-4 py-4">
          {cart.length === 0 ? (
            <p className="text-center text-sm text-zinc-500">
              Your cart is empty — tap Add on an item
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <ul className="max-h-28 space-y-1 overflow-y-auto text-sm">
                {cart.map((line) => (
                  <li
                    key={line.itemId}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="min-w-0 truncate">
                      {line.quantity}× {line.name}
                    </span>
                    <span className="shrink-0 tabular-nums text-zinc-600">
                      {formatPrice(line.priceCents * line.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-base font-semibold">
                <span>
                  Cart · {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
                <span className="tabular-nums">{formatPrice(totalCents)}</span>
              </div>
              <button
                type="button"
                onClick={placeOrder}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-zinc-900 text-base font-medium text-white"
              >
                Place order
              </button>
            </div>
          )}
        </div>
      </aside>
    </main>
  );
}
