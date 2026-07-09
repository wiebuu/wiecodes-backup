import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Add this
import { toast } from 'sonner'; // ✅ Updated
import { useParams, Link, useNavigate } from 'react-router-dom';

const categoryColors = {
  "E-commerce": "#8884d8",
  Portfolio: "#82ca9d",
  Dashboard: "#ffc658",
  "Landing Page": "#ff7300",
  Other: "#00ff00",
};

export default function AnalyticsDashboard() {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const { token, user } = useAuth(); // ✅ Get user info
  const navigate = useNavigate();


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`, // ✅ Send token in headers
        };

        const [monthlyRes, categoryRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/analytics/monthly-stats`, { headers }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/analytics/template-categories`, { headers }),
        ]);

        console.log("Monthly Stats:", monthlyRes.data);
        console.log("Category Stats:", categoryRes.data);

        setMonthlyData(Array.isArray(monthlyRes.data) ? monthlyRes.data : []);
        setCategoryData(Array.isArray(categoryRes.data) ? categoryRes.data : []);
      } catch (err) {
        console.error("Analytics fetching error:", err);
        setMonthlyData([]);
        setCategoryData([]);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]); // ✅ re-run when token is available

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Array.isArray(monthlyData) ? monthlyData : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={Array.isArray(monthlyData) ? monthlyData : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Template Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Array.isArray(categoryData) ? categoryData : []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {Array.isArray(categoryData) &&
                    categoryData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={categoryColors[entry.name] || "#ccc"}
                      />
                    ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Template Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Template Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Array.isArray(monthlyData) ? monthlyData : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="templates" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
