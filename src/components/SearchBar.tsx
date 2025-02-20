import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}
const SearchBar = ({
  value,
  onChange
}: SearchBarProps) => {
  return <div className="relative">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="relative">
          
          
        </div>
      </div>
    </div>;
};
export default SearchBar;