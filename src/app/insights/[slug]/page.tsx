import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import {
  TOPICS,
  findInsight,
  formatInsightDate,
  insightDate,
  listInsights,
  type Insight,
} from "@/lib/insights";
import { SITE_URL } from "@/lib/stone-specs";

type Props = { params: Promise<{ slug: string }> };

function insightFor(slug: string): Insight {
  const post = findInsight(slug);
  if (!post) notFound();
  return post;
}

export function generateStaticParams() {
  return listInsights().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = insightFor((await params).slug);
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/insights/${post.slug}`,
      types: { "application/rss+xml": "/insights/feed.xml" },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: insightDate(post.published).toISOString(),
      modifiedTime: insightDate(post.updated ?? post.published).toISOString(),
      section: TOPICS[post.topic],
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function InsightPage({ params }: Props) {
  const post = insightFor((await params).slug);
  const more = listInsights()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.topic === post.topic) - Number(a.topic === post.topic))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    articleSection: TOPICS[post.topic],
    mainEntityOfPage: `${SITE_URL}/insights/${post.slug}`,
    author: { "@type": "Organization", name: post.author, url: SITE_URL },
    publisher: { "@type": "Organization", name: "Imperial Star Gems", url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="mx-auto max-w-[760px] px-5 py-14 sm:px-8 sm:py-20">
        <Link
          href="/insights"
          className="text-[13px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
        >
          All insights
        </Link>

        {post.draft ? (
          <p className="mt-6 rounded-[12px] border border-ink px-4 py-3 text-[14px]">
            Draft. This note is only visible under <code>next dev</code>. Replace every TK
            placeholder, then remove <code>draft: true</code> to publish.
          </p>
        ) : null}

        <p className="mt-6 text-[13px] text-ink-muted">{TOPICS[post.topic]}</p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,5.4vw,3.8rem)]">{post.title}</h1>
        <p className="mt-5 text-[19px] leading-[1.6] text-ink-muted">{post.description}</p>

        <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 border-y border-hairline py-4 text-[13px] text-ink-muted">
          <span>{post.author}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.published}>{formatInsightDate(post.published)}</time>
          {post.updated ? (
            <>
              <span aria-hidden>·</span>
              <span>
                Updated <time dateTime={post.updated}>{formatInsightDate(post.updated)}</time>
              </span>
            </>
          ) : null}
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
        </p>

        <div className="mt-10">
          <Markdown source={post.body} />
        </div>

        <p className="mt-12 text-[13px] text-ink-muted">
          Market commentary drawn from publicly available market data and trade reporting, not
          investment advice. Prices move; figures are indicative and correct as of the date above.
        </p>

        <aside className="mt-10 rounded-[22px] bg-panel p-7 sm:p-8">
          <h2 className="font-display text-2xl">Buying in this market?</h2>
          <p className="mt-2 text-[15px] text-ink-muted-panel">
            Tell us the specification and we will quote today&apos;s price, or browse what is in
            stock now.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-ink px-6 py-2.5 text-[14px] text-white transition-opacity duration-200 hover:opacity-85"
            >
              Ask for a quote
            </Link>
            <Link
              href={post.topic === "lab-grown" ? "/lab-grown-diamonds" : "/natural-diamonds"}
              className="rounded-full border border-ink px-6 py-2.5 text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
            >
              {post.topic === "lab-grown" ? "Lab-grown stock" : "Natural stock"}
            </Link>
          </div>
        </aside>
      </article>

      {more.length ? (
        <section className="border-t border-hairline">
          <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8">
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)]">More from the trade desk</h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/insights/${p.slug}`}
                    className="group block h-full rounded-[22px] border border-hairline p-6 transition-colors duration-200 hover:border-ink"
                  >
                    <p className="text-[13px] text-ink-muted">
                      {TOPICS[p.topic]} · {formatInsightDate(p.published)}
                    </p>
                    <h3 className="mt-3 font-display text-[1.5rem]">{p.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
