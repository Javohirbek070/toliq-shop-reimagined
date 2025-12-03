export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isHot?: boolean;
  isNew?: boolean;
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const categories: Category[] = [
  { id: "1", name: "Burgerlar", slug: "burgers" },
  { id: "2", name: "Shirinliklar", slug: "desserts" },
  { id: "3", name: "Ichimliklar", slug: "drinks" },
  { id: "4", name: "Salatlar", slug: "salads" },
];

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Burger",
    description: "Mol go'shti • Pomidor • Salat • Sir",
    price: 45000,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    category: "burgers",
    isHot: true,
  },
  {
    id: "2",
    name: "Chili Burger",
    description: "Mol go'shti • Jalapeno • Cheddar • Sous",
    price: 52000,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400",
    category: "burgers",
  },
  {
    id: "3",
    name: "Double Cheese",
    description: "2x Kotlet • 2x Sir • Bodring • Piyoz",
    price: 58000,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
    category: "burgers",
    isHot: true,
  },
  {
    id: "4",
    name: "BBQ Burger",
    description: "Mol go'shti • BBQ sous • Bekon • Piyoz halqasi",
    price: 55000,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400",
    category: "burgers",
  },
  {
    id: "5",
    name: "Tiramisu",
    description: "Italyan shirinligi • Kofe • Maskarpone",
    price: 35000,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
    category: "desserts",
    isNew: true,
  },
  {
    id: "6",
    name: "Cheesecake",
    description: "Klassik • Qulupnay sousi • Krem",
    price: 38000,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
    category: "desserts",
  },
  {
    id: "7",
    name: "Shokoladli kek",
    description: "Qora shokolad • Vanilin • Qaymoq",
    price: 32000,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    category: "desserts",
  },
  {
    id: "8",
    name: "Americano",
    description: "Espresso • Issiq suv",
    price: 18000,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400",
    category: "drinks",
  },
  {
    id: "9",
    name: "Cappuccino",
    description: "Espresso • Sut ko'pigi • Kakao",
    price: 22000,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
    category: "drinks",
    isHot: true,
  },
  {
    id: "10",
    name: "Latte",
    description: "Espresso • Issiq sut • Vanil",
    price: 24000,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
    category: "drinks",
  },
  {
    id: "11",
    name: "Fresh limonad",
    description: "Limon • Yalpiz • Gaz suvi",
    price: 15000,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400",
    category: "drinks",
  },
  {
    id: "12",
    name: "Sezar salati",
    description: "Tovuq • Salat • Parmezan • Sous",
    price: 42000,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    category: "salads",
  },
  {
    id: "13",
    name: "Grek salati",
    description: "Pomidor • Bodring • Feta • Zaytun",
    price: 35000,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
    category: "salads",
    isNew: true,
  },
];

export const featuredItem = menuItems.find(item => item.id === "2");

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
};
