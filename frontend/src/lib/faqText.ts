// FAQ answers may carry internal links as [text](/path/). The page renders them as links, the
// FAQPage JSON-LD gets the same sentence as plain text, so markup and visible text stay identical.
export const FAQ_LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g
export const faqPlain = (a: string) => a.replace(FAQ_LINK, '$1')
