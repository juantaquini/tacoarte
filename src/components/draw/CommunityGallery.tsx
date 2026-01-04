"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Drawing = {
  id: string;
  image_url: string;
  created_at: string;
  email?: string | null;
};

export default function CommunityGallery() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const res = await fetch("/api/drawings");
        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setDrawings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setDrawings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawings();
  }, []);

  if (loading) {
    return <div className="py-24 text-center opacity-60">Loading gallery…</div>;
  }

  return (
    <div className="w-full px-4 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="columns-2 md:columns-4 gap-4">
          {drawings.map((drawing) => (
            <div
              key={drawing.id}
              className="mb-4 break-inside-avoid bg-white overflow-hidden"
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

        {drawings.length === 0 && (
          <p className="text-center opacity-60 py-24">No sketches yet</p>
        )}
      </div>
    </div>
  );
}
