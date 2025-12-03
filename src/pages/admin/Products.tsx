import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { menuItems, categories, formatPrice, type MenuItem } from "@/data/menuData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const [products, setProducts] = useState<MenuItem[]>(menuItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Mahsulot o'chirildi",
      description: "Mahsulot muvaffaqiyatli o'chirildi",
    });
  };

  const handleEdit = (product: MenuItem) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSave = (data: Partial<MenuItem>) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data } : p))
      );
      toast({ title: "Mahsulot yangilandi" });
    } else {
      const newProduct: MenuItem = {
        id: Date.now().toString(),
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        image: data.image || "",
        category: data.category || "burgers",
      };
      setProducts((prev) => [...prev, newProduct]);
      toast({ title: "Mahsulot qo'shildi" });
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Mahsulotlar</h1>
          <p className="text-muted-foreground">Barcha mahsulotlarni boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4" />
              Yangi mahsulot
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingProduct(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Mahsulot qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="glass-card rounded-xl overflow-hidden group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => handleEdit(product)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-1">
                {categories.find((c) => c.slug === product.category)?.name}
              </p>
              <h3 className="font-semibold truncate">{product.name}</h3>
              <p className="text-primary font-bold">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProductFormProps {
  product: MenuItem | null;
  onSave: (data: Partial<MenuItem>) => void;
  onCancel: () => void;
}

function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    image: product?.image || "",
    category: product?.category || "burgers",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      image: formData.image,
      category: formData.category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nomi</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Mahsulot nomi"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Tavsif</Label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Qisqa tavsif"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Narxi (so'm)</Label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="45000"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Rasm URL</Label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Kategoriya</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Bekor qilish
        </Button>
        <Button type="submit" variant="hero" className="flex-1">
          Saqlash
        </Button>
      </div>
    </form>
  );
}
