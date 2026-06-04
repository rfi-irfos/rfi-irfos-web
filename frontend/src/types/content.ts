export interface NavLink { label: string; href: string }
export interface FeatureItem { id: string; title: string; description: string }
export interface ProductItem { id: string; name: string; description: string; price: string; image: string }

export type SectionId = 'hero' | 'about' | 'products' | 'contact'
export const DEFAULT_SECTION_ORDER: SectionId[] = ['hero', 'about', 'products', 'contact']

export interface SiteContent {
  sectionOrder?: SectionId[]
  meta: {
    title: string
    description: string
    primaryColor: string
    accentColor: string
    font: string
  }
  nav: {
    logo: string
    brand: string
    links: NavLink[]
  }
  hero: {
    headline: string
    subheadline: string
    ctaLabel: string
    ctaHref: string
    image: string
    bgX?: number
    bgY?: number
    minHeight?: number
  }
  features: {
    title: string
    items: FeatureItem[]
  }
  products: {
    title: string
    items: ProductItem[]
  }
  contact: {
    title: string
    email: string
    phone: string
    address: string
  }
  footer: {
    brand: string
    tagline: string
    links: NavLink[]
    copyright: string
  }
}
