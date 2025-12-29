import { shopifyFetch } from "./shopify";

/* -------------------------------------------------------------------------- */
/*                                 CREATE CART                                */
/* -------------------------------------------------------------------------- */

export async function createCart() {
  return shopifyFetch<{
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
      };
    };
  }>({
    query: `
      mutation CreateCart {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
        }
      }
    `,
  });
}

/* -------------------------------------------------------------------------- */
/*                                 ADD TO CART                                */
/* -------------------------------------------------------------------------- */

export async function addToCart(cartId: string, variantId: string) {
  return shopifyFetch({
    query: `
      mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            totalQuantity
          }
        }
      }
    `,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity: 1 }],
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                                  GET CART                                  */
/* -------------------------------------------------------------------------- */

export async function getCart(cartId: string) {
  return shopifyFetch<{
    cart: {
      totalQuantity: number;
      checkoutUrl: string;
      lines: {
        edges: {
          node: {
            id: string;
            quantity: number;
            merchandise: {
              id: string;
              title: string;
              price: {
                amount: string;
                currencyCode: string;
              };
              product: {
                title: string;
              };
              image?: {
                url: string;
                altText?: string;
              };
            };
          };
        }[];
      };
    };
  }>({
    query: `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          totalQuantity
          checkoutUrl
          lines(first: 20) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { cartId },
  });
}
