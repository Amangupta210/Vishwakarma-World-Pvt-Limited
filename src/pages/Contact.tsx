import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle
} from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    mobile: "",
    email: "",
    productRequired: "",
    quantity: "",
    deliveryType: "",
    location: "",
    paymentPreference: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Construct WhatsApp message
    const message = `*New Coal Supply Inquiry*%0A%0A*Company:* ${encodeURIComponent(formData.companyName)}%0A*Contact:* ${encodeURIComponent(formData.contactPerson)}%0A*Mobile:* ${encodeURIComponent(formData.mobile)}%0A*Email:* ${encodeURIComponent(formData.email)}%0A*Product:* ${encodeURIComponent(formData.productRequired)}%0A*Quantity:* ${encodeURIComponent(formData.quantity)} MT%0A*Delivery:* ${encodeURIComponent(formData.deliveryType)}%0A*Location:* ${encodeURIComponent(formData.location)}%0A*Payment:* ${encodeURIComponent(formData.paymentPreference)}%0A%0A*Message:* ${encodeURIComponent(formData.message)}`;

    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/919119191339?text=${message}`, "_blank");

    toast({
      title: "Inquiry Submitted!",
      description: "We've opened WhatsApp with your inquiry details. Our team will respond shortly.",
    });

    setIsSubmitting(false);
    setFormData({
      companyName: "",
      contactPerson: "",
      mobile: "",
      email: "",
      productRequired: "",
      quantity: "",
      deliveryType: "",
      location: "",
      paymentPreference: "",
      message: "",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block px-4 py-2 bg-secondary/15 border border-secondary/25 rounded-full text-secondary text-sm font-semibold">
              Get in Touch
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              Request Coal Supply or{" "}
              <span className="text-gradient-accent">Get a Quote</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Fill out the inquiry form below or contact us directly. Our team responds within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold mb-6 text-foreground">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Reach out to us through any of these channels. We're here to help with your coal supply needs.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="mailto:nitinsehra1946@gmail.com"
                  className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-secondary/40 transition-colors hover-lift"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">Email Us</h3>
                    <p className="text-muted-foreground">nitinsehra1946@gmail.com</p>
                  </div>
                </a>

                <a
                  href="tel:+919119191339"
                  className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-secondary/40 transition-colors hover-lift"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">Call Us</h3>
                    <p className="text-muted-foreground">+91 91191 91339</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/919119191339"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-[#25D366]/40 transition-colors hover-lift"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">WhatsApp</h3>
                    <p className="text-muted-foreground">Chat with us instantly</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">Company</h3>
                    <p className="text-muted-foreground">Vishwakarma World Private Limited</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">Operations</h3>
                    <p className="text-muted-foreground">24/7 Support Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-2">
              <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
                <h2 className="font-heading text-2xl font-bold mb-6 text-foreground">Coal Supply Inquiry Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Company Name *</label>
                      <Input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Your company name"
                        required
                        className="bg-muted border-border focus:border-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Contact Person *</label>
                      <Input
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="bg-muted border-border focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Mobile Number *</label>
                      <Input
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        required
                        className="bg-muted border-border focus:border-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="bg-muted border-border focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Product Required *</label>
                      <select
                        name="productRequired"
                        value={formData.productRequired}
                        onChange={handleChange}
                        required
                        className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                      >
                        <option value="">Select product</option>
                        <option value="Domestic Coal">Domestic Coal</option>
                        <option value="Imported Coal - Indonesia">Imported Coal - Indonesia</option>
                        <option value="Imported Coal - South Africa">Imported Coal - South Africa</option>
                        <option value="Imported Coal - USA">Imported Coal - USA</option>
                        <option value="Imported Coal - Russia">Imported Coal - Russia</option>
                        <option value="Imported Coal - Other">Imported Coal - Other</option>
                        <option value="Steam Coal">Steam Coal</option>
                        <option value="ROM Coal">ROM Coal</option>
                        <option value="Washed Coal">Washed Coal</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Quantity (MT) *</label>
                      <Input
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="e.g., 10000"
                        required
                        className="bg-muted border-border focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Delivery Type</label>
                      <select
                        name="deliveryType"
                        value={formData.deliveryType}
                        onChange={handleChange}
                        className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                      >
                        <option value="">Select delivery type</option>
                        <option value="Rail">Rail</option>
                        <option value="Road">Road</option>
                        <option value="Port Pickup">Port Pickup</option>
                        <option value="Ex-Mine">Ex-Mine</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Delivery Location *</label>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, State"
                        required
                        className="bg-muted border-border focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Payment Preference</label>
                    <select
                      name="paymentPreference"
                      value={formData.paymentPreference}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                    >
                      <option value="">Select payment preference</option>
                      <option value="Advance">Advance</option>
                      <option value="LC (Letter of Credit)">LC (Letter of Credit)</option>
                      <option value="Credit (15 Days)">Credit (15 Days)</option>
                      <option value="Credit (30 Days)">Credit (30 Days)</option>
                      <option value="To Discuss">To Discuss</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Additional Requirements</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your specific requirements, quality specifications, delivery schedule, etc."
                      rows={4}
                      className="bg-muted border-border focus:border-secondary"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit Inquiry
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    By submitting this form, your inquiry will be sent via WhatsApp for faster response.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
