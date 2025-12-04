import { useState } from "react";
import { useCategories, type Category } from "@/hooks/useCategories";
import { useProducts, formatPrice, type Product } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Plus, Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuSectionProps {
  onAddToCart: (item: Product) => void;
}

export function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: products, isLoading: productsLoading } = useProducts(activeCategory || undefined);

  // Set default category when loaded
  if (categories && categories.length > 0 && !activeCategory) {
    setActiveCategory(categories[0].slug);
  }

  const filteredProducts = activeCategory
    ? products?.filter((p) => p.category?.slug === activeCategory)
    : products;

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Bizning Menu</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Mazali Tanlovlar
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Premium ingredientlar va professional oshpazlar tomonidan tayyorlangan taomlar
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categoriesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))
          ) : (
            categories?.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.slug ? "default" : "secondary"}
                onClick={() => setActiveCategory(category.slug)}
                className="transition-all duration-300"
              >
                {category.name}
              </Button>
            ))
          )}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-square" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-1/3" />
                </div>
              </div>
            ))
          ) : (
            filteredProducts?.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                index={index}
                onAddToCart={onAddToCart}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

interface MenuCardProps {
  item: Product;
  index: number;
  onAddToCart: (item: Product) => void;
}

function MenuCard({ item, index, onAddToCart }: MenuCardProps) {
  return (
    <div
      className="group glass-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.is_hot && (
            <span className="flex items-center gap-1 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
              <Flame className="w-3 h-3" />
              Issiq
            </span>
          )}
          {item.is_new && (
            <span className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              <Sparkles className="w-3 h-3" />
              Yangi
            </span>
          )}
        </div>

        {/* Add Button */}
        <Button
          size="icon"
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
          onClick={() => onAddToCart(item)}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
        <h3 className="font-display font-semibold text-lg mb-2">{item.name}</h3>
        <p className="text-primary font-bold">{formatPrice(item.price)}</p>
      </div>
    </div>
  );
}
