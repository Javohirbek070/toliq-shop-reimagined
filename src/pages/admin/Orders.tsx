import { useState } from "react";
import { Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  customer: string;
  phone: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
  address: string;
}

const mockOrders: Order[] = [
  {
    id: "001",
    customer: "Alisher Karimov",
    phone: "+998 90 123 45 67",
    items: [
      { name: "Classic Burger", quantity: 2, price: 45000 },
      { name: "Cappuccino", quantity: 2, price: 22000 },
    ],
    total: 134000,
    status: "Yangi",
    createdAt: "2024-01-15T10:30:00",
    address: "Chilonzor, 1-mavze, 15-uy",
  },
  {
    id: "002",
    customer: "Madina Rahimova",
    phone: "+998 91 234 56 78",
    items: [
      { name: "Chili Burger", quantity: 1, price: 52000 },
      { name: "Tiramisu", quantity: 1, price: 35000 },
    ],
    total: 87000,
    status: "Tayyorlanmoqda",
    createdAt: "2024-01-15T10:15:00",
    address: "Yunusobod, 4-mavze, 8-uy",
  },
  {
    id: "003",
    customer: "Jasur Toshmatov",
    phone: "+998 93 345 67 89",
    items: [
      { name: "Double Cheese", quantity: 2, price: 58000 },
      { name: "Fresh limonad", quantity: 3, price: 15000 },
    ],
    total: 161000,
    status: "Yetkazilmoqda",
    createdAt: "2024-01-15T09:45:00",
    address: "Sergeli, 6-mavze, 22-uy",
  },
  {
    id: "004",
    customer: "Nilufar Azimova",
    phone: "+998 94 456 78 90",
    items: [{ name: "Sezar salati", quantity: 1, price: 42000 }],
    total: 42000,
    status: "Bajarildi",
    createdAt: "2024-01-15T09:00:00",
    address: "Mirzo Ulug'bek, 2-mavze, 5-uy",
  },
];

const statuses = ["Hammasi", "Yangi", "Tayyorlanmoqda", "Yetkazilmoqda", "Bajarildi"];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Hammasi");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.includes(searchQuery);
    const matchesStatus =
      statusFilter === "Hammasi" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast({
      title: "Status yangilandi",
      description: `Buyurtma #${orderId} - ${newStatus}`,
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("uz-UZ").format(price) + " so'm";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Buyurtmalar</h1>
        <p className="text-muted-foreground">Barcha buyurtmalarni ko'ring va boshqaring</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buyurtma yoki mijoz qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Mijoz</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Summa</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Vaqt</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-primary">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <StatusBadge status={order.status} />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.slice(1).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("uz-UZ")}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              Buyurtma #{selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mijoz</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="font-medium">{selectedOrder.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Manzil</p>
                  <p className="font-medium">{selectedOrder.address}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">Mahsulotlar</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="text-lg font-medium">Jami:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Yangi: "bg-blue-500/20 text-blue-500",
    Tayyorlanmoqda: "bg-yellow-500/20 text-yellow-500",
    Yetkazilmoqda: "bg-purple-500/20 text-purple-500",
    Bajarildi: "bg-green-500/20 text-green-500",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}
