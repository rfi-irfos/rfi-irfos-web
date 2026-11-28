import type { ReactNode } from 'react'

// Two-tone service icons (23.11.2026), same rules as the research icons (Research.tsx, picker 01.11.):
// one 32-unit grid, round caps, main element in the area colour (currentColor), secondary element (.k2)
// near-white so details stay readable.
const I = ({ children, sw = '1.6' }: { children: ReactNode; sw?: string }) => (
  <svg width="44" height="44" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)
const K = ({ children }: { children: ReactNode }) => <g className="k2">{children}</g>
const dot = (cx: number, cy: number, r = 1.4) => <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
const phone = <K><rect x="9" y="4" width="14" height="24" rx="3" /><path d="M14 24.5h4" /></K>

export const SVC_ICONS = {
  // ---- areas
  'monitoring': <I><K><circle cx="16" cy="16" r="11.5" /><circle cx="16" cy="16" r="6.5" opacity=".8" /></K><path d="M16 16 24 8.5" />{dot(16, 16, 1.6)}{dot(21.5, 19.5, 1.7)}</I>,
  'testing': <I><K><circle cx="15" cy="17" r="10.5" /><circle cx="15" cy="17" r="5.5" /></K><path d="M15 17 26 6" /><path d="M22 5.5h4.5V10" />{dot(15, 17, 1.6)}</I>,
  'code-and-apps': <I>{phone}<path d="m13.5 11.5-3 3 3 3M18.5 11.5l3 3-3 3" /></I>,
  'ai-security': <I><K><rect x="8" y="8" width="16" height="16" rx="3" /><path d="M12 4v4M20 4v4M12 24v4M20 24v4M4 12h4M4 20h4M24 12h4M24 20h4" /></K><path d="M16 11.5c1.2 2.4 2.1 3.3 4.5 4.5-2.4 1.2-3.3 2.1-4.5 4.5-1.2-2.4-2.1-3.3-4.5-4.5 2.4-1.2 3.3-2.1 4.5-4.5Z" /></I>,
  'compliance': <I><path d="M10 6.5H8.5A1.5 1.5 0 0 0 7 8v18a1.5 1.5 0 0 0 1.5 1.5h15A1.5 1.5 0 0 0 25 26V8a1.5 1.5 0 0 0-1.5-1.5H22" /><rect x="11" y="4.5" width="10" height="4" rx="1.2" /><K><path d="m11 18 3.5 3.5L21.5 14" /></K></I>,
  'fix-and-harden': <I><K><path d="M16 4 6.5 7.5v7.2c0 6 4 10.4 9.5 12.8 5.5-2.4 9.5-6.8 9.5-12.8V7.5Z" /></K><path d="M19.6 11.2a3.6 3.6 0 0 0-4.8 4.5l-4 4a1.4 1.4 0 0 0 2 2l4-4a3.6 3.6 0 0 0 4.5-4.8l-2.1 2.1-1.7-.4-.4-1.7Z" /></I>,
  // ---- services
  'managed-soc': <I><K><rect x="4.5" y="6" width="23" height="15.5" rx="2" /><path d="M12 26.5h8M16 21.5v5" /></K><path d="M8 14h3.5l2-4 3 8 2-4H24" /></I>,
  'threat-intelligence': <I><K><circle cx="16" cy="16" r="11" /><path d="M5 16h22M16 5c-3 3-4.5 6.8-4.5 11s1.5 8 4.5 11c3-3 4.5-6.8 4.5-11S19 8 16 5" opacity=".8" /></K><circle cx="22" cy="10" r="3.2" />{dot(22, 10, 1.2)}</I>,
  'it-security-graz': <I><ellipse cx="16" cy="26" rx="8" ry="2.2" /><K><path d="M16 25s-7.5-7.2-7.5-12.7a7.5 7.5 0 0 1 15 0C23.5 17.8 16 25 16 25Z" /></K><circle cx="16" cy="12.3" r="2.6" /></I>,
  'penetration-testing': <I><K><path d="M11 9.5 8 6.5M21 9.5l3-3M9.5 16H5M27 16h-4.5M10 22l-3.5 3M22 22l3.5 3" /></K><path d="M12 11.5a4 4 0 0 1 8 0" /><rect x="10" y="11.5" width="12" height="14" rx="6" /><path d="M16 15v7" /></I>,
  'api-security-testing': <I><K><path d="M10 5.5c-2.5 0-3.5 1-3.5 3.5v3.5c0 2-1 3.5-2.5 3.5 1.5 0 2.5 1.5 2.5 3.5V23c0 2.5 1 3.5 3.5 3.5M22 5.5c2.5 0 3.5 1 3.5 3.5v3.5c0 2 1 3.5 2.5 3.5-1.5 0-2.5 1.5-2.5 3.5V23c0 2.5-1 3.5-3.5 3.5" /></K><path d="M12.5 16h7" />{dot(12, 16, 1.7)}{dot(20, 16, 1.7)}</I>,
  'cloud-security-assessment': <I><K><path d="M9.5 24.5a5.5 5.5 0 0 1-.6-11A7.5 7.5 0 0 1 23.3 12a6.3 6.3 0 0 1-.8 12.5Z" /></K><rect x="12.5" y="16.5" width="7" height="5.5" rx="1" /><path d="M14 16.5v-1.5a2 2 0 0 1 4 0v1.5" /></I>,
  'domain-security-test': <I><K><rect x="4" y="6" width="24" height="20" rx="2.5" /><path d="M4 11h24" />{dot(7.5, 8.5, .8)}{dot(10, 8.5, .8)}</K><circle cx="15" cy="18" r="3.8" /><path d="m17.8 20.8 3.7 3.7" /></I>,
  'ai-llm-security-testing': <I><K><path d="M6 7.5h20a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H13l-5 4v-4H6A1.5 1.5 0 0 1 4.5 21V9A1.5 1.5 0 0 1 6 7.5Z" /></K><path d="M16 10.5c1 2 1.8 2.8 3.8 3.8-2 1-2.8 1.8-3.8 3.8-1-2-1.8-2.8-3.8-3.8 2-1 2.8-1.8 3.8-3.8Z" /></I>,
  'secure-code-review': <I><path d="M18 4H9.5A1.5 1.5 0 0 0 8 5.5v21A1.5 1.5 0 0 0 9.5 28h13a1.5 1.5 0 0 0 1.5-1.5V10Z" /><path d="M18 4v6h6" /><K><path d="m14 15-3 3 3 3M18 15l3 3-3 3" /></K></I>,
  'app-security-audit': <I>{phone}<circle cx="15.5" cy="13.5" r="3.5" /><path d="m18 16 2.5 2.5" /></I>,
  'app-tracker-sdk-check': <I>{phone}{dot(16, 15, 1.6)}<path d="M13 12a4.2 4.2 0 0 0 0 6M19 12a4.2 4.2 0 0 1 0 6" /></I>,
  'gdpr-app-audit': <I>{phone}<rect x="12.5" y="13" width="7" height="6" rx="1" /><path d="M14 13v-1.5a2 2 0 0 1 4 0V13" /></I>,
  'ai-app-privacy-audit': <I><K><rect x="8" y="8" width="16" height="16" rx="3" /><path d="M12 4v4M20 4v4M12 24v4M20 24v4M4 12h4M4 20h4M24 12h4M24 20h4" /></K><path d="M11 16s2-3.5 5-3.5 5 3.5 5 3.5-2 3.5-5 3.5-5-3.5-5-3.5Z" />{dot(16, 16, 1.3)}</I>,
  'nis2-consulting': <I><path d="M18 4H9.5A1.5 1.5 0 0 0 8 5.5v21A1.5 1.5 0 0 0 9.5 28h13a1.5 1.5 0 0 0 1.5-1.5V10Z" /><path d="M18 4v6h6" /><K>{dot(16, 13, 1)}{dot(19.5, 16.5, 1)}{dot(16, 23, 1)}{dot(12.5, 16.5, 1)}{dot(18.5, 20.5, 1)}{dot(13.5, 20.5, 1)}{dot(13.5, 13.8, .9)}{dot(18.5, 13.8, .9)}</K></I>,
  'nis2-software-vendors': <I><K><path d="m16 4 10.5 5.5v13L16 28 5.5 22.5v-13Z" /><path d="M5.5 9.5 16 15l10.5-5.5M16 15v13" opacity=".8" /></K><circle cx="23" cy="22" r="5" /><path d="m21 22 1.4 1.4 2.6-2.6" /></I>,
  'compliance-automation': <I><K><path d="M15 9h11M15 16h11M15 23h11" /></K><path d="m5.5 9 1.8 1.8L10.5 7.5M5.5 16l1.8 1.8 3.2-3.3M5.5 23l1.8 1.8 3.2-3.3" /></I>,
  'vendor-risk-management': <I><K><path d="M12.5 19.5 10 22a3.5 3.5 0 0 1-5-5l3.5-3.5a3.5 3.5 0 0 1 5 0M14 15.5l2.5-2.5a3.5 3.5 0 0 1 5 5" /></K><path d="m22 17.5 5.5 9.5h-11Z" /><path d="M22 21v2.2" />{dot(22, 25, .9)}</I>,
  'vulnerability-remediation': <I><path d="M18 4H9.5A1.5 1.5 0 0 0 8 5.5v21A1.5 1.5 0 0 0 9.5 28h13a1.5 1.5 0 0 0 1.5-1.5V10Z" /><path d="M18 4v6h6" /><K><path d="M11.5 14h5M11.5 18h3" /><path d="M23 15.5a3.4 3.4 0 0 0-4.5 4.2l-4.2 4.2a1.3 1.3 0 0 0 1.9 1.9l4.2-4.2a3.4 3.4 0 0 0 4.2-4.5l-2 2-1.6-.4-.4-1.6Z" /></K></I>,
  'security-architecture-review': <I><K><rect x="4" y="21" width="7" height="6" rx="1.3" /><rect x="12.5" y="21" width="7" height="6" rx="1.3" /><rect x="21" y="21" width="7" height="6" rx="1.3" /><path d="M7.5 21v-3h17v3M16 18v3" /></K><rect x="11" y="5" width="10" height="9" rx="1.8" /><path d="M16 14v4" /></I>,
} as const

export type SvcIconKey = keyof typeof SVC_ICONS
