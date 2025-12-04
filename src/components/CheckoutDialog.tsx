import { useState } from "react";
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
import { User, Phone, MapPin, CheckCircle } from "lucide-react";

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
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createOrder.mutateAsync({
        customer_name: name,
        phone,
        address,
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
        onComplete();
      }, 3000);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Buyurtma yuborishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
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
                onChange={(e) => setName(e.target.value)}
                placeholder="To'liq ismingiz"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon raqam</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Manzil</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Yetkazib berish manzili"
                className="pl-10 min-h-[80px]"
                required
              />
            </div>
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
            {createOrder.isPending ? "Yuborilmoqda..." : "Buyurtma berish"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
