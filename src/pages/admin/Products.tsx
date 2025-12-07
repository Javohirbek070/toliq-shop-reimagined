import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct,
  formatPrice,
  type Product 
} from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({
        title: "Mahsulot o'chirildi",
        description: "Mahsulot muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Mahsulotni o'chirishda xatolik",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: Partial<Product>) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...data });
        toast({ title: "Mahsulot yangilandi" });
      } else {
        await createProduct.mutateAsync({
          name: data.name!,
          description: data.description,
          price: data.price!,
          image: data.image,
          category_id: data.category_id,
          is_hot: data.is_hot,
          is_new: data.is_new,
          discount: data.discount,
          is_featured: data.is_featured,
        });
        toast({ title: "Mahsulot qo'shildi" });
      }
      setIsDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Saqlashda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

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
          <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              categories={categories || []}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingProduct(null);
              }}
              isLoading={createProduct.isPending || updateProduct.isPending}
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
                src={product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
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
                {product.category?.name || "Kategoriyasiz"}
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
  product: Product | null;
  categories: { id: string; name: string; slug: string }[];
  onSave: (data: Partial<Product>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ProductForm({ product, categories, onSave, onCancel, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    image: product?.image || "",
    category_id: product?.category_id || "",
    is_hot: product?.is_hot || false,
    is_new: product?.is_new || false,
    is_featured: product?.is_featured || false,
    discount: product?.discount?.toString() || "0",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      image: formData.image,
      category_id: formData.category_id || null,
      is_hot: formData.is_hot,
      is_new: formData.is_new,
      is_featured: formData.is_featured,
      discount: parseInt(formData.discount) || 0,
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
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
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
          <Label>Chegirma (%)</Label>
          <Input
            type="number"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            placeholder="0"
            min="0"
            max="100"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Rasm URL</Label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label>Kategoriya</Label>
        <Select
          value={formData.category_id}
          onValueChange={(value) => setFormData({ ...formData, category_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kategoriya tanlang" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Toggles */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <Label>Issiq (Hot)</Label>
          <Switch
            checked={formData.is_hot}
            onCheckedChange={(checked) => setFormData({ ...formData, is_hot: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Yangi</Label>
          <Switch
            checked={formData.is_new}
            onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Kun taomi (Featured)</Label>
          <Switch
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Bekor qilish
        </Button>
        <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
          {isLoading ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </form>
  );
}
