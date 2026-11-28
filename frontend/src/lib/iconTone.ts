// Second tone of the two-tone glass icons (Simeon 28.11.2026, icon picker A5): the base form turns amber instead of
// near-white, so a row of icons reads multicoloured. Boxes that are already warm (amber, coral) get teal instead,
// otherwise both tones of one icon would melt into one colour.
const WARM = new Set(['#f0ad3c', '#f27a54', 'var(--ib-4)', 'var(--ib-5)'])
export const ib2 = (ib: string) => (WARM.has(ib.toLowerCase()) ? '#36cdb2' : '#f0ad3c')
