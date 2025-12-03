import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    cafeName: "Safi Café",
    phone: "+998 90 123 45 67",
    address: "Toshkent, Chilonzor tumani, 1-mavze",
    workingHours: "09:00 - 23:00",
    description: "Premium kafe - tezkor taomlar, shirinliklar va ichimliklar",
    isDeliveryActive: true,
    minOrderAmount: "30000",
    deliveryFee: "10000",
  });

  const handleSave = () => {
    toast({
      title: "Sozlamalar saqlandi",
      description: "Barcha o'zgarishlar muvaffaqiyatli saqlandi",
    });
  };

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
              value={settings.cafeName}
              onChange={(e) => setSettings({ ...settings, cafeName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Telefon raqam</Label>
            <Input
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Manzil</Label>
            <Input
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Ish vaqti</Label>
            <Input
              value={settings.workingHours}
              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Tavsif</Label>
            <Textarea
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
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
              checked={settings.isDeliveryActive}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, isDeliveryActive: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Minimal buyurtma summasi (so'm)</Label>
            <Input
              type="number"
              value={settings.minOrderAmount}
              onChange={(e) => setSettings({ ...settings, minOrderAmount: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Yetkazib berish narxi (so'm)</Label>
            <Input
              type="number"
              value={settings.deliveryFee}
              onChange={(e) => setSettings({ ...settings, deliveryFee: e.target.value })}
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
