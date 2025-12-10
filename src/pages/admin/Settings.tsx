import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSettings, useUpdateSettings, type CafeSettings } from "@/hooks/useSettings";
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [formData, setFormData] = useState<Partial<CafeSettings>>({
    cafe_name: "",
    phone: "",
    address: "",
    working_hours: "",
    description: "",
    is_delivery_active: true,
    min_order_amount: 30000,
    delivery_fee: 10000,
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      if (!settings?.id) return;
      await updateSettings.mutateAsync({
        id: settings.id,
        ...formData,
      });
      toast({
        title: "Sozlamalar saqlandi",
        description: "Barcha o'zgarishlar muvaffaqiyatli saqlandi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Sozlamalarni saqlashda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Sozlamalar</h1>
        <p className="text-muted-foreground">Kafe sozlamalarini boshqaring</p>
      </div>

      {/* General Settings */}
      <div className="glass-card rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-display font-semibold">Umumiy ma'lumotlar</h2>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Kafe nomi</Label>
            <Input
              value={formData.cafe_name || ""}
              onChange={(e) => setFormData({ ...formData, cafe_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Telefon raqam</Label>
            <Input
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Manzil</Label>
            <Input
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Ish vaqti</Label>
            <Input
              value={formData.working_hours || ""}
              onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Tavsif</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="glass-card rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-display font-semibold">Yetkazib berish</h2>
        
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Yetkazib berish faol</Label>
              <p className="text-sm text-muted-foreground">
                Mijozlar buyurtma berishlari mumkin
              </p>
            </div>
            <Switch
              checked={formData.is_delivery_active ?? true}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_delivery_active: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Minimal buyurtma summasi (so'm)</Label>
            <Input
              type="number"
              value={formData.min_order_amount || "30000"}
              onChange={(e) => setFormData({ ...formData, min_order_amount: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label>Yetkazib berish narxi (so'm)</Label>
            <Input
              type="number"
              value={formData.delivery_fee || "10000"}
              onChange={(e) => setFormData({ ...formData, delivery_fee: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button variant="hero" size="lg" onClick={handleSave}>
        Sozlamalarni saqlash
      </Button>
    </div>
  );
}
