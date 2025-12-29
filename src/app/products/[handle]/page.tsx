import { getProductByHandle } from "@/lib/shopify";
import Container from "@/components/ui/Container";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Image from "next/image";

type Props = {
  params: Promise<{ handle: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;

  const data = await getProductByHandle(handle);
  const product = data?.product;

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <Container className="py-4">
      <div className="grid gap-8 md:grid-cols-1">
        <div className="h-[55vh] md:h-[75vh] overflow-x-scroll">
          <div className="flex h-full gap-4 snap-x snap-mandatory">
            {product.images.edges.map(({ node }) => (
              <div
                key={node.url}
                className="relative shrink-0 min-w-full h-full snap-center"
              >
                <Image
                  src={node.url}
                  alt={node.altText ?? product.title}
                  width={node.width ?? 1200}
                  height={node.height ?? 800}
                  sizes="100vw"
                  className="h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 align-center">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-2 flex-1 align-center">
              <h1 className="text-xl">{product.title}</h1>|
              <p className="text-xl">
                {product.priceRange.minVariantPrice.amount}{" "}
                {product.priceRange.minVariantPrice.currencyCode}
              </p>
            </div>
            {product.customDimensions?.value && (
              <div className="prose text-foreground text-neutral-600">
                <p>{product.customDimensions.value}</p>
              </div>
            )}
            <div className="flex flex-1 justify-end">
              <AddToCartButton variantId={product.variants.edges[0].node.id} />
            </div>
          </div>
          <div className="flex flex-col text-center gap-8">
            <div
              className="prose text-foreground text-neutral-600"
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml,
              }}
            />
            {product.customCareInstructions?.value && (
              <div className="prose text-foreground text-neutral-600">
                <h2 className="text-base font-medium">Care Instructions</h2>
                <p>{product.customCareInstructions.value}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
