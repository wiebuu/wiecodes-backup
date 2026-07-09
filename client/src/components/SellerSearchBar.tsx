
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SellerSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SellerSearchBar: React.FC<SellerSearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search my templates..." 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input 
        placeholder={placeholder}
        className="pl-10 bg-white border-border/50 focus:bg-white transition-all duration-300 hover:shadow-md focus:shadow-lg"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default SellerSearchBar;
