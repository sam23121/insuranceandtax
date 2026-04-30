import { CTASection } from '@/components/home/CTASection'
import { HeroSection } from '@/components/home/HeroSection'
import { ServicesGrid } from '@/components/home/ServicesGrid'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
