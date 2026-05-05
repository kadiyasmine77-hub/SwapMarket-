export const mockCurrentUser = {
  id: "0",
  name: "Utilisateur",
  email: "",
  avatar: "",
  bio: "",
  city: "Casablanca",
  trustScore: 5.0,
  totalExchanges: 0,
  role: "user" as const,
};

export const mockCategories = [
  { id: "1", name: "Électronique", icon: "Laptop", count: 145 },
  { id: "2", name: "Vêtements", icon: "Shirt", count: 312 },
  { id: "3", name: "Livres", icon: "Book", count: 198 },
  { id: "4", name: "Maison", icon: "Home", count: 267 },
  { id: "5", name: "Sports", icon: "Dumbbell", count: 89 },
  { id: "6", name: "Jouets", icon: "Gamepad2", count: 156 },
  { id: "7", name: "Musique", icon: "Music", count: 78 },
  { id: "8", name: "Jardin", icon: "Flower2", count: 92 },
];

export const mockItems = [];

export const mockExchanges = [];

export const mockMessages = [];

export const mockAdminStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalItems: 3421,
  activeItems: 2156,
  totalExchanges: 834,
  completedExchanges: 721,
};

export const mockUsers = [
  {
    id: "1",
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    city: "Paris",
    status: "active",
    role: "user",
    trustScore: 4.8,
    exchanges: 24,
    joinedAt: "2025-08-15",
  },
  {
    id: "2",
    name: "Marc Dupont",
    email: "marc.dupont@example.com",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop",
    city: "Lyon",
    status: "active",
    role: "user",
    trustScore: 4.7,
    exchanges: 18,
    joinedAt: "2025-09-20",
  },
  {
    id: "3",
    name: "Julie Bernard",
    email: "julie.bernard@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    city: "Marseille",
    status: "suspended",
    role: "user",
    trustScore: 3.2,
    exchanges: 12,
    joinedAt: "2025-10-05",
  },
  {
    id: "4",
    name: "Admin System",
    email: "admin@trocplateforme.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    city: "Paris",
    status: "active",
    role: "admin",
    trustScore: 5.0,
    exchanges: 0,
    joinedAt: "2025-01-01",
  },
];
