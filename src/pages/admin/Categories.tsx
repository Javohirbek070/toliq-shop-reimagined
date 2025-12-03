import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories as initialCategories, type Category } from "@/data/menuData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: "Kategoriya o'chirildi",
      description: "Kategoriya muvaffaqiyatli o'chirildi",
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleSave = (data: { name: string; slug: string }) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...data } : c))
      );
      toast({ title: "Kategoriya yangilandi" });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: data.name,
        slug: data.slug,
      };
      setCategories((prev) => [...prev, newCategory]);
      toast({ title: "Kategoriya qo'shildi" });
    }
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Kategoriyalar</h1>
          <p className="text-muted-foreground">Menu kategoriyalarini boshqaring</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingCategory(null);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4" />
              Yangi kategoriya
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingCategory(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="glass-card rounded-xl p-6 group hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground">/{category.slug}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => handleEdit(category)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface CategoryFormProps {
  category: Category | null;
  onSave: (data: { name: string; slug: string }) => void;
  onCancel: () => void;
}

function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
  });

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setFormData({ name, slug });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nomi</Label>
        <Input
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Kategoriya nomi"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Slug</Label>
        <Input
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="kategoriya-slug"
          required
        />
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
