"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { ShoppingBagIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import CartPreview from "@/components/cart/CartPreview";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export default function Header() {
  const { totalQuantity, checkoutUrl, isCartOpen, openCart, closeCart } =
    useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMouseEnter = () => openCart();
  const handleMouseLeave = () => closeCart(300);

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }}
    >
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300
        ${mobileMenuOpen ? "bg-white" : "bg-transparent"}`}
      >
        <Container className="py-4">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <Bars3Icon className="h-6 w-6 text-foreground" />
            </button>

            {/* Logo (link al home, cierra menú en mobile) */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute left-1/2 -translate-x-1/2 text-2xl font-medium tracking-widest
                         md:static md:translate-x-0 md:flex-1"
            >
              TACOARTE
            </Link>

            {/* Desktop nav */}
            <nav className="hidden flex-1 justify-center md:flex">
              <Link className="px-4 py-2 font-medium" href="/collections">
                Gallery
              </Link>
              <Link className="px-4 py-2 font-medium" href="/exhibitions">
                Exhibitions
              </Link>
              <Link className="px-4 py-2 font-medium" href="/draw">
                Create a drawing
              </Link>
              <Link className="px-4 py-2 font-medium" href="/about">
                About
              </Link>
            </nav>

            {/* Cart */}
            <div className="relative flex flex-1 justify-end">
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link href="/cart" className="relative block">
                  <ShoppingBagIcon
                    className={`h-6 w-6 transition text-foreground ${
                      totalQuantity > 0 ? "text-foreground" : "text-neutral-400"
                    }`}
                  />
                  {totalQuantity > 0 && (
                    <span className="absolute -right-1 -top-4 text-xs">
                      {totalQuantity}
                    </span>
                  )}
                </Link>

                {totalQuantity > 0 && checkoutUrl && (
                  <div
                    className={`absolute right-0 top-2 z-50 transition-all duration-300
                    ${
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

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav
              className="md:hidden absolute top-16 left-0 right-0 bg-white border-b
                            px-6 py-6 shadow-xl flex flex-col space-y-4"
            >
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/exhibitions"
                onClick={() => setMobileMenuOpen(false)}
              >
                Exhibitions
              </Link>
              <Link href="/draw" onClick={() => setMobileMenuOpen(false)}>
                Create a drawing
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
            </nav>
          )}
        </Container>
      </header>
    </ClickAwayListener>
  );
}
