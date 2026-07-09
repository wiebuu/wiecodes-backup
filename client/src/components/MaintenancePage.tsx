import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-muted/10 px-6">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold text-primary mb-2">We’ll be back soon!</h1>
      <p className="text-muted-foreground max-w-xl mb-6">
        Our site is currently undergoing scheduled maintenance. We apologize for the inconvenience and appreciate your patience. Please check back later.
      </p>
      <Button onClick={() => window.location.reload()} variant="outline">
        Retry
      </Button>
    </div>
  );
};

export default MaintenancePage;
