export default function Home() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Phase A
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        qr-menu
      </h1>
      <p className="text-lg leading-relaxed text-zinc-600">
        Next.js is running. Customers will scan a table QR code, open a mobile
        menu, and place orders. Staff will see those orders on a live board.
      </p>
      <ul className="space-y-2 text-sm text-zinc-600">
        <li>
          Customer menu →{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-800">
            /r/demo/t/7
          </code>
        </li>
        <li>
          Staff board →{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-800">
            /staff/orders
          </code>
        </li>
        <li>
          Admin menu →{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-800">
            /admin/menu
          </code>
        </li>
      </ul>
      <p className="text-sm text-zinc-500">
        Next up (Phase B): hardcode a demo menu and cart on the customer page.
        See <span className="font-medium text-zinc-700">PLAN.md</span>.
      </p>
    </main>
  );
}
