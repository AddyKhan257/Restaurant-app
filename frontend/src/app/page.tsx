import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-charcoal via-sage-950 to-charcoal overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-sage-500 rounded-full blur-3xl" />
        </div>

        <div className="container-narrow relative z-10 py-20">
          <div className="max-w-3xl">
            <p className="text-brand-400 font-body font-medium tracking-widest uppercase text-sm mb-6 animate-fade-in-up">
              Fine Dining Experience
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.95] mb-8 animate-fade-in-up stagger-1">
              Where Every
              <br />
              <span className="italic text-brand-400">Bite</span> Tells
              <br />
              a Story
            </h1>
            <p className="text-lg md:text-xl text-sage-300 max-w-xl mb-10 font-light leading-relaxed animate-fade-in-up stagger-2">
              Discover a symphony of flavors crafted by our award-winning chefs.
              Fresh ingredients, bold imagination, unforgettable moments.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-3">
              <Link href="/menu" className="btn-primary text-lg px-8 py-4">
                Explore Our Menu
              </Link>
              <Link href="/reservations" className="btn-secondary text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-charcoal">
                Reserve a Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-cream">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <h2 className="section-title">The Savoria Experience</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              From farm to table, every detail is curated for an extraordinary dining journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🍳',
                title: 'Farm-Fresh Ingredients',
                desc: 'Sourced daily from local farms and artisan producers. Every ingredient has a story.',
              },
              {
                icon: '👨‍🍳',
                title: 'Award-Winning Chefs',
                desc: 'Our culinary team brings decades of Michelin-star experience to your plate.',
              },
              {
                icon: '🌿',
                title: 'Sustainable Dining',
                desc: 'Committed to zero-waste practices and eco-friendly sourcing for a better planet.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <span className="text-5xl mb-4 block">{f.icon}</span>
                <h3 className="text-xl font-display font-semibold mb-3">{f.title}</h3>
                <p className="text-sage-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-sage-900 text-white">
        <div className="container-narrow text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to <span className="italic text-brand-400">Indulge</span>?
          </h2>
          <p className="text-sage-300 text-lg mb-10 max-w-xl mx-auto">
            Order online for delivery and pickup, or reserve your table for an evening to remember.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/menu" className="btn-primary text-lg px-8 py-4">
              Order Now
            </Link>
            <Link href="/reservations" className="btn-secondary border-white text-white hover:bg-white hover:text-sage-900 text-lg px-8 py-4">
              Book a Table
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
