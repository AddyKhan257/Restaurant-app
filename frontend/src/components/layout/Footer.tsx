import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-charcoal text-sage-300 mt-auto">
      <div className="container-narrow py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-display font-bold text-white mb-3">Savoria</h3>
            <p className="text-sm leading-relaxed text-sage-400">
              An unforgettable culinary journey. Crafted with passion, served with love.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="hover:text-brand-400 transition-colors">Our Menu</Link></li>
              <li><Link href="/reservations" className="hover:text-brand-400 transition-colors">Reservations</Link></li>
              <li><Link href="/orders" className="hover:text-brand-400 transition-colors">Order Online</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>123 Culinary Avenue</li>
              <li>New York, NY 10001</li>
              <li className="text-brand-400">(212) 555-0188</li>
              <li>hello@savoria.com</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hours</h4>
            <ul className="space-y-2 text-sm">
              <li>Mon–Thu: 11:30am – 10pm</li>
              <li>Fri–Sat: 11:30am – 11pm</li>
              <li>Sunday: 10am – 9pm</li>
              <li className="text-brand-400 mt-2">Brunch: Sat & Sun</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sage-800 mt-12 pt-8 text-center text-sm text-sage-500">
          &copy; {new Date().getFullYear()} Savoria Restaurant. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
