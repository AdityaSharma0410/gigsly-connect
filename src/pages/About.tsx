import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, DollarSign, Star, Target, Eye, Heart, Award, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bhavdeepImage from "@/assets/bhv.jpg";
import shlaishaImage from "@/assets/shl.jpg";
import adityaImage from "@/assets/adi2.png";

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: "Happy Customers", value: "50,000+", color: "text-primary" },
    { icon: Briefcase, label: "Completed Projects", value: "100,000+", color: "text-secondary" },
    { icon: DollarSign, label: "Total Earnings", value: "₹50Cr+", color: "text-accent" },
    { icon: Star, label: "Average Rating", value: "4.8/5", color: "text-accent" }
  ];

  const coreValues = [
    {
      icon: Heart,
      title: "Trust & Transparency",
      description: "We believe in building lasting relationships through honest communication and fair practices."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We're committed to delivering exceptional quality in every interaction and transaction."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly evolving our platform to meet the changing needs of India's workforce."
    },
    {
      icon: Shield,
      title: "Security",
      description: "Your data and transactions are protected with industry-leading security measures."
    }
  ];

  const journey = [
    { year: "2020", milestone: "Platform launched with 100 early adopters", description: "Started our journey to revolutionize freelancing in India" },
    { year: "2021", milestone: "Reached 10,000 active users", description: "Expanded to 50+ cities across India" },
    { year: "2022", milestone: "Processed ₹10 Cr in transactions", description: "Introduced AI-powered matching system" },
    { year: "2023", milestone: "Achieved 50,000+ professionals", description: "Launched mobile apps and enterprise solutions" },
    { year: "2024", milestone: "Leading gig platform in India", description: "Expanding to international markets" }
  ];

  const team = [
    {
      name: "Bhavdeep",
      role: "CEO & Founder",
      description: "Former tech executive with 15+ years experience in building scalable platforms.",
      image: bhavdeepImage
    },
    {
      name: "Shlaisha",
      role: "CTO",
      description: "Tech enthusiast with expertise in AI, ML, and building robust systems.",
      image: shlaishaImage
    },
    {
      name: "Aditya",
      role: "Head of Operations",
      description: "Operations expert ensuring smooth service delivery across all touchpoints.",
      image: adityaImage
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">Connecting India's</span>
            <br />
            Talent & Opportunity
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            Empowering professionals and businesses to achieve their goals through seamless collaboration
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={stat.label} 
                className="glass-card border-0 hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card border-0 hover-scale animate-fade-in">
              <CardContent className="p-10">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To create the most trusted and efficient platform that empowers Indian professionals 
                  to monetize their skills while helping businesses find exceptional talent without barriers.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 hover-scale animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-10">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To become the leading gig economy platform in India, recognized for our innovation, 
                  integrity, and impact on millions of lives across the nation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <Card 
                key={value.title} 
                className="glass-card border-0 hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 animate-fade-in">Our Journey</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {journey.map((item, index) => (
              <div 
                key={item.year} 
                className="flex gap-8 items-start animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-3xl font-bold gradient-text">{item.year}</span>
                </div>
                <div className="flex-grow glass-card p-6 rounded-xl border-0">
                  <h3 className="text-xl font-bold mb-2">{item.milestone}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 animate-fade-in">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground text-center mb-12 animate-fade-in">
            The minds behind Gigsly's success
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card 
                key={member.name} 
                className="glass-card border-0 hover-scale animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="glass-card border-0 overflow-hidden">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Have questions or want to learn more? We'd love to hear from you.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate("/contact")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
              >
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
