import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    const upload = await cloudinary.uploader.upload(image, {
      folder: "taco-p5",
    });

    const { error } = await supabase.from("drawings").insert({
      image_url: upload.secure_url,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
