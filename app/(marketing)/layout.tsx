import { Legacy83Navbar } from "@/components/shared/legacy83-navbar";
import { Legacy83Footer } from "@/components/shared/legacy83-footer";
import { ContactPopup } from "@/components/marketing/contact-popup";
import { EventCartProvider } from "@/contexts/event-cart-context";
import { CourseCartProvider } from "@/contexts/course-cart-context";
import { UserProfileProvider } from "@/contexts/user-profile-context";
import { CartProvider } from "@/lib/cart-context";
import { CourseCartDrawer } from "@/components/academy/course-cart-drawer";
import Script from "next/script";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProfileProvider>
      <CartProvider>
        <EventCartProvider>
          <CourseCartProvider>
            <div className="flex min-h-screen flex-col">
              <Script
                src="https://widgets.leadconnectorhq.com/loader.js"
                data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
                data-widget-id="6a4c60fddbe2962ef69213ba"
                data-source="WEB_USER"
                strategy="afterInteractive"
              />
              <Legacy83Navbar />
              {/* Main content landmark with skip link target - WCAG 2.4.1 */}
              <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
                {children}
              </main>
              <Legacy83Footer />
              <ContactPopup />
              <CourseCartDrawer />
            </div>
          </CourseCartProvider>
        </EventCartProvider>
      </CartProvider>
    </UserProfileProvider>
  );
}
