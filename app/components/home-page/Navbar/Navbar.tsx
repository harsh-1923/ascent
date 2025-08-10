"use client";
import "./Navbar.css";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import Sign from "../Sign/Sign";

const navItems = [
  {
    label: "Craft",
    href: "/craft",
  },
  // {
  //   label: "Writings",
  //   href: "/writings",
  // },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="w-screen fixed left-0 top-0 z-30">
      <div className="gradient-blur">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="max-w-[900px] mx-auto flex items-center justify-between p-4 relative">
        <Link href="/" className="z-[999999]">
          <Sign />
        </Link>
        <div className="space-x-6 block z-[999999]">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative font-[family-name:var(--font-geist-mono)] bg-blend-difference text-base font-medium hover:text-[var(--foreground)] transition-colors dura ${
                pathname === item.href
                  ? "text-[var(--foreground)]"
                  : "dark:text-neutral-400 text-neutral-500"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
