import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSearch } from '@/components/home/HeroSearch'
import { SuperGrid } from '@/components/home/SuperGrid'
import { UtilitySections } from '@/components/home/UtilitySections'
import { ServiceProviders } from '@/components/home/ServiceProviders'
import { FeaturedCarousel } from '@/components/home/FeaturedProviders'
import { HowItWorks } from '@/components/home/HowItWorks'
import { TestimonialsMarquee } from '@/components/home/TestimonialsMarquee'
import { AppDownload } from '@/components/home/AppDownload'
import { PromoBanners } from '@/components/home/PromoBanners'
import TrustCarousel from '@/components/home/TrustCarousel'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  let userData = null
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('name, email, role')
      .eq('id', user.id)
      .single()
    userData = data
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header user={userData} />

      <main className="flex-1 pt-24">
        {/* Hero Search Section & Banners */}
        <HeroSearch />
        <PromoBanners />

        {/* Dense Navigation Grid (Justdial Style) */}
        <SuperGrid />

        {/* Utilities & Travel */}
        <UtilitySections />

        {/* Service Providers */}
        <ServiceProviders />

        {/* Community & App */}
        <TestimonialsMarquee />
        <AppDownload />

        {/* SEO Content / Footer Links */}
        <HowItWorks />
      </main>

      <Footer />
    </div>
  )
}
