"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { ShoppingBagIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Header() {
  const { totalQuantity, checkoutUrl } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <Container className="py-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu Button - Left */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Bars3Icon className="h-6 w-6 text-foreground" />
          </button>

          {/* Logo - Center on mobile, Left on desktop */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-2xl font-medium tracking-widest md:static md:translate-x-0 md:flex-1"
          >
            TACOARTE
          </Link>

          {/* Navigation - Desktop only */}
          <nav className="hidden flex-1 justify-center md:flex">
            <Link
              className="text-foreground font-medium px-4 py-2"
              href="/collections"
            >
              Gallery
            </Link>
            <Link
              className="text-foreground font-medium px-4 py-2"
              href="/exhibitions"
            >
              Exhibitions
            </Link>
            <Link
              className="text-foreground font-medium px-4 py-2"
              href="/contact"
            >
              Contact
            </Link>
            <Link
              className="text-foreground font-medium px-4 py-2"
              href="/about"
            >
              About
            </Link>
          </nav>

          {/* Cart */}
          <div className="relative flex flex-1 justify-end">
            <div className="group relative">
              <Link href="/cart">
                <ShoppingBagIcon
                  className={`text-foreground h-6 w-6 cursor-pointer transition ${
                    totalQuantity > 0 ? "text-black" : "text-neutral-400"
                  }`}
                />
              </Link>
              {totalQuantity > 0 && checkoutUrl && (
                <div className="pointer-events-none absolute right-0 top-10 w-48 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                  <div className="rounded-lg border bg-white p-4 shadow-lg">
                    <p className="mb-3 text-sm">
                      {totalQuantity} item
                      {totalQuantity > 1 ? "s" : ""} en el carrito
                    </p>

                    <button
                      onClick={() => (window.location.href = checkoutUrl)}
                      className="w-full rounded bg-black px-4 py-2 text-sm text-white"
                    >
                      Finalizar compra
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b px-6 py-6 shadow-xl 
          flex flex-col space-y-4"
          >
            <Link
              className="text-foreground font-medium"
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              className="text-foreground font-medium"
              href="/exhibitions"
              onClick={() => setMobileMenuOpen(false)}
            >
              Exhibitions
            </Link>
            <Link
              className="text-foreground font-medium"
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              className="text-foreground font-medium"
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        )}
      </Container>
    </header>
  );
}
