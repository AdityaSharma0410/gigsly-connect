import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface ServiceCardProps {
  title: string;
  icon: LucideIcon;
  image: string;
  description: string;
}

const ServiceCard = ({ title, icon: Icon, image, description }: ServiceCardProps) => {
  return (
    <Card className="group glass-card hover-scale cursor-pointer overflow-hidden border-0">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <Icon className="h-8 w-8 mb-2" />
          <h3 className="font-bold text-xl">{title}</h3>
        </div>
      </div>
      <CardContent className="p-6">
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
