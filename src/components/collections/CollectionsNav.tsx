import Link from "next/link";
import type { ShopifyCollection } from "@/types/shopify";

type Props = {
  collections?: { node: ShopifyCollection }[];
  tags?: string[];
  collectionHandle?: string;
  currentTag?: string;
};

export default function CollectionsNav({
  collections,
  tags,
  collectionHandle,
  currentTag,
}: Props) {
  const linkClass =
    "inline-block whitespace-nowrap text-sm font-medium uppercase transition duration-200";
  const activeClass = "-translate-y-2";

  return (
    <nav className="flex justify-center gap-6 overflow-x-auto py-8">
      {/* Mode: List Collections */}
      {collections?.map(({ node }) => (
        <Link
          key={node.id}
          href={`/collections/${node.handle}`}
          className={linkClass}
        >
          {node.title}
        </Link>
      ))}

      {/* Mode: List Tags (inside a collection) */}
      {tags && collectionHandle && (
        <>
          <Link href="/collections" className={linkClass}>
            Back
          </Link>
          <Link
            href={`/collections/${collectionHandle}`}
            className={`${linkClass} ${!currentTag ? activeClass : ""}`}
          >
            All
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/collections/${collectionHandle}?tag=${encodeURIComponent(
                tag
              )}`}
              className={`${linkClass} ${currentTag === tag ? activeClass : ""}`}
            >
              {tag}
            </Link>
          ))}
        </>
      )}
    </nav>
  );
}