import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    username: "",
    role: "",
    status: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    twitter: "",
  });

  
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setForm({
            username: data.user.username || "",
            role: data.user.role || "buyer",
            status: data.user.status || "active",
            bio: data.user.bio || "",
            location: data.user.location || "",
            website: data.user.website || "",
            github: data.user.github || "",
            twitter: data.user.twitter || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    }
    fetchUser();
  }, [id, token]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("User updated successfully");
        setUser(data.user);
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    }
  };

  if (!user) return <p className="p-6">Loading user...</p>;

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate("/admin?tab=users")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit User: {user.username}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* SYSTEM INFO */}
          <div>
            <h2 className="text-lg font-semibold mb-2">System Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">User ID</label>
                <Input value={user._id} disabled />
              </div>
              <div>
                <label className="text-sm">Firebase UID</label>
                <Input value={user.firebaseUid || "—"} disabled />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <Input value={user.email} disabled />
              </div>
              <div>
                <label className="text-sm">Password (Hashed)</label>
                <Input value={user.password || "—"} disabled />
              </div>
              <div>
                <label className="text-sm">Created At</label>
                <Input value={new Date(user.createdAt).toLocaleString()} disabled />
              </div>
              <div>
                <label className="text-sm">Updated At</label>
                <Input value={new Date(user.updatedAt).toLocaleString()} disabled />
              </div>
            </div>
          </div>

          {/* EDITABLE FIELDS */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Editable Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Username</label>
                <Input name="username" value={form.username} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="reviewer">Reviewer</option> 
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Bio</label>
                <Input name="bio" value={form.bio} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm">Location</label>
                <Input name="location" value={form.location} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm">Website</label>
                <Input name="website" value={form.website} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm">GitHub</label>
                <Input name="github" value={form.github} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm">Twitter</label>
                <Input name="twitter" value={form.twitter} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* USER STATS */}
          <div>
            <h2 className="text-lg font-semibold mb-2">User Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm">Earnings</label>
                <Input value={user.earnings} disabled />
              </div>
              <div>
                <label className="text-sm">Sales</label>
                <Input value={user.sales} disabled />
              </div>
              <div>
                <label className="text-sm">Free Templates</label>
                <Input value={user.freeTemplates} disabled />
              </div>
              <div>
                <label className="text-sm">Rating</label>
                <Input value={user.rating} disabled />
              </div>
              <div>
                <label className="text-sm">Review Count</label>
                <Input value={user.reviewCount} disabled />
              </div>
              <div>
                <label className="text-sm">Template Count</label>
                <Input value={user.templates?.length || 0} disabled />
              </div>
              <div>
                <label className="text-sm">Cart Items</label>
                <Input value={user.cart?.length || 0} disabled />
              </div>
            </div>
          </div>

          <Button className="mt-6 w-full" onClick={handleSave}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
