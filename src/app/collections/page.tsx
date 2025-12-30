import { getCollections } from "@/lib/shopify";
import CollectionsNav from "@/components/collections/CollectionsNav";

export default async function CollectionsPage() {
  const data = await getCollections();
  const collections = data.collections?.edges ?? [];

  return <CollectionsNav collections={collections} />;
}