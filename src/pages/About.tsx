import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Target, 
  Eye, 
  Users, 
  Award, 
  TrendingUp, 
  Shield,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import heroImage from "@/assets/hero-coal-mine.jpg";

const values = [
  {
    icon: Shield,
    title: "Trust & Reliability",
    description: "We build long-term relationships based on consistent performance and transparent dealings.",
  },
  {
    icon: Award,
    title: "Quality First",
    description: "Zero tolerance for adulteration. Multi-point quality testing ensures you get what you pay for.",
  },
  {
    icon: TrendingUp,
    title: "Execution Excellence",
    description: "From sourcing to delivery, we execute with precision and take full ownership of the process.",
  },
  {
    icon: Users,
    title: "Client Partnership",
    description: "Dedicated relationship managers ensure your needs are understood and met consistently.",
  },
];

const milestones = [
  { year: "2015", title: "Company Founded", description: "Started operations with domestic coal supply" },
  { year: "2017", title: "Import Operations", description: "Expanded to imported coal from Indonesia" },
  { year: "2019", title: "Logistics Integration", description: "Launched owned logistics for end-to-end control" },
  { year: "2021", title: "Pan-India Presence", description: "Established supply network across all major industrial hubs" },
  { year: "2023", title: "Global Sourcing", description: "Added sourcing from 6 international markets" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Coal mining operations"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block px-4 py-2 bg-secondary/15 border border-secondary/25 rounded-full text-secondary text-sm font-semibold">
              About Vishwakarma World
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              Powering Industries.{" "}
              <span className="text-gradient-accent">Delivering Trust.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A full-stack coal supply and logistics company serving India's power and industrial sectors with unwavering commitment to quality and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-secondary font-semibold">Company Overview</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Full-Stack Coal Supply & Logistics Platform
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Vishwakarma World Private Limited is a full-stack coal supply and logistics company serving India's power and industrial sectors. We specialize in domestic coal sourcing, imported coal supply, and complete logistics execution—ensuring uninterrupted fuel availability for our clients.
                </p>
                <p className="text-xl font-heading font-semibold text-foreground">
                  We don't just sell coal. We take ownership of quality, delivery, and continuity of production.
                </p>
                <p>
                  Our integrated approach means you get a single partner for all your coal supply needs—from mine to plant. This reduces complexity, ensures accountability, and delivers peace of mind for your operations.
                </p>
              </div>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Partner With Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-card border border-border hover-lift">
                  <div className="text-4xl font-heading font-bold text-secondary">10+</div>
                  <div className="text-muted-foreground mt-1">Years Experience</div>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border hover-lift">
                  <div className="text-4xl font-heading font-bold text-secondary">500+</div>
                  <div className="text-muted-foreground mt-1">Industrial Clients</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="p-6 rounded-xl bg-card border border-border hover-lift">
                  <div className="text-4xl font-heading font-bold text-secondary">50M+</div>
                  <div className="text-muted-foreground mt-1">Tonnes Delivered</div>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border hover-lift">
                  <div className="text-4xl font-heading font-bold text-secondary">15+</div>
                  <div className="text-muted-foreground mt-1">Ports Covered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-foreground">Our Vision</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To become India's most trusted and globally connected coal supply platform, setting the benchmark for reliability, quality, and execution excellence in the energy sector.
              </p>
            </div>

            {/* Mission */}
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-foreground">Our Mission</h3>
              <ul className="space-y-3">
                {[
                  "Ensure uninterrupted, quality-assured coal supply",
                  "Reduce operational risk and cost for industries",
                  "Build a transparent mine-to-plant ecosystem",
                  "Deliver on commitments, every single time",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-semibold">Our Values</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-4 text-foreground">
              What Drives Us Every Day
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-secondary/40 transition-all duration-300 hover-lift"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-5">
                  <value.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-semibold">Our Journey</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-4 text-foreground">
              Building Trust Since 2015
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm shadow-button">
                      {milestone.year.slice(2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-3" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="text-secondary font-semibold">{milestone.year}</span>
                    <h3 className="font-heading font-bold text-lg mt-1 text-foreground">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Ready to Partner With Us?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join 500+ industries that trust Vishwakarma World for their coal supply needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Contact Us Today
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/services">
                  Explore Our Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
