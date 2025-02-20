
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="relative px-4 py-2">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8 border-none bg-[#f8f9fa] focus-visible:ring-0"
        />
      </div>
    </div>
  );
};

export default SearchBar;
