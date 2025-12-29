"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import Container from "@/components/ui/Container";

export default function CartPage() {
  const { lines, fetchCart, checkoutUrl, totalQuantity } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Container className="max-w-3xl py-16">
      <h1 className="text-3xl font-medium mb-8">Carrito</h1>

      {lines.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <div>
            {lines.map((item) => (
              <CartItem key={item.node.id} item={item} />
            ))}
          </div>

          <div className="mt-10 flex justify-between items-center">
            <p>
              Total de productos: <strong>{totalQuantity}</strong>
            </p>

            <button
              onClick={() => (window.location.href = checkoutUrl!)}
              className="bg-black text-white px-6 py-3 rounded"
            >
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </Container>
  );
}
