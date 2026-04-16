import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/home-hero", label: "Home page" },
  { href: "/admin/cursor-design", label: "Cursor (Figma)" },
];

export function AdminSidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/40">
      <div className="border-b border-zinc-800 px-4 py-4">
        <Link href="/admin" className="block outline-none ring-offset-2 ring-offset-zinc-900 focus-visible:ring-2 focus-visible:ring-accent">
          <Image
            src="/aurora-logo.png"
            alt="Aurora Vehicles — Auto dash cam and accessories"
            width={220}
            height={94}
            className="h-9 w-auto object-contain object-left"
          />
          <span className="sr-only">Admin</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-zinc-800 p-3">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          View site
        </Link>
        <form action="/api/auth/logout" method="post" className="mt-1">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
