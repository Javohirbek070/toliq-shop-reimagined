import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, MapPin, Sparkles } from "lucide-react";

export function Hero() {
  const scrollToMenu = () => {
    document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8 animate-fade-up">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            PREMIUM CAFÉ EXPERIENCE
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-4 animate-fade-up delay-100">
          Safi <span className="text-primary italic">Café</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl font-display italic text-primary/90 mb-6 animate-fade-up delay-200">
          Joydan lazzatgacha
        </p>

        {/* Description */}
        <p className="max-w-xl mx-auto text-muted-foreground mb-10 animate-fade-up delay-300">
          Tezkor taomlar, shirinliklar, burgerlar — barchasi bir joyda. 
          Premium sifat va unutilmas ta'm.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-400">
          <Button variant="hero-outline" size="lg" onClick={scrollToMenu}>
            <Menu className="w-5 h-5" />
            Menu ko'rish
          </Button>
          <Button variant="hero" size="lg" onClick={scrollToMenu}>
            <ShoppingCart className="w-5 h-5" />
            Buyurtma berish
          </Button>
          <Button variant="ghost" size="lg" onClick={scrollToContact}>
            <MapPin className="w-5 h-5" />
            Lokatsiya
          </Button>
        </div>

        {/* Coffee Image */}
        <div className="mt-12 animate-fade-up delay-500">
          <div className="relative inline-block">
            <img
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400"
              alt="Coffee"
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-primary/30 shadow-2xl"
            />
            <div className="absolute inset-0 rounded-full glow" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
