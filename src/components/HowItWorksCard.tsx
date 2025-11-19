import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HowItWorksCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  buttonLink: string;
  index: number;
}

const HowItWorksCard = ({ 
  title, 
  description, 
  icon: Icon, 
  buttonText, 
  buttonLink,
  index 
}: HowItWorksCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="glass-card border-0 animate-fade-in hover-scale"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-6 min-h-[60px]">{description}</p>
        <Button 
          onClick={() => navigate(buttonLink)}
          variant="outline"
          className="w-full hover:bg-primary/10 border-primary/20"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HowItWorksCard;
