import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Activity } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function RecentActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token, user } = useAuth(); // ✅ Get user info
  const navigate = useNavigate();


  // Helper function to extract email username
  const extractEmailUsername = (text) => {
    if (!text) return text;
    
    // Look for email patterns and replace them with just the username part
    return text.replace(/([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '$1');
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/activity`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success) {
          const processedActivities = data.activities.map(activity => ({
            ...activity,
            description: extractEmailUsername(activity.description),
          }));
          setActivities(processedActivities);
        }
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchActivities();
  }, []);
  

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 animate-spin" />
              Loading activity...
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-0">
            {activities.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start justify-between py-3 border-b border-border last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}