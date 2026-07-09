import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Add this
import { useNavigate } from "react-router-dom"; // ✅ Add this

type SystemSettingsType = {
  maintenanceMode: boolean;
};

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettingsType>({ maintenanceMode: false });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { token, user } = useAuth(); // ✅ Get user info
  const navigate = useNavigate();


  useEffect(() => {
    if (!token) {
      toast.error("Not authorized.");
      setLoading(false);
      return;
    }

    const fetchSetting = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin-settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 403) throw new Error("Forbidden");

        const data: SystemSettingsType = await res.json();
        setSettings({ maintenanceMode: data.maintenanceMode }); // ✅ Fix
      } catch (err) {
        toast.error("Failed to load setting");
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, [token]);

  const updateSetting = async (value: boolean) => {
    try {
      setUpdating(true);
      setSettings({ maintenanceMode: value });

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin-settings/maintenanceMode`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success(`Maintenance mode ${value ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error("Failed to update setting");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Maintenance Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">
                Only admins can access the site while this is on.
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={updateSetting}
              disabled={updating}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
