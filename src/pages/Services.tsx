import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Factory, 
  Ship, 
  Truck, 
  Shield, 
  FileCheck, 
  Clock,
  ArrowRight,
  CheckCircle2,
  Train,
  MapPin
} from "lucide-react";
import railImage from "@/assets/rail-logistics.jpg";

const services = [
  {
    icon: Factory,
    title: "Domestic Coal Supply",
    description: "Direct sourcing from Coal India subsidiaries with pan-India supply coverage.",
    features: [
      "Coal India subsidiary sourcing",
      "Grades G1–G17 available",
      "Steam Coal, ROM Coal, Washed Coal",
      "Pan-India supply network",
      "Multiple state coverage",
    ],
  },
  {
    icon: Ship,
    title: "Imported Coal Supply",
    description: "Premium quality coal from strategic international sources with port-to-plant delivery.",
    features: [
      "Indonesia – Economical, low ash coal",
      "USA – High-grade thermal coal",
      "South Africa – High GCV coal",
      "Russia & Kazakhstan – Strategic sources",
      "Colombia – Premium quality",
      "Customs clearance handled",
    ],
  },
  {
    icon: Truck,
    title: "Logistics Management",
    description: "Complete end-to-end logistics with rail, road, and port operations.",
    features: [
      "Rail logistics (rake handling & monitoring)",
      "Road logistics (GPS-tracked fleet)",
      "Port operations & transshipment",
      "Real-time tracking & updates",
      "Optimized route planning",
    ],
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Multi-point quality testing ensuring you receive exactly what you ordered.",
    features: [
      "Sampling at mine, transit & plant",
      "GCV (Gross Calorific Value) testing",
      "Ash, Moisture & VM analysis",
      "Zero tolerance for adulteration",
      "Third-party verification available",
    ],
  },
  {
    icon: FileCheck,
    title: "Contract & Long-Term Supply",
    description: "Flexible contract options designed for industrial continuity.",
    features: [
      "Industrial linkage-style supply",
      "Monthly / Yearly contracts",
      "Power & non-power industries",
      "Volume-based pricing",
      "Guaranteed supply commitments",
    ],
  },
  {
    icon: Clock,
    title: "24/7 Operations Support",
    description: "Round-the-clock support ensuring your operations never stop.",
    features: [
      "Dedicated relationship managers",
      "Real-time shipment tracking",
      "Emergency supply arrangements",
      "Documentation support",
      "Regulatory compliance assistance",
    ],
  },
];

const coalGrades = [
  { grade: "G1-G4", gcv: ">6200", use: "Power Plants, Steel" },
  { grade: "G5-G8", gcv: "5200-6200", use: "Power Plants, Cement" },
  { grade: "G9-G12", gcv: "4200-5200", use: "Cement, Brick Kilns" },
  { grade: "G13-G17", gcv: "<4200", use: "Industrial Use" },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block px-4 py-2 bg-secondary/15 border border-secondary/25 rounded-full text-secondary text-sm font-semibold">
              Our Services
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              Complete Coal Supply &{" "}
              <span className="text-gradient-accent">Logistics Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From sourcing to delivery, we manage the entire coal supply chain with precision, quality, and reliability. One partner for all your coal needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border border-border hover:border-secondary/40 transition-all duration-300 group hover-lift"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                  <service.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coal Grades Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-semibold">Coal Grades</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-4 text-foreground">
              Wide Range of Coal Grades Available
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              From high-GCV premium coal to industrial-grade supplies, we source the right grade for your specific needs.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
              <div className="grid grid-cols-3 gap-4 p-5 bg-muted/50 font-heading font-bold text-sm text-foreground">
                <div>Grade</div>
                <div>GCV (kcal/kg)</div>
                <div>Primary Use</div>
              </div>
              {coalGrades.map((coal, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 p-5 border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="font-semibold text-secondary">{coal.grade}</div>
                  <div className="text-muted-foreground">{coal.gcv}</div>
                  <div className="text-muted-foreground">{coal.use}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logistics Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-secondary font-semibold">Logistics Excellence</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                End-to-End Logistics Management
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our integrated logistics network ensures your coal reaches the plant on time, every time. From rake booking to last-mile delivery, we handle it all.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border hover-lift">
                  <Train className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-heading font-bold text-foreground">Rail Logistics</h4>
                    <p className="text-sm text-muted-foreground">Rake handling, monitoring, and coordination with railways</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border hover-lift">
                  <Truck className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-heading font-bold text-foreground">Road Transport</h4>
                    <p className="text-sm text-muted-foreground">GPS-tracked fleet for transparent, timely deliveries</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border hover-lift">
                  <MapPin className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-heading font-bold text-foreground">Port Operations</h4>
                    <p className="text-sm text-muted-foreground">Transshipment, handling, and storage at major ports</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={railImage}
                alt="Rail logistics"
                className="w-full h-[450px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Need a Customized Solution?
            </h2>
            <p className="text-xl text-muted-foreground">
              Every industry has unique requirements. Let's discuss how we can tailor our services to meet your specific coal supply needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Request a Quote
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

export default Services;
