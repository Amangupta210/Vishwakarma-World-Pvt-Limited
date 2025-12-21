import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { 
  Truck, 
  Ship, 
  CheckCircle2, 
  Globe, 
  Shield, 
  ArrowRight,
  Factory,
  Zap
} from "lucide-react";
import heroImage from "@/assets/hero-coal-mine.jpg";
import portImage from "@/assets/port-operations.jpg";
import railImage from "@/assets/rail-logistics.jpg";

const stats = [
  { number: "10+", label: "Years Experience" },
  { number: "500+", label: "Industrial Clients" },
  { number: "50M+", label: "Tonnes Delivered" },
  { number: "24/7", label: "Operations" },
];

const services = [
  {
    icon: Factory,
    title: "Domestic Coal Supply",
    description: "Direct sourcing from Coal India subsidiaries. Grades G1-G17, Steam Coal, ROM Coal, Washed Coal.",
  },
  {
    icon: Ship,
    title: "Imported Coal Supply",
    description: "Premium coal from Indonesia, USA, South Africa, Russia, Kazakhstan & Colombia.",
  },
  {
    icon: Truck,
    title: "Logistics Management",
    description: "Rail logistics, GPS-tracked road fleet, port operations & transshipment handled end-to-end.",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Multi-point sampling, GCV, Ash, Moisture & VM testing. Zero tolerance for adulteration.",
  },
];

const whyChooseUs = [
  "Single-window coal supply solution",
  "Direct mine & import access",
  "Transparent pricing with no hidden costs",
  "Owned logistics execution",
  "Multi-point quality testing",
  "Dedicated relationship management",
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Coal mining operations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-4 opacity-0 animate-fade-in-up">
              <span className="inline-block px-4 py-2 bg-secondary/15 border border-secondary/25 rounded-full text-secondary text-sm font-semibold tracking-wide">
                Integrated Coal Supply Platform
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Integrated Coal Supply &{" "}
                <span className="text-gradient-accent">Logistics Platform</span>{" "}
                for India's Industries
              </h1>
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed opacity-0 animate-fade-in-up animation-delay-200">
              Reliable domestic & imported coal sourcing with end-to-end execution from mine to plant. 
              Powering power plants, cement, steel, and sponge iron industries across India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up animation-delay-300">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Request Coal Supply
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/contact">
                  Get a Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/80 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-heading font-bold text-secondary group-hover:scale-105 transition-transform">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground mt-2 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-semibold tracking-wide">Our Services</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-4 text-foreground">
              Complete Coal Supply & Logistics Solutions
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              From sourcing to delivery, we manage the entire coal supply chain with precision and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-card border border-border hover:border-secondary/40 transition-all duration-300 hover-lift"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                  <service.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">
                View All Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Import/Export Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-secondary font-semibold tracking-wide">Global Sourcing</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Premium Coal Imports from 6 Countries
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We source high-quality coal from strategic international markets, ensuring competitive pricing and consistent supply for your industrial needs.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {["Indonesia", "USA", "South Africa", "Russia", "Kazakhstan", "Colombia"].map(
                  (country) => (
                    <div
                      key={country}
                      className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-secondary/30 transition-colors"
                    >
                      <Globe className="h-5 w-5 text-secondary" />
                      <span className="font-medium text-foreground">{country}</span>
                    </div>
                  )
                )}
              </div>

              <Button variant="hero" size="lg" asChild>
                <Link to="/import-export">
                  Explore Import Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={portImage}
                alt="Port operations"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-xl font-heading font-bold text-foreground">
                  Port-to-Plant Delivery
                </p>
                <p className="text-muted-foreground mt-1">
                  All major Indian ports covered
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden order-2 lg:order-1 shadow-card">
              <img
                src={railImage}
                alt="Rail logistics"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-xl font-heading font-bold text-foreground">
                  End-to-End Logistics
                </p>
                <p className="text-muted-foreground mt-1">
                  Rail, road & port operations
                </p>
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <span className="text-secondary font-semibold tracking-wide">Why Choose Us</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                One Partner. End-to-End Responsibility.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We don't just sell coal. We take complete ownership of quality, delivery, and continuity of your production.
              </p>

              <div className="space-y-3">
                {whyChooseUs.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-secondary/30 transition-colors"
                  >
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="lg" asChild>
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-muted via-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/15 border border-secondary/25 rounded-full">
              <Zap className="h-4 w-4 text-secondary" />
              <span className="text-secondary font-semibold">Get Started Today</span>
            </div>
            
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
              Ready to Secure Your Coal Supply?
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Partner with India's trusted coal supply platform. Get competitive quotes for domestic and imported coal with guaranteed quality and timely delivery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Request Coal Supply
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="tel:+919119191339">
                  Call +91 91191 91339
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
