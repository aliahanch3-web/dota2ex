import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="جستجوی هیرو..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-secondary border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground h-12 text-base"
      />
    </div>
  );
};
