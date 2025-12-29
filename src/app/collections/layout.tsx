import Container from "@/components/ui/Container";
import { getCollections } from "@/lib/shopify";
import type { ShopifyCollection } from "@/types/shopify";
import CollectionsNav from "@/components/collections/CollectionsNav";

export default async function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getCollections();
  const edges: { node: ShopifyCollection }[] =
    data.collections?.edges ?? [];

  return (
    <Container className="py-16">
      <nav className="flex gap-6 overflow-x-auto border-b-2 border-dashed border-foreground pb-4 pt-4">
        <CollectionsNav edges={edges} />
      </nav>
      <section>{children}</section>
    </Container>
  );
}
