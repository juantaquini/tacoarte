"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalQuantity, checkoutUrl } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur">
      <Container className="py-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-1 text-xl font-medium tracking-widest">
            TACOARTE
          </Link>

          {/* Navigation */}
          <nav className="hidden flex-1 justify-center md:flex">
            <Link className="text-foreground font-medium px-4 py-2" href="/collections">Shop</Link>
            <Link className="text-foreground font-medium px-4 py-2" href="/exhibitions">Exhibitions</Link>
            <Link className="text-foreground font-medium px-4 py-2" href="/contact">Contact</Link>
            <Link className="text-foreground font-medium px-4 py-2" href="/about">About</Link>
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
      </Container>
    </header>
  );
}
