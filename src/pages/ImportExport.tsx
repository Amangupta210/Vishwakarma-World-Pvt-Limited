import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Ship, Anchor, CheckCircle2, ArrowRight } from "lucide-react";
import portImage from "@/assets/port-operations.jpg";

const importCountries = [
  {
    name: "Indonesia",
    description: "Economical, low ash coal with reliable supply",
    features: ["Low ash content", "Competitive pricing", "High volume availability"],
  },
  {
    name: "USA",
    description: "High-grade thermal coal for premium applications",
    features: ["High GCV", "Low moisture", "Consistent quality"],
  },
  {
    name: "South Africa",
    description: "Premium high GCV coal for power generation",
    features: ["High calorific value", "Low sulfur", "Reliable supply chain"],
  },
  {
    name: "Russia",
    description: "Strategic source for quality thermal coal",
    features: ["Competitive rates", "High quality", "Large volume capacity"],
  },
  {
    name: "Kazakhstan",
    description: "Quality coal with excellent specifications",
    features: ["High GCV", "Low ash", "Cost-effective"],
  },
  {
    name: "Colombia",
    description: "Premium quality coal for industrial use",
    features: ["High calorific value", "Low sulfur content", "Consistent supply"],
  },
];

const indianPorts = {
  "West Bengal": ["Haldia Port", "Shyama Prasad Mukherjee Port"],
  "Odisha": ["Paradip Port", "Dhamra Port", "Gopalpur Port"],
  "Andhra Pradesh": ["Vishakhapatnam Port", "Krishnapatnam Port", "Gangavaram Port", "Kakinada Port"],
  "Tamil Nadu": ["Kamarajar Port", "V.O Chidambaram Port", "Kattupalli Port", "Ennore Port"],
  "Kerala": ["Cochin Port", "Vizhinjam Port"],
  "Karnataka": ["New Mangalore Port"],
  "Goa": ["Mormugao Port"],
  "Maharashtra": ["Jawaharlal Nehru Port (JNPT)", "Mumbai Port", "Dighi Port"],
  "Gujarat": ["Mundra Port", "Kandla Port", "Hazira Port", "Dahej Port", "Pipavav Port"],
};

const ImportExport = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={portImage}
            alt="Port operations"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block px-4 py-2 bg-secondary/15 border border-secondary/25 rounded-full text-secondary text-sm font-semibold">
              Global Coal Trade
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              Import & Export{" "}
              <span className="text-gradient-accent">Operations</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Premium coal imports from 6 countries with comprehensive port-to-plant delivery across India's major ports.
            </p>
          </div>
        </div>
      </section>

      {/* Import Countries */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-semibold">Import Sources</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-4 text-foreground">
              Coal Imports from 6 Strategic Markets
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              We source coal from the world's leading exporters, ensuring quality, competitive pricing, and reliable supply.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {importCountries.map((country, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border border-border hover:border-secondary/40 transition-all duration-300 group hover-lift"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Globe className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground">{country.name}</h3>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{country.description}</p>
                <ul className="space-y-2">
                  {country.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Indian Ports */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-semibold">Port Network</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-4 text-foreground">
              Pan-India Port Coverage
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              We operate across all major Indian ports, ensuring efficient coal handling and inland distribution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(indianPorts).map(([state, ports], index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border border-border hover-lift"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Anchor className="h-5 w-5 text-secondary" />
                  <h3 className="font-heading font-bold text-foreground">{state}</h3>
                </div>
                <ul className="space-y-2">
                  {ports.map((port, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Ship className="h-3 w-3 text-secondary/70" />
                      {port}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-semibold">Import Process</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-4 text-foreground">
              Seamless Port-to-Plant Delivery
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Sourcing", desc: "Select optimal source based on requirements" },
                { step: "02", title: "Shipping", desc: "Charter vessels and manage sea freight" },
                { step: "03", title: "Port Handling", desc: "Customs clearance and port operations" },
                { step: "04", title: "Delivery", desc: "Rail/road transport to your plant" },
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-heading font-bold text-xl mx-auto mb-4 shadow-button group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <h3 className="font-heading font-bold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Included */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-secondary font-semibold">Full-Service Import</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Everything Handled. Nothing Left to Chance.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our comprehensive import service includes every aspect of international coal trade, from sourcing to final delivery.
              </p>

              <div className="space-y-3">
                {[
                  "International sourcing & negotiation",
                  "Vessel chartering & freight management",
                  "Quality inspection at source",
                  "Customs clearance & documentation",
                  "Port handling & storage",
                  "Inland transportation (rail/road)",
                  "Real-time shipment tracking",
                  "Dedicated account management",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-secondary/30 transition-colors"
                  >
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={portImage}
                alt="Port operations"
                className="w-full h-full object-cover min-h-[450px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-xl font-heading font-bold text-foreground">
                  15+ Ports Covered
                </p>
                <p className="text-muted-foreground">
                  Complete pan-India coverage
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Need Imported Coal?
            </h2>
            <p className="text-xl text-muted-foreground">
              Get competitive quotes for high-quality imported coal from our global sourcing network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Get Import Quote
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="mailto:nitinsehra1946@gmail.com">
                  Email Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ImportExport;
