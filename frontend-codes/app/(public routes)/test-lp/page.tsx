import { Hero2 } from "../_new_homepage_components/hero/Hero";
import CapabilityJourney from "../_new_homepage_components/capability-journey/CapabilityJourney";
import HowItWorks from "../_new_homepage_components/how-it-works/HowItWorks";
import Products from "../_new_homepage_components/products/Products";
import CommunityProof from "../_new_homepage_components/community/CommunityProof";
import BentoShowcase from "../_new_homepage_components/products/bento-grid/BentoShowcase";
import FAQ from "../_new_homepage_components/FAQ/FAQ";

export default function page() {
  return (
    <div>
      <Hero2 />
      <CapabilityJourney />
      <HowItWorks />
      <Products />
      <CommunityProof />
      <BentoShowcase />
      <FAQ />
    </div>
  )
}