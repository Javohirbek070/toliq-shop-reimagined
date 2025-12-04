import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Crown, Shield, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user' | 'owner';
  full_name?: string;
}

export default function Users() {
  const { toast } = useToast();
  const { isOwner } = useAuth();
  const [users, setUsers] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "user">("admin");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    
    // First get all user roles
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("id, user_id, role");

    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
      setIsLoading(false);
      return;
    }

    if (!roles || roles.length === 0) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    // Get profiles for these users
    const userIds = roles.map(r => r.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    // Merge the data
    const usersWithNames: UserRole[] = roles.map((role) => {
      const profile = profiles?.find(p => p.user_id === role.user_id);
      return {
        id: role.id,
        user_id: role.user_id,
        role: role.role as 'admin' | 'user' | 'owner',
        full_name: profile?.full_name || undefined,
      };
    });

    setUsers(usersWithNames);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUserById = async () => {
    if (!newUserId.trim()) {
      toast({
        title: "Xatolik",
        description: "User ID kiritilishi shart",
        variant: "destructive",
      });
      return;
    }

    // Check if user already has this role
    const existingRole = users.find(u => u.user_id === newUserId.trim());
    if (existingRole) {
      toast({
        title: "Xatolik",
        description: "Bu foydalanuvchi allaqachon rolga ega",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: newUserId.trim(), role: newUserRole });

    if (error) {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Muvaffaqiyat",
      description: "Foydalanuvchi qo'shildi",
    });
    setIsAddDialogOpen(false);
    setNewUserId("");
    fetchUsers();
  };

  const handleDeleteRole = async () => {
    if (!deleteUserId) return;

    const userToDelete = users.find(u => u.id === deleteUserId);
    if (userToDelete?.role === 'owner') {
      toast({
        title: "Xatolik",
        description: "Owner rolini o'chirib bo'lmaydi",
        variant: "destructive",
      });
      setDeleteUserId(null);
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", deleteUserId);

    if (error) {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Muvaffaqiyat",
        description: "Rol o'chirildi",
      });
      fetchUsers();
    }
    setDeleteUserId(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-amber-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'owner':
        return "bg-amber-500/20 text-amber-500 border-amber-500/30";
      case 'admin':
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Crown className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-display font-semibold mb-2">Ruxsat yo'q</h2>
          <p className="text-muted-foreground">
            Bu sahifaga faqat owner kirishi mumkin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Foydalanuvchilar</h1>
          <p className="text-muted-foreground">Adminlar va rollarni boshqaring</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Admin qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi admin qo'shish</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Foydalanuvchi ID</Label>
                <Input
                  placeholder="User ID kiriting"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Foydalanuvchi avval ro'yxatdan o'tgan bo'lishi kerak
                </p>
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as "admin" | "user")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="hero"
                className="w-full"
                onClick={handleAddUserById}
              >
                Qo'shish
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users List */}
      <div className="glass-card rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Yuklanmoqda...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Hech qanday foydalanuvchi topilmadi
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Foydalanuvchi</th>
                  <th className="text-left p-4 font-medium">Rol</th>
                  <th className="text-right p-4 font-medium">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name || 'Noma\'lum'}</p>
                          <p className="text-sm text-muted-foreground">{user.user_id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role === 'owner' ? 'Owner' : user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {user.role !== 'owner' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteUserId(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rolni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham bu foydalanuvchi rolini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
