import { useFeaturedProduct, formatPrice } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedSectionProps {
  onAddToCart: () => void;
}

export function FeaturedSection({ onAddToCart }: FeaturedSectionProps) {
  const { data: featuredItem, isLoading } = useFeaturedProduct();

  const features = [
    "Premium go'sht",
    "Maxsus sous",
    "Tez yetkazib berish",
  ];

  if (isLoading) {
    return (
      <section id="featured" className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredItem) return null;

  const discountedPrice = featuredItem.discount 
    ? Math.floor(featuredItem.price * (1 - featuredItem.discount / 100))
    : featuredItem.price;

  return (
    <section id="featured" className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            {/* Discount Badge */}
            {featuredItem.discount > 0 && (
              <div className="absolute -top-4 -left-4 z-10">
                <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-xl font-bold text-lg rotate-[-12deg] shadow-lg">
                  -{featuredItem.discount}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">Bugun tugaydi</p>
              </div>
            )}

            <div className="relative rounded-3xl overflow-hidden glow">
              <img
                src={featuredItem.image || "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400"}
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
              {featuredItem.description || "Issiq va mazali! Premium ingredientlar bilan tayyorlangan mukammal taom. Har bir tishlov – yangi ta'm kashfiyoti."}
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
                {featuredItem.discount > 0 && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(featuredItem.price)}
                  </p>
                )}
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(discountedPrice)}
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
