import { getCollections } from "@/lib/shopify";
import { redirect } from "next/navigation";

export default async function CollectionsPage() {
  const data = await getCollections();
  const firstCollection =
    data.collections?.edges?.[0]?.node;

  if (!firstCollection) {
    return null;
  }

  redirect(`/collections/${firstCollection.handle}`);
}
