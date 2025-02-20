import { Calendar } from "lucide-react";
interface DevotionalCardProps {
  verse: string;
  reference: string;
  reflection: string;
  date: string;
}
const DevotionalCard = ({
  verse,
  reference,
  reflection,
  date
}: DevotionalCardProps) => {
  return <div className="faith-card">
      <div className="flex items-center justify-between mb-4">
        
        
      </div>
      <blockquote className="text-lg font-medium text-foreground mb-2">
        "{verse}"
      </blockquote>
      <p className="text-sm text-accent mb-4">{reference}</p>
      <p className="text-sm text-muted-foreground">{reflection}</p>
    </div>;
};
export default DevotionalCard;