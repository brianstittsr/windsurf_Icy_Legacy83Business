import { Legacy83Navbar } from "@/components/shared/legacy83-navbar";
import { Legacy83Footer } from "@/components/shared/legacy83-footer";
import { ContactPopup } from "@/components/marketing/contact-popup";
import { EventCartProvider } from "@/contexts/event-cart-context";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EventCartProvider>
      <div className="flex min-h-screen flex-col">
        <Legacy83Navbar />
        {/* Main content landmark with skip link target - WCAG 2.4.1 */}
        <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
          {children}
        </main>
        <Legacy83Footer />
        <ContactPopup />
      </div>
    </EventCartProvider>
  );
}
