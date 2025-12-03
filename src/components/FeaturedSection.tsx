import { featuredItem, formatPrice } from "@/data/menuData";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";

interface FeaturedSectionProps {
  onAddToCart: () => void;
}

export function FeaturedSection({ onAddToCart }: FeaturedSectionProps) {
  if (!featuredItem) return null;

  const features = [
    "Premium go'sht",
    "Maxsus sous",
    "Tez yetkazib berish",
  ];

  return (
    <section id="featured" className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            {/* Discount Badge */}
            <div className="absolute -top-4 -left-4 z-10">
              <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-xl font-bold text-lg rotate-[-12deg] shadow-lg">
                -15%
              </div>
              <p className="text-xs text-muted-foreground mt-2">Bugun tugaydi</p>
            </div>

            <div className="relative rounded-3xl overflow-hidden glow">
              <img
                src={featuredItem.image}
                alt={featuredItem.name}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </div>

          {/* Content Side */}
          <div>
            <span className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
              Kun Taomi
            </span>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Bugun biz tavsiya qilamiz – <br />
              <span className="text-primary">{featuredItem.name}!</span>
            </h2>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Issiq va mazali! Premium mol go'shti, maxsus chili sousi, jalapeno va 
              eriydigan cheddar siri bilan tayyorlangan mukammal burger. 
              Har bir tishlov – yangi ta'm kashfiyoti.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mb-8">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg"
                >
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* Price and CTA */}
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(featuredItem.price)}
                </p>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(Math.floor(featuredItem.price * 0.85))}
                </p>
              </div>
              <Button variant="hero" size="xl" onClick={onAddToCart}>
                <ShoppingCart className="w-5 h-5" />
                Savatga qo'shish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
