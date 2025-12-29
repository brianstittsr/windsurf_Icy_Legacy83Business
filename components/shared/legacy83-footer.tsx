import Link from "next/link";
import Image from "next/image";
import { Linkedin, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  services: [
    { title: "Strategic Planning", href: "/services/strategic-planning" },
    { title: "Leadership Coaching", href: "/services/leadership-coaching" },
    { title: "Operational Excellence", href: "/services/operational-excellence" },
    { title: "Legacy Transition", href: "/services/legacy-transition" },
    { title: "The G.R.O.W.S. Framework", href: "/services" },
  ],
  company: [
    { title: "About Icy Williams", href: "/about" },
    { title: "Success Stories", href: "/success-stories" },
    { title: "The Legacy Journal", href: "/legacy-journal" },
    { title: "Events & Community", href: "/events" },
    { title: "Contact", href: "/contact" },
  ],
  resources: [
    { title: "Legacy Growth IQ™ Quiz", href: "/quiz-intro" },
    { title: "Schedule a Call", href: "/schedule-a-call" },
    { title: "FAQ", href: "/faq" },
    { title: "Free Resources", href: "/resources" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Accessibility", href: "/accessibility" },
  ],
};

export function Legacy83Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/legacy83Logo.webp"
                alt="Legacy 83 Business Inc"
                width={160}
                height={53}
                className="h-11 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Empowering business leaders to build wealth, inspire teams, and leave lasting legacies.
            </p>
            <div className="flex gap-4">
              <Link href="https://linkedin.com/company/legacy83business" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://facebook.com/legacy83business" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com/legacy83business" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-amber-400">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-amber-400">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-amber-400">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-amber-400">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>4724 Vine Street<br />Cincinnati, OH 45217</span>
              </li>
              <li>
                <Link href="mailto:info@legacy83business.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                  info@legacy83business.com
                </Link>
              </li>
              <li>
                <Link href="tel:+15133351978" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                  (513) 335-1978
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Legacy 83 Business. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
