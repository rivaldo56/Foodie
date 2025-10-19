import { ChefHat, Instagram, Facebook, Twitter, Mail } from "lucide-react";

const footerLinks = {
  "For Clients": [
    "Browse Chefs",
    "How It Works",
    "Pricing",
    "FAQ"
  ],
  "For Chefs": [
    "Become a Chef",
    "Chef Dashboard",
    "Resources",
    "Success Stories"
  ],
  "Company": [
    "About Us",
    "Careers",
    "Press",
    "Contact"
  ],
  "Legal": [
    "Privacy Policy",
    "Terms of Service",
    "Cookie Policy",
    "Trust & Safety"
  ]
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold">Foodie</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Connecting freelance chefs with food lovers for unforgettable culinary experiences.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            © 2025 Foodie. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
