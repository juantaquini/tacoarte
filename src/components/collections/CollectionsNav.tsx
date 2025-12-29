"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ShopifyCollection } from "@/types/shopify";

type Props = { edges: { node: ShopifyCollection }[] };

export default function CollectionsNav({ edges }: Props) {
  const pathname = usePathname();
  const activeHandle =
    pathname.startsWith("/collections/")
      ? pathname.split("/")[2] ?? undefined
      : undefined;

  return (
    <>
      {edges.map(({ node }) => {
        const isActive = activeHandle === node.handle;
        const cls =
          `inline-block whitespace-nowrap text-sm font-medium ` +
          `hover:underline transition duration-200 ` +
          (isActive ? "underline -translate-y-3" : "");
        return (
          <Link key={node.id} href={`/collections/${node.handle}`} className={cls}>
            {node.title}
          </Link>
        );
      })}
    </>
  );
}