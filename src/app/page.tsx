import Image from "next/image";
import Container from "@/components/ui/Container";
import ImageSketch from "@/components/p5/ImageSketch";

export default function Home() {
  return (
    <Container className="py-16">
      {/* <div className="relative w-full h-[70vh]">
        <Image
          src="/images/aguayo-azul.png"
          alt="Aguayo azul"
          fill
          className="object-contain object-center"
          priority
          sizes="100vw"
        />
      </div> */}
      <ImageSketch/>
    </Container>
  );
}
