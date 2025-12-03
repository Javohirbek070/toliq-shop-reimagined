import { Phone, MapPin, Clock, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      value: "+998 90 123 45 67",
      link: "tel:+998901234567",
    },
    {
      icon: MapPin,
      title: "Manzil",
      value: "Toshkent, Chilonzor tumani, 1-mavze",
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Ish vaqti",
      value: "09:00 - 23:00 (Har kuni)",
      link: null,
    },
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Aloqa</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Biz Bilan Bog'laning
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Buyurtma berish yoki savollar uchun biz bilan bog'laning
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((item) => (
            <div
              key={item.title}
              className="glass-card rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              {item.link ? (
                <a
                  href={item.link}
                  target={item.link.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-muted-foreground">{item.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4">
          <Button variant="secondary" size="lg" asChild>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </a>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a
              href="https://t.me/saficafe"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="w-5 h-5" />
              Telegram
            </a>
          </Button>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 rounded-2xl overflow-hidden border border-border h-64 md:h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191885.50264869918!2d69.1393379!3d41.2824599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          />
        </div>
      </div>
    </section>
  );
}
