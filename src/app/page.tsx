import { HeroParallax } from "@/components/ui/hero-parallax";
import { mainFeatures } from "@/data/fitness-feature";

export default function HomePage() {
  return (
    <main className="bg-black">
      <HeroParallax products={mainFeatures} />
    </main>
  );
}
