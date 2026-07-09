
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Store } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

const RoleSwitcher = () => {
  const { role, setRole, isSeller } = useRole();

  const handleRoleSwitch = () => {
    setRole(isSeller ? 'buyer' : 'seller');
  };

  return (
    <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-border/20">
      <Button
        onClick={() => setRole('buyer')}
        variant={!isSeller ? "default" : "ghost"}
        size="sm"
        className={`rounded-full transition-all duration-300 ${!isSeller ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100'}`}
      >
        <User className="w-4 h-4 mr-2" />
        Buyer
      </Button>
      
      <div className="w-px h-6 bg-border/30"></div>
      
      <Button
        onClick={() => setRole('seller')}
        variant={isSeller ? "default" : "ghost"}
        size="sm"
        className={`rounded-full transition-all duration-300 ${isSeller ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100'}`}
      >
        <Store className="w-4 h-4 mr-2" />
        Seller
      </Button>
    </div>
  );
};

export default RoleSwitcher;
