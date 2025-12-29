"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createCart, addToCart, getCart } from "@/lib/cart";

type CartContextType = {
  cartId: string | null;
  checkoutUrl: string | null;
  totalQuantity: number;
  lines: any[];
  addItem: (variantId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [lines, setLines] = useState<any[]>([]);

  /* ------------------------------ INIT CART ------------------------------ */
  useEffect(() => {
    const storedCartId = localStorage.getItem("cartId");

    if (storedCartId) {
      setCartId(storedCartId);
    } else {
      createCart().then((data) => {
        const id = data.cartCreate.cart.id;
        const url = data.cartCreate.cart.checkoutUrl;

        localStorage.setItem("cartId", id);
        setCartId(id);
        setCheckoutUrl(url);
      });
    }
  }, []);

  /* ----------------------------- FETCH CART ------------------------------ */
  async function fetchCart() {
    if (!cartId) return;

    const data = await getCart(cartId);
    setLines(data.cart.lines.edges);
    setTotalQuantity(data.cart.totalQuantity);
    setCheckoutUrl(data.cart.checkoutUrl);
  }

  /* ------------------------------ ADD ITEM ------------------------------- */
  async function addItem(variantId: string) {
    if (!cartId) return;

    await addToCart(cartId, variantId);
    fetchCart();
  }

  useEffect(() => {
    if (cartId) fetchCart();
  }, [cartId]);

  return (
    <CartContext.Provider
      value={{
        cartId,
        checkoutUrl,
        totalQuantity,
        lines,
        addItem,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
