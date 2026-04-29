import { XMLParser } from "fast-xml-parser";

export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  isResearch: boolean;
}

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function getLink(item: Record<string, unknown>): string {
  const l = item.link;
  if (typeof l === "string") return l;
  if (l && typeof l === "object") {
    const lo = l as Record<string, unknown>;
    return (lo["@_href"] as string) ?? (lo["#text"] as string) ?? "";
  }
  return String(item.guid ?? "");
}

async function fetchFeed(
  url: string,
  sourceName: string,
  isResearch = false
): Promise<FeedItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "Mozilla/5.0 LifeOS/1.0" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const parsed = parser.parse(xml) as Record<string, unknown>;

    const rss = parsed.rss as Record<string, unknown> | undefined;
    const channel =
      (rss?.channel as Record<string, unknown>) ??
      (parsed.feed as Record<string, unknown>) ??
      {};
    const rawItems =
      (channel.item as unknown[]) ??
      (channel.entry as unknown[]) ??
      [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    return items
      .slice(0, 6)
      .map((item) => {
        const i = item as Record<string, unknown>;
        const title =
          typeof i.title === "string"
            ? i.title
            : (i.title as Record<string, unknown>)?.["#text"] as string ?? "";
        const description = stripHtml(
          String(i.description ?? i.summary ?? i["content:encoded"] ?? "")
        );
        const pubDate = String(i.pubDate ?? i.published ?? i.updated ?? "");
        return {
          title: title.trim(),
          link: getLink(i),
          pubDate,
          description,
          source: sourceName,
          isResearch,
        };
      })
      .filter((i) => i.title && i.link);
  } catch {
    return [];
  }
}

export const DOMAIN_FEEDS: Record<
  string,
  Array<{ url: string; name: string; research?: boolean }>
> = {
  fullstack: [
    { url: "https://css-tricks.com/feed/", name: "CSS-Tricks" },
    { url: "https://dev.to/feed/tag/javascript", name: "Dev.to" },
    { url: "https://www.smashingmagazine.com/feed/", name: "Smashing Mag" },
    { url: "https://nodeweekly.com/rss/", name: "Node Weekly" },
  ],
  devops: [
    { url: "https://kubernetes.io/feed.xml", name: "Kubernetes" },
    { url: "https://www.docker.com/blog/feed/", name: "Docker Blog" },
    { url: "https://www.cncf.io/feed/", name: "CNCF" },
  ],
  ai: [
    { url: "https://rss.arxiv.org/rss/cs.AI", name: "arXiv cs.AI", research: true },
    { url: "https://rss.arxiv.org/rss/cs.LG", name: "arXiv cs.LG", research: true },
    { url: "https://rss.arxiv.org/rss/cs.CL", name: "arXiv NLP", research: true },
    { url: "https://www.anthropic.com/rss.xml", name: "Anthropic" },
  ],
  web3: [
    { url: "https://decrypt.co/feed", name: "Decrypt" },
    { url: "https://www.coindesk.com/arc/outboundfeeds/rss/", name: "CoinDesk" },
    { url: "https://solana.com/news/rss.xml", name: "Solana" },
  ],
};

export async function fetchDomainFeeds(domainId: string): Promise<FeedItem[]> {
  const feeds = DOMAIN_FEEDS[domainId] ?? [];
  const results = await Promise.allSettled(
    feeds.map((f) => fetchFeed(f.url, f.name, f.research ?? false))
  );

  const items = results
    .filter(
      (r): r is PromiseFulfilledResult<FeedItem[]> => r.status === "fulfilled"
    )
    .flatMap((r) => r.value);

  items.sort((a, b) => {
    const da = new Date(a.pubDate).getTime() || 0;
    const db = new Date(b.pubDate).getTime() || 0;
    return db - da;
  });

  return items.slice(0, 20);
}
