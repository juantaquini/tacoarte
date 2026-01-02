import Container from "@/components/ui/Container";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export const dynamic = "force-dynamic"; // evita cache

type Drawing = {
  id: string;
  image_url: string;
  created_at: string;
  email?: string | null;
};

export default async function SketchesPage() {
  const { data, error } = await supabase
    .from("drawings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error cargando dibujos
      </div>
    );
  }

  return (
      <Container className="py-32">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.map((drawing: Drawing) => (
          <div
            key={drawing.id}
            className="border rounded overflow-hidden"
          >
            <Image
              src={drawing.image_url}
              alt="Sketch"
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
