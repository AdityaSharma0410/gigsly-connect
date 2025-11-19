import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ReviewCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
}

const ReviewCard = ({ name, role, content, rating, initials }: ReviewCardProps) => {
  return (
    <Card className="glass-card border-0 hover-scale">
      <CardContent className="p-6">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "fill-accent text-accent" : "text-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-foreground/80 mb-6 italic">"{content}"</p>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
