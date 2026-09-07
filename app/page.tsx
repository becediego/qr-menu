import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Phase C
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        qr-menu
      </h1>
      <p className="text-lg leading-relaxed text-zinc-600">
        Menu items load from Supabase. Cart and place-order are still local —
        orders are not saved to the database yet.
      </p>
      <Link
        href="/r/demo/t/7"
        className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-5 text-base font-medium text-white"
      >
        Open table 7 menu
      </Link>
      <p className="text-sm text-zinc-500">
        Next up (Phase D): save real orders and build the staff board. See{" "}
        <span className="font-medium text-zinc-700">PLAN.md</span>.
      </p>
    </main>
  );
}
