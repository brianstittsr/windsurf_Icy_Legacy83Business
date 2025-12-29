import { Legacy83Navbar } from "@/components/shared/legacy83-navbar";
import { Legacy83Footer } from "@/components/shared/legacy83-footer";

export default function Legacy83MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Legacy83Navbar />
      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        {children}
      </main>
      <Legacy83Footer />
    </div>
  );
}
