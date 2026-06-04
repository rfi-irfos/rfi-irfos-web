import type { SiteContent } from './content'

export const defaultContent: SiteContent = {
  meta: {
    title: 'My Business',
    description: 'Welcome to our website',
    primaryColor: '#0099CC',
    accentColor: '#B3E600',
    font: 'system-ui, -apple-system, sans-serif',
  },
  nav: {
    logo: '',
    brand: 'My Business',
    links: [
      { label: 'Produkte', href: '#products' },
      { label: 'Über uns', href: '#about' },
      { label: 'Kontakt', href: '#contact' },
    ],
  },
  hero: {
    headline: 'Willkommen bei uns',
    subheadline: 'Wir bieten Ihnen beste Qualität zu fairen Preisen.',
    ctaLabel: 'Mehr erfahren',
    ctaHref: '#products',
    image: '',
  },
  features: {
    title: 'Unsere Leistungen',
    items: [
      { id: 'f1', title: 'Schnell', description: 'Schnelle Lieferung österreichweit.' },
      { id: 'f2', title: 'Günstig', description: 'Faire Preise, direkt vom Hersteller.' },
      { id: 'f3', title: 'Sicher', description: '2 Jahre Garantie auf alle Produkte.' },
    ],
  },
  products: {
    title: 'Unsere Produkte',
    items: [
      { id: 'p1', name: 'Produkt 1', description: 'Kurze Beschreibung.', price: '€99', image: '' },
      { id: 'p2', name: 'Produkt 2', description: 'Kurze Beschreibung.', price: '€149', image: '' },
      { id: 'p3', name: 'Produkt 3', description: 'Kurze Beschreibung.', price: '€199', image: '' },
    ],
  },
  contact: {
    title: 'Kontakt',
    email: 'info@example.at',
    phone: '',
    address: '',
  },
  footer: {
    brand: 'My Business',
    tagline: 'Ihre erste Wahl',
    links: [
      { label: 'AGB', href: '/agb' },
      { label: 'Datenschutz', href: '/datenschutz' },
      { label: 'Impressum', href: '/impressum' },
    ],
    copyright: '© 2024 My Business',
  },
}
