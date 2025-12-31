"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { ShoppingBagIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import CartPreview from "@/components/cart/CartPreview";

export default function Header() {
  const { totalQuantity, checkoutUrl, isCartOpen, openCart, closeCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMouseEnter = () => {
    openCart();
  };

  const handleMouseLeave = () => {
    closeCart(300);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <Container className="py-4">
        <div className="flex h-16 items-center justify-between">
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Bars3Icon className="h-6 w-6 text-foreground" />
          </button>
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-2xl font-medium tracking-widest md:static md:translate-x-0 md:flex-1"
          >
            TACOARTE
          </Link>
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
          <div className="relative flex flex-1 justify-end">
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/cart" className="relative block">
                <ShoppingBagIcon
                  className={`text-foreground h-6 w-6 cursor-pointer transition ${
                    totalQuantity > 0 ? "text-black" : "text-neutral-400"
                  }`}
                />
                {totalQuantity > 0 && (
                  <span className="absolute -right-1 -top-4 block h-2 w-2">{totalQuantity}</span>
                )}
              </Link>
              {totalQuantity > 0 && checkoutUrl && (
                <div
                  className={`absolute right-0 top-2 z-50 transition-all duration-300 ease-in-out ${
                    isCartOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="pt-2">
                    <CartPreview />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
