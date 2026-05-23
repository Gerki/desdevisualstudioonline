// app/(marketing)/page.tsx
// Marketing landing page

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Public landing page for visualgv.com
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">visualgv</h1>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6 py-20">
        <div className="max-w-2xl text-center space-y-6">
          <h2 className="text-5xl font-bold text-slate-900">
            Manage Your Advertising Campaigns
          </h2>
          <p className="text-xl text-slate-600">
            visualgv.com is the all-in-one platform for managing digital assets,
            physical advertising locations, and your entire operational workflow.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Multi-tenant Organizations",
                description: "Manage multiple organizations and campaigns",
              },
              {
                title: "Digital Asset Management",
                description: "Upload and organize your artwork and designs",
              },
              {
                title: "Physical Asset Tracking",
                description: "Track billboards, buses, screens, and more",
              },
              {
                title: "Real-time Collaboration",
                description: "Chat and approve files in real-time",
              },
              {
                title: "GPS Evidence",
                description: "Capture installation photos with GPS coordinates",
              },
              {
                title: "Stripe Payments",
                description: "Flexible subscription plans for all team sizes",
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-lg text-slate-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; 2024 visualgv.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
