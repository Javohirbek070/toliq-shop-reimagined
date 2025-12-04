import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateOrder } from "@/hooks/useOrders";
import { formatPrice } from "@/hooks/useProducts";
import type { CartItem } from "@/components/CartDrawer";
import { User, Phone, MapPin, CheckCircle, Loader2, Navigation } from "lucide-react";

// Validation schema
const orderSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(100, "Ism juda uzun"),
  phone: z.string()
    .trim()
    .min(9, "Telefon raqam noto'g'ri")
    .max(20, "Telefon raqam juda uzun")
    .regex(/^[\d\s+()-]+$/, "Telefon raqam faqat raqamlardan iborat bo'lishi kerak"),
  address: z.string()
    .trim()
    .min(5, "Manzil kamida 5 ta belgidan iborat bo'lishi kerak")
    .max(500, "Manzil juda uzun"),
});

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onComplete: () => void;
}

export function CheckoutDialog({
  isOpen,
  onClose,
  items,
  onComplete,
}: CheckoutDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Xatolik",
        description: "Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Try to get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=uz`
          );
          const data = await response.json();
          
          if (data.display_name) {
            setAddress(data.display_name);
          } else {
            // If reverse geocoding fails, use coordinates
            setAddress(`Koordinatalar: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
        } catch (error) {
          // Fallback to coordinates if API fails
          setAddress(`Koordinatalar: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
        
        setIsGettingLocation(false);
        toast({
          title: "Muvaffaqiyat",
          description: "Joylashuvingiz aniqlandi",
        });
      },
      (error) => {
        setIsGettingLocation(false);
        let message = "Joylashuvni aniqlashda xatolik";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Joylashuvga ruxsat berilmadi. Iltimos, brauzer sozlamalaridan ruxsat bering.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Joylashuv ma'lumotlari mavjud emas";
            break;
          case error.TIMEOUT:
            message = "Joylashuvni aniqlash vaqti tugadi";
            break;
        }
        toast({
          title: "Xatolik",
          description: message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const validateForm = (): boolean => {
    try {
      orderSchema.parse({ name, phone, address });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha maydonlarni to'g'ri to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      await createOrder.mutateAsync({
        customer_name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        total,
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setName("");
        setPhone("");
        setAddress("");
        setErrors({});
        onComplete();
      }, 3000);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Buyurtma yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (!createOrder.isPending && !isSuccess) {
      setErrors({});
      onClose();
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">
              Buyurtma qabul qilindi!
            </h2>
            <p className="text-muted-foreground">
              Tez orada siz bilan bog'lanamiz
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Buyurtma berish</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ismingiz</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="To'liq ismingiz"
                className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                required
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon raqam</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                placeholder="+998 90 123 45 67"
                className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                required
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="address">Manzil</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={getLocation}
                disabled={isGettingLocation}
                className="h-7 text-xs gap-1"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Aniqlanmoqda...
                  </>
                ) : (
                  <>
                    <Navigation className="w-3 h-3" />
                    Joylashuvni aniqlash
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors({ ...errors, address: "" });
                }}
                placeholder="Yetkazib berish manzili yoki joylashuvni aniqlang"
                className={`pl-10 min-h-[80px] ${errors.address ? "border-destructive" : ""}`}
                required
              />
            </div>
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-sm text-muted-foreground">Buyurtma:</p>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-semibold">Jami:</span>
              <span className="font-bold text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={createOrder.isPending}
          >
            {createOrder.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Yuborilmoqda...
              </>
            ) : (
              "Buyurtma berish"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
