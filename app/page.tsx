import Link from 'next/link';
import { BookOpen, Sparkles, Globe, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold">FlipBook</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/auth/signin" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Admin Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Transform Your PDFs into
          <br />
          Interactive 3D Flipbooks
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create stunning, embeddable flipbook menus for restaurants, catalogs, and more.
          Engage your audience with realistic page-turning animations.
        </p>
        <Link 
          href="/auth/signin" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white text-lg rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          Admin Login
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose FlipBook?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-purple-600" />}
            title="3D Flip Effect"
            description="Realistic page-turning animations that captivate your audience and provide an authentic reading experience."
          />
          <FeatureCard
            icon={<Globe className="w-12 h-12 text-blue-600" />}
            title="Easy Embedding"
            description="Copy and paste a simple code snippet to embed your flipbook on any website instantly."
          />
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-pink-600" />}
            title="Fast & Responsive"
            description="Optimized performance across all devices. Your flipbooks load quickly and look great everywhere."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Step number="1" title="Create Shop" description="Set up your business profile" />
          <Step number="2" title="Upload Menu" description="Add your PDF or PNG files" />
          <Step number="3" title="Customize" description="Adjust settings and preview" />
          <Step number="4" title="Embed" description="Copy code to your website" />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses using FlipBook to showcase their content
          </p>
          <Link 
            href="/auth/signin" 
            className="inline-block px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Access Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2025 FlipBook. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

