import type { SiteContent } from './content'

export const defaultContent: SiteContent = {
  meta: {
    title: 'Your Business Name',
    description: 'Your business tagline goes here.',
    primaryColor: '#0099CC',
    accentColor: '#B3E600',
    font: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  nav: {
    logo: '',
    brand: 'Your Business',
    links: [
      { label: 'Services', href: '#categories' },
      { label: 'Products', href: '#products' },
      { label: 'Contact', href: '#location' },
      { label: 'News', href: '#news' },
    ],
    phone: '+43 000 000 0000',
    ctaLabel: 'Get in touch',
    ctaHref: '#location',
  },
  hero: {
    tag: 'Your City · Your Country',
    headline: 'Welcome to<br><span>Your Business.</span>',
    subheadline: 'A short description of what you offer and why customers should choose you.',
    ctaLabel: 'Explore products',
    ctaHref: '#products',
    ctaSecLabel: 'Contact us',
    ctaSecHref: '#location',
    image: '',
    bgX: 50,
    bgY: 40,
    minHeight: 680,
  },
  trust: {
    items: [
      { id: 't1', icon: 'delivery', bold: 'Fast Delivery', text: 'Nationwide shipping' },
      { id: 't2', icon: 'shield', bold: '2 Year', text: 'Warranty included' },
      { id: 't3', icon: 'tag', bold: 'Best Price', text: 'No hidden fees' },
      { id: 't4', icon: 'location', bold: 'Local Support', text: 'In your area' },
    ],
  },
  categories: {
    eyebrow: 'Our range',
    title: 'Something for everyone',
    items: [
      { id: 'c1', name: 'Category A', sub: 'Variant 1 · Variant 2', image: '' },
      { id: 'c2', name: 'Category B', sub: 'Variant 1 · Variant 2', image: '' },
      { id: 'c3', name: 'Category C', sub: 'Variant 1 · Variant 2', image: '' },
    ],
  },
  products: {
    title: 'Featured products',
    tabs: ['All', 'Category A', 'Category B', 'Category C'],
    items: [
      {
        id: 'p1', name: 'Product One', badge: 'Bestseller',
        category: 'Category A', description: 'A short description of this product.',
        price: 'from €99', image: '',
        specs: ['Feature 1', 'Feature 2', 'Feature 3'],
      },
      {
        id: 'p2', name: 'Product Two', badge: '',
        category: 'Category B', description: 'A short description of this product.',
        price: 'from €149', image: '',
        specs: ['Feature 1', 'Feature 2', 'Feature 3'],
      },
      {
        id: 'p3', name: 'Product Three', badge: 'Popular',
        category: 'Category C', description: 'A short description of this product.',
        price: 'from €199', image: '',
        specs: ['Feature 1', 'Feature 2', 'Feature 3'],
      },
    ],
  },
  usp: {
    eyebrow: 'Why us?',
    title: 'What sets us apart',
    items: [
      { id: 'u1', title: 'Competitive prices', description: 'We work directly with suppliers to keep costs low and quality high.' },
      { id: 'u2', title: 'Quality guarantee', description: 'All products come with a full warranty and dedicated after-sales support.' },
      { id: 'u3', title: 'Personal advice', description: 'Our team is available for consultations in person, by phone, or online.' },
      { id: 'u4', title: 'Fast shipping', description: 'Nationwide delivery, fully insured and tracked.' },
    ],
  },
  news: {
    eyebrow: 'News',
    title: "What's new",
    items: [
      {
        id: 'n1', date: '2026-01-01',
        title: 'Welcome to our new website',
        body: 'We have launched our new website. Browse our range and get in touch if you have any questions.',
      },
    ],
  },
  contact: {
    title: 'Visit us.',
    subtitle: 'We look forward to hearing from you.',
    email: 'hello@yourbusiness.com',
    phone: '+43 000 000 0000',
    address: 'Your Street 1, 0000 Your City, Austria',
    whatsapp: '',
    mapSrc: '',
    formEnabled: true,
  },
  whatsapp: {
    enabled: false,
    number: '',
    message: 'Hello! I am interested in your products.',
  },
  footer: {
    brand: 'Your Business',
    tagline: 'Your short tagline',
    description: 'A brief description of your business for the footer.',
    cols: [
      {
        title: 'Products',
        links: [
          { label: 'Category A', href: '#products' },
          { label: 'Category B', href: '#products' },
          { label: 'Category C', href: '#products' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About us', href: '#location' },
          { label: 'Contact', href: '#location' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Terms', href: '#p/agb' },
          { label: 'Privacy', href: '#p/datenschutz' },
          { label: 'Imprint', href: '#p/impressum' },
        ],
      },
    ],
    links: [
      { label: 'Terms', href: '#p/agb' },
      { label: 'Privacy', href: '#p/datenschutz' },
      { label: 'Imprint', href: '#p/impressum' },
    ],
    copyright: '© 2026 Your Business — made with love by RFI-IRFOS',
  },
}
