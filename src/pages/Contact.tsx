import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    queryType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.email || !formData.queryType || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill all fields before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post("/contact-queries", {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        queryType: formData.queryType,
        message: formData.message,
      });
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you soon.",
      });
      setFormData({
        name: "",
        mobile: "",
        email: "",
        queryType: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="glass-card border-0 hover-scale animate-fade-in">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground">support@gigsly.in</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 hover-scale animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Phone className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground">+91 1800-123-4567</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 hover-scale animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <MapPin className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-sm text-muted-foreground">Mumbai, India</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card border-0 animate-scale-in">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="queryType">Type of Query</Label>
                  <Select value={formData.queryType} onValueChange={(value) => setFormData({ ...formData, queryType: value })}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select query type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-background/50 resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
