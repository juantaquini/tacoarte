"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ variantId }: { variantId: string }) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(variantId)}
      className="bg-foreground px-6 py-2 text-white"
    >
        ADD TO CART
    </button>
  );
}
