import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import CreatePostDialog from "./CreatePostDialog";
interface CommunityHeaderProps {
  onCreatePost: (title: string, content: string, files: File[]) => Promise<void>;
}
const CommunityHeader = ({
  onCreatePost
}: CommunityHeaderProps) => {
  return <section className="max-w-4xl mx-auto text-center mb-12 animate-fade-in bg-zinc-50">
      {/* Logo placement - Replace src with your actual logo path */}
      <img alt="Adventist Connect Logo" className="w-24 h-24 mx-auto mb-4" src="/lovable-uploads/1db8b74d-5f2a-4fc9-9966-ee4ad52f324f.png" />
      
      <h1 className="text-4xl font-bold mb-4">
        Community
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Share your faith journey and connect with fellow believers
      </p>
      <CreatePostDialog onCreatePost={onCreatePost} />
    </section>;
};
export default CommunityHeader;