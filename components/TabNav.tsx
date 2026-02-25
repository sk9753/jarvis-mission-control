"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Overview" },
  { href: "/projects", label: "Projects" },
  { href: "/command", label: "Command" },
];

export default function TabNav() {
  const pathname = usePathname();
  return (
    <nav className="px-4 pt-2 pb-0">
      <div className="flex gap-1 border-b border-[#222]">
        {tabs.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                active
                  ? "text-[#e8e8e8]"
                  : "text-[#666] hover:text-[#999]"
              }`}
            >
              {t.label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-t" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
