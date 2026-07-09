import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Search, User } from "lucide-react";

import ReviewRequestsList from "./components/ReviewRequestsList";
import PublishedTemplatesTable from "./components/PublishedTemplatesTable";
import MetricsSummary from "./components/MetricsSummary";
import RecentActivityFeed from "./components/RecentActivityFeed";
import UserManagement from "./components/UserManagement";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import SystemSettings from "./components/SystemSettings";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CompetitionsManager from "./components/CompetitionsManager";

// 2️⃣ Update your TABS array to include competitions
const TABS = [
  { key: "overview", label: "Overview" },
  { key: "analytics", label: "Analytics" },
  { key: "reviews", label: "Review Requests" },
  { key: "templates", label: "Templates" },
  { key: "users", label: "Users" },
  { key: "competitions", label: "Competitions" }, // ✅ New tab
  { key: "settings", label: "Settings" },
];

const AdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [theme, setTheme] = useState<"Light" | "Dark">("Light");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState([]);

  const { token, user } = useAuth(); // ✅ Get user info
  const navigate = useNavigate();



  const toggleTheme = () => {
    setTheme((prev) => (prev === "Dark" ? "Light" : "Dark"));
    document.documentElement.classList.toggle("Dark");
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!searchQuery.trim()) return setSearchResults([]);

      const token = localStorage.getItem("token");

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/search?q=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const results = [];
          if (data.templates) {
            results.push(...data.templates.map((t) => ({ ...t, type: "template" })));
          }
          if (data.users) {
            results.push(...data.users.map((u) => ({ ...u, type: "user" })));
          }
          setSearchResults(results);
        })
        .catch((err) => console.error("Search error:", err));
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <div className={`${theme === "Dark" ? "dark bg-background" : "bg-background"} min-h-screen`}>
      <header className="sticky top-0 z-40 bg-white dark:bg-background border-b border-border/50 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black tracking-tight text-primary flex items-center gap-2">
              <span className="uppercase">WIECODES</span>
              <Badge variant="destructive" className="ml-1 text-xs tracking-wide">Admin</Badge>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-fit relative">
            <div className="relative w-full sm:w-96">
              {/* Search Bar */}
              <div className="relative">
                  <Input
                    placeholder="Search templates or users..."
                    className="flex bg-accent rounded-md items-center px-3 py-1.5 shadow-sm border border-border focus-within:ring-2 ring-ring"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                {/* Dropdown */}
                {searchQuery.trim() && (
                  <div className="absolute inset-x-0 top-full mt-1 bg-popover border border-border rounded-b-md shadow-lg z-50 max-h-64 overflow-y-auto animate-in slide-in-from-top-1 fade-in">
                    {searchResults.length > 0 ? (
                      searchResults.map((item, idx) => (
                        <Link
                          key={idx}
                          to={
                            item.type === "template"
                              ? `/admin/template/${item._id}`
                              : `/admin/users/${item._id}`
                          }
                          className="flex items-center justify-between px-4 py-2 hover:bg-muted/60 text-sm text-foreground transition-colors"
                        >
                          <span className="truncate">
                            {item.type === "template" ? item.title : item.email}
                          </span>
                          <span
                            className={`ml-2 px-2 py-0.5 text-xs rounded-md whitespace-nowrap ${item.type === "template"
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary text-muted-foreground"
                              }`}
                          >
                            {item.type === "template" ? "Template" : "User"}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>




            <Link to="/seller/profile">
              <Button variant="ghost" size="icon" aria-label="Profile">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle Dark/Light"
            >
              {theme === "Dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <nav className="container mx-auto px-4 mt-8 mb-5">
        <div className="flex bg-secondary/70 p-1.5 rounded-lg overflow-x-auto w-fit">
          {TABS.map((t) => (
            <Button
              key={t.key}
              variant={activeTab === t.key ? "default" : "ghost"}
              className="px-6 capitalize whitespace-nowrap"
              onClick={() => setSearchParams({ tab: t.key })}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </nav>

      <main className="container mx-auto px-4 pb-16 relative">
  {activeTab === "overview" && (
    <div className="space-y-8">
      <MetricsSummary />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="max-h-[500px] overflow-y-auto rounded-md">
          <RecentActivityFeed />
        </div>
        <div className="max-h-[500px] overflow-y-auto rounded-md overflow-x-auto">
          <UserManagement />
        </div>
      </div>
    </div>
  )}

  {activeTab === "analytics" && (
    <section className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
      <AnalyticsDashboard />
    </section>
  )}

  {activeTab === "reviews" && (
    <section className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Template Review Requests</h2>
      <ReviewRequestsList />
    </section>
  )}

  {activeTab === "templates" && (
    <section className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Published Templates</h2>
      <PublishedTemplatesTable />
    </section>
  )}

  {activeTab === "users" && (
    <section className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
      <UserManagement />
    </section>
  )}

  {activeTab === "competitions" && ( // ✅ New section
    <section className="space-y-6 animate-fade-in">
      <CompetitionsManager />
    </section>
  )}

  {activeTab === "settings" && (
    <section className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
      <SystemSettings />
    </section>
  )}
</main>
    </div>
  );
};

export default AdminDashboard;
