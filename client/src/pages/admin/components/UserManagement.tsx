import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type UserType = {
  _id: string;
  username: string;
  email: string;
  role: string;
  status: "active" | "banned";
};

export default function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([]);

  const { token, user } = useAuth(); // ✅ Get user info
  const navigate = useNavigate();



  useEffect(() => {
    if (!token) return; // ⛔ don't fetch if token is not yet available
  
    async function fetchUsers() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUsers(data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
  
    fetchUsers();
  }, [token]);
  

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left font-semibold py-2">Name</th>
                <th className="text-left font-semibold py-2">Email</th>
                <th className="text-left font-semibold py-2">Role</th>
                <th className="text-left font-semibold py-2">Status</th>
                <th className="text-left font-semibold py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr className="border-b last:border-0" key={user._id}>
                  <td className="py-3">{user.username}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Badge variant={user.status === "banned" ? "destructive" : "outline"}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        (window.location.href = `/admin/users/${user._id}`)
                      }
                    >
                      <span className="flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        Edit
                      </span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
