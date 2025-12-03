import { useState } from "react";
import { categories, menuItems, formatPrice, type MenuItem } from "@/data/menuData";
import { Button } from "@/components/ui/button";
import { Plus, Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

export function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].slug);

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory
  );

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
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.slug ? "default" : "secondary"}
              onClick={() => setActiveCategory(category.slug)}
              className="transition-all duration-300"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <MenuCard
              key={item.id}
              item={item}
              index={index}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface MenuCardProps {
  item: MenuItem;
  index: number;
  onAddToCart: (item: MenuItem) => void;
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
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.isHot && (
            <span className="flex items-center gap-1 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
              <Flame className="w-3 h-3" />
              Issiq
            </span>
          )}
          {item.isNew && (
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
