"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    label: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={active ? "#00897B" : "#9CA3AF"} strokeWidth={2} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: "Search",
    href: "/search",
    icon: (active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={active ? "#00897B" : "#9CA3AF"} strokeWidth={2} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    label: "",
    href: "/scanner",
    isScanner: true,
    icon: (_active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-7">
        {/* Top-left bracket */}
        <polyline points="7,3.5 2.5,3.5 2.5,8.5" />
        {/* Bottom-left bracket */}
        <polyline points="7,20.5 2.5,20.5 2.5,15.5" />
        {/* Top-right bracket */}
        <polyline points="21,3.5 25.5,3.5 25.5,8.5" />
        {/* Bottom-right bracket */}
        <polyline points="21,20.5 25.5,20.5 25.5,15.5" />
        {/* Barcode lines */}
        <line x1="6" y1="9" x2="22" y2="9" strokeWidth={1.2} />
        <line x1="6" y1="12" x2="22" y2="12" strokeWidth={1} />
        <line x1="6" y1="15" x2="22" y2="15" strokeWidth={1.2} />
      </svg>
    ),
  },
  {
    label: "Ingredients",
    href: "/ingredients",
    icon: (active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={active ? "#00897B" : "#9CA3AF"} strokeWidth={2} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
  {
    label: "My profile",
    href: "/profile",
    icon: (active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={active ? "#00897B" : "#9CA3AF"} strokeWidth={2} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/scanner" || pathname.startsWith("/result/")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          if (tab.isScanner) {
            return (
              <Link
                key="scanner"
                href={tab.href}
                className="flex flex-col items-center -mt-7"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center p-1">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-bobby-teal to-bobby-teal-dark flex items-center justify-center">
                    {tab.icon(true)}
                  </div>
                </div>
              </Link>
            );
          }

          if (tab.href === "/" && pathname === "/") {
            return (
              <button
                key={tab.label}
                onClick={() => window.dispatchEvent(new CustomEvent("go-home"))}
                className="flex flex-col items-center gap-0.5 min-w-[56px]"
              >
                {tab.icon(isActive)}
                <span
                  className={`text-[10px] ${
                    isActive
                      ? "text-bobby-teal-dark font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 min-w-[56px]"
            >
              {tab.icon(isActive)}
              <span
                className={`text-[10px] ${
                  isActive
                    ? "text-bobby-teal-dark font-semibold"
                    : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
