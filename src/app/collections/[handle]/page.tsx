import { getCollectionByHandle } from "@/lib/shopify";
import ProductGrid from "@/components/products/ProductGrid";
import Link from "next/link";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ tag?: string }>;
};

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const { tag } = (searchParams ? await searchParams : {}) as { tag?: string };
  const data = await getCollectionByHandle(handle);

  return (
    <div className="flex flex-col gap-12">
      <header className="max-w-2xl">
        {(() => {
          const edges = data.collection.products.edges;
          const tags = Array.from(
            new Set(edges.flatMap(({ node }) => (node.tags ?? [])).filter(Boolean))
          ).sort();

          if (tags.length === 0) return null;

          return (
            <nav className="flex gap-4 overflow-x-auto pt-4">
              <Link
                href={`/collections/${handle}`}
                className={`inline-block whitespace-nowrap text-sm font-medium hover:underline transition duration-200 ${!tag ? "underline -translate-y-1" : ""}`}
              >
                All
              </Link>
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/collections/${handle}?tag=${encodeURIComponent(t)}`}
                  className={`inline-block whitespace-nowrap text-sm font-medium hover:underline transition duration-200 ${tag === t ? "underline -translate-y-1" : ""}`}
                >
                  {t}
                </Link>
              ))}
            </nav>
          );
        })()}
      </header>
      {(() => {
        const edges = data.collection.products.edges;
        const filtered = tag ? edges.filter(({ node }) => (node.tags ?? []).includes(tag)) : edges;
        return <ProductGrid products={filtered} />;
      })()}
    </div>
  );
}
