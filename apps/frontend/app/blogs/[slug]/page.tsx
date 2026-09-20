import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-data";
import { Navbar } from "@/components/sections/navbar/navbar";
import { FooterSection } from "@/components/sections/footer/footer-section";
import { Calendar, Clock, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "@/lib/icons";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found | BuildForJob",
    };
  }

  const url = `https://buildforjob.com/blogs/${post.slug}`;

  return {
    title: `${post.title} | BuildForJob Career Blog`,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: url,
      siteName: "BuildForJob",
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.image],
    },
  };
}

function parseInlineFormatting(text: string) {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-extrabold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  // Schema.org Article Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": `https://buildforjob.com${post.image}`,
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role,
    },
    "publisher": {
      "@type": "Organization",
      "name": "BuildForJob",
      "logo": {
        "@type": "ImageObject",
        "url": "https://buildforjob.com/favicon.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://buildforjob.com/blogs/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30 overflow-hidden transition-colors duration-300 flex flex-col justify-between">
      {/* Schema.org JSON-LD structured data for Google SEO */}
      <Script
        id={`article-jsonld-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 max-w-4xl mx-auto px-6 w-full flex-grow">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
              {post.category}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar size={13} /> {post.publishedAt}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400 flex items-center gap-1">
              <Clock size={13} /> {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author Row */}
          <div className="flex items-center gap-4 py-4 border-y border-slate-200/80 dark:border-purple-900/40">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-purple-900 shadow-sm"
            />
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {post.author.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                {post.author.role}
              </div>
            </div>
          </div>
        </header>

        {/* Article Cover Hero Illustration */}
        <div className="mb-12 p-6 rounded-3xl bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-900/40 shadow-xl flex items-center justify-center">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-[360px] object-contain rounded-2xl"
          />
        </div>

        {/* Article Body Content */}
        <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-gray-200 leading-relaxed text-sm sm:text-base mb-16 space-y-6">
          {post.content.split("\n\n").map((block, index) => {
            const trimmed = block.trim();

            if (trimmed.startsWith("# ")) {
              return (
                <h1 key={index} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                  {parseInlineFormatting(trimmed.replace(/^#\s+/, ""))}
                </h1>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={index} className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight border-b border-slate-200/60 dark:border-purple-900/30 pb-2">
                  {parseInlineFormatting(trimmed.replace(/^##\s+/, ""))}
                </h2>
              );
            }
            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={index} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8 mb-3">
                  {parseInlineFormatting(trimmed.replace(/^###\s+/, ""))}
                </h3>
              );
            }
            if (trimmed.startsWith("---")) {
              return <hr key={index} className="my-8 border-slate-200 dark:border-purple-900/40" />;
            }
            if (trimmed.startsWith("> ")) {
              const cleanQuote = trimmed.replace(/^>\s+/, "").replace(/^"|"$/g, "");
              return (
                <blockquote key={index} className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/50 border-l-4 border-blue-600 text-slate-800 dark:text-blue-200 font-medium italic my-6 shadow-2xs">
                  {parseInlineFormatting(cleanQuote)}
                </blockquote>
              );
            }
            // Ordered List (1. 2. 3.)
            if (/^\d+\.\s/.test(trimmed)) {
              const items = trimmed.split("\n").map(item => item.replace(/^\d+\.\s+/, ""));
              return (
                <ol key={index} className="space-y-3 my-5 pl-6 list-decimal text-slate-700 dark:text-gray-300">
                  {items.map((item, i) => (
                    <li key={i} className="pl-1">
                      {parseInlineFormatting(item)}
                    </li>
                  ))}
                </ol>
              );
            }
            // Unordered List (- or *)
            if (/^[-*]\s/.test(trimmed)) {
              const items = trimmed.split("\n").map(item => item.replace(/^[-*]\s+/, ""));
              return (
                <ul key={index} className="space-y-3 my-5 pl-6 list-disc text-slate-700 dark:text-gray-300">
                  {items.map((item, i) => (
                    <li key={i} className="pl-1">
                      {parseInlineFormatting(item)}
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={index} className="leading-relaxed text-slate-700 dark:text-gray-300 text-base sm:text-lg">
                {parseInlineFormatting(trimmed)}
              </p>
            );
          })}
        </article>

        {/* Call to Action Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-2xl mb-16 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3">
              <Sparkles size={13} /> Score 95%+ on ATS Scans
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Ready to beat the ATS & land your dream job?
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm">
              Use BuildForJob AI to analyze your resume, optimize keywords, and create stunning portfolios in seconds.
            </p>
          </div>
          <Link href="/register">
            <button className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-xl transition-all hover:scale-105 shrink-0 cursor-pointer">
              Build Free Resume
            </button>
          </Link>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Related Career Guides
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blogs/${related.slug}`}>
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-900/40 hover:border-blue-500/40 transition-all shadow-md group h-full flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/40 mb-3 inline-block">
                        {related.category}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors mb-2">
                        {related.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-purple-900/30 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <span>Read Guide</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      <FooterSection />
    </div>
  );
}
