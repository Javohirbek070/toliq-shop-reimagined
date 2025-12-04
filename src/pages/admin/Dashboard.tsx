import { ShoppingBag, Package, DollarSign, TrendingUp } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useProducts, formatPrice } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: products, isLoading: productsLoading } = useProducts();

  const todayOrders = orders?.filter(
    (o) => new Date(o.created_at).toDateString() === new Date().toDateString()
  ) || [];
  
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = todayOrders.length > 0 ? Math.floor(todayRevenue / todayOrders.length) : 0;

  const stats = [
    {
      name: "Bugungi buyurtmalar",
      value: todayOrders.length.toString(),
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      name: "Jami mahsulotlar",
      value: products?.length.toString() || "0",
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      name: "Bugungi daromad",
      value: formatPrice(todayRevenue).replace(" so'm", ""),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      name: "O'rtacha buyurtma",
      value: formatPrice(avgOrder).replace(" so'm", ""),
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
    },
  ];

  const recentOrders = orders?.slice(0, 5) || [];

  if (ordersLoading || productsLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Safi Café boshqaruv paneli</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-display font-semibold">So'nggi buyurtmalar</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Hozircha buyurtmalar yo'q
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Mijoz</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Summa</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Vaqt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm">{order.customer_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString("uz-UZ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Yangi": "bg-blue-500/20 text-blue-500",
    "Tayyorlanmoqda": "bg-yellow-500/20 text-yellow-500",
    "Yetkazilmoqda": "bg-purple-500/20 text-purple-500",
    "Bajarildi": "bg-green-500/20 text-green-500",
  };

  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}
