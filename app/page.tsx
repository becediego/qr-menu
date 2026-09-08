import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Phase D
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        qr-menu
      </h1>
      <p className="text-lg leading-relaxed text-zinc-600">
        Place order now saves to Supabase (`orders` + `order_items`). Next: the
        staff board to see live tickets.
      </p>
      <Link
        href="/r/demo/t/7"
        className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-5 text-base font-medium text-white"
      >
        Open table 7 menu
      </Link>
      <p className="text-sm text-zinc-500">
        After placing an order, check the{" "}
        <span className="font-medium text-zinc-700">orders</span> table in
        Supabase. Staff UI is next in PLAN.md.
      </p>
    </main>
  );
}
