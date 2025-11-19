import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import HowItWorksCard from "@/components/HowItWorksCard";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Code, Video, BookOpen, Laptop, PenTool, FileText, Search, UserPlus, CheckCircle, Briefcase, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import webdevImage from "@/assets/service-webdev.jpg";
import videoImage from "@/assets/service-video.jpg";
import tutoringImage from "@/assets/service-tutoring.jpg";
import softwareImage from "@/assets/service-software.jpg";
import writingImage from "@/assets/service-writing.jpg";

const Index = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Web Development",
      icon: Code,
      image: webdevImage,
      description: "Build stunning websites and web applications with expert developers"
    },
    {
      title: "Video Editing",
      icon: Video,
      image: videoImage,
      description: "Professional video editing services for all your content needs"
    },
    {
      title: "Tutoring",
      icon: BookOpen,
      image: tutoringImage,
      description: "Learn from experienced tutors across various subjects"
    },
    {
      title: "Software Development",
      icon: Laptop,
      image: softwareImage,
      description: "Custom software solutions tailored to your business needs"
    },
    {
      title: "Content Writing",
      icon: PenTool,
      image: writingImage,
      description: "Engaging content that resonates with your audience"
    }
  ];

  const hiringSteps = [
    {
      title: "Post a Task",
      description: "Describe your project and requirements in detail",
      icon: FileText,
      buttonText: "Get Started",
      buttonLink: "/post-task"
    },
    {
      title: "Browse Professionals",
      description: "Review profiles and portfolios of qualified freelancers",
      icon: Search,
      buttonText: "Browse Now",
      buttonLink: "/browse"
    },
    {
      title: "Get Proposals",
      description: "Receive competitive bids and choose the best fit",
      icon: CheckCircle,
      buttonText: "Learn More",
      buttonLink: "/how-it-works"
    }
  ];

  const workSteps = [
    {
      title: "Create Profile",
      description: "Showcase your skills and experience professionally",
      icon: UserPlus,
      buttonText: "Sign Up",
      buttonLink: "/signup"
    },
    {
      title: "Browse Tasks",
      description: "Find projects that match your expertise",
      icon: Search,
      buttonText: "Find Work",
      buttonLink: "/find-work"
    },
    {
      title: "Get Hired",
      description: "Submit proposals and start earning",
      icon: TrendingUp,
      buttonText: "Start Earning",
      buttonLink: "/signup"
    }
  ];

  const reviews = [
    {
      name: "Priya Sharma",
      role: "Startup Founder",
      content: "Found an amazing developer through Gigsly who built our entire platform. The quality exceeded our expectations!",
      rating: 5,
      initials: "PS"
    },
    {
      name: "Rahul Mehta",
      role: "Freelance Designer",
      content: "As a freelancer, Gigsly has been a game-changer. I've landed multiple high-quality projects and grown my business.",
      rating: 5,
      initials: "RM"
    },
    {
      name: "Anjali Reddy",
      role: "Marketing Manager",
      content: "The platform makes it so easy to find talented content writers. We've built a reliable team of professionals here.",
      rating: 5,
      initials: "AR"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Connect with top
                <span className="gradient-text"> professionals</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Discover talented freelancers for your projects or find exciting opportunities to showcase your skills. Join India's fastest-growing gig platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate("/browse")}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Hire Talent
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/signup")}
                  className="border-primary/20 hover:bg-primary/10"
                >
                  Find Work
                </Button>
              </div>
            </div>
            <div className="animate-scale-in">
              <img 
                src={heroImage} 
                alt="Professional workspace"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Popular Services</h2>
            <p className="text-xl text-muted-foreground">Explore top categories and find the perfect professional</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={service.title} style={{ animationDelay: `${index * 0.1}s` }}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Hiring */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground mb-8">Simple steps to get started</p>
          </div>
          
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-primary">For Hiring</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {hiringSteps.map((step, index) => (
                <HowItWorksCard key={step.title} {...step} index={index} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-center mb-8 text-secondary">For Finding Work</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {workSteps.map((step, index) => (
                <HowItWorksCard key={step.title} {...step} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground">Trusted by thousands across India</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div key={review.name} style={{ animationDelay: `${index * 0.15}s` }}>
                <ReviewCard {...review} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
