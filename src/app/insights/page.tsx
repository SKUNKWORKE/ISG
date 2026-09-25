import type { Metadata } from "next";
import Link from "next/link";
import { TOPICS, formatInsightDate, listInsights, type Insight } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Market insights",
  description:
    "Commentary from the trade desk on natural diamond pricing, the fall in lab-grown prices, and what both mean for buyers of loose stones.",
  alternates: {
    canonical: "/insights",
    types: { "application/rss+xml": "/insights/feed.xml" },
  },
};

function Meta({ post }: { post: Insight }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-muted">
      <span>{TOPICS[post.topic]}</span>
      <span aria-hidden className="h-px w-3 bg-hairline" />
      <time dateTime={post.published}>{formatInsightDate(post.published)}</time>
      <span aria-hidden className="h-px w-3 bg-hairline" />
      <span>{post.readingMinutes} min read</span>
      {post.draft ? (
        <span className="rounded-[10px] border border-ink px-2 py-0.5 text-[11px] text-ink">
          Draft, visible in dev only
        </span>
      ) : null}
    </p>
  );
}

export default function InsightsPage() {
  const [lead, ...rest] = listInsights();

  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
          <h1 className="max-w-[880px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
            Market insights
          </h1>
          <p className="measure mt-5 text-ink-muted">
            Notes from the trade desk on where natural and lab-grown prices are heading, and what
            that means when you are buying loose stones. Written for people who buy for a living.
          </p>
          <a
            href="/insights/feed.xml"
            className="mt-6 inline-block text-[13px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
          >
            Subscribe by RSS
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16">
        {!lead ? (
          <div className="rounded-[22px] border border-hairline bg-panel p-8">
            <h2 className="font-display text-2xl">The first notes are in preparation</h2>
            <p className="measure mt-2 text-[15px] text-ink-muted-panel">
              In the meantime, the trade desk is glad to talk through current pricing on any
              specification.{" "}
              <Link href="/contact" className="underline underline-offset-4 hover:text-ink">
                Get in touch
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <Link
              href={`/insights/${lead.slug}`}
              className="group block rounded-[36px] bg-panel p-8 transition-colors duration-200 sm:p-12"
            >
              <Meta post={lead} />
              <h2 className="mt-5 max-w-[900px] font-display text-[clamp(2rem,4.4vw,3.2rem)] underline decoration-transparent underline-offset-[6px] transition-colors duration-200 group-hover:decoration-ink">
                {lead.title}
              </h2>
              <p className="measure mt-4 text-ink-muted-panel">{lead.description}</p>
              <span className="mt-8 inline-block rounded-full bg-ink px-6 py-2.5 text-[14px] text-white">
                Read the note
              </span>
            </Link>

            {rest.length ? (
              <ul className="mt-12 border-t border-hairline">
                {rest.map((post) => (
                  <li key={post.slug} className="border-b border-hairline">
                    <Link
                      href={`/insights/${post.slug}`}
                      className="group grid gap-3 py-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12"
                    >
                      <div>
                        <Meta post={post} />
                        <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] underline decoration-transparent underline-offset-[5px] transition-colors duration-200 group-hover:decoration-ink">
                          {post.title}
                        </h3>
                      </div>
                      <p className="measure text-[15px] text-ink-muted lg:pt-8">
                        {post.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}
