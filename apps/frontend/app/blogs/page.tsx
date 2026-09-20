"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/sections/navbar/navbar";
import { FooterSection } from "@/components/sections/footer/footer-section";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-data";
import { Search, Sparkles, Clock, Calendar, ArrowRight, Tag, BookOpen } from "@/lib/icons";

export default function BlogsPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const categories = ["All", "ATS Optimization", "Resume Builder", "Cover Letter", "Portfolio Builder"];

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30 overflow-hidden transition-colors duration-300 flex flex-col justify-between">
      {/* Background Gradient Blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-6 w-full flex-grow">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 mb-4 shadow-2xs">
            <Sparkles size={14} />
            <span>Career & Resume Insights</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            BuildForJob{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
              Blog & Guides.
            </span>
          </h1>

          <p className="text-slate-600 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Expert strategies on beating ATS screeners, optimizing resumes, generating tailored cover letters, and landing 3x more interviews.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 bg-white/70 dark:bg-[#110e20]/80 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-purple-900/30 backdrop-blur-xl shadow-md">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "bg-slate-100 dark:bg-purple-950/40 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-purple-900/60"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-purple-900/40 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Featured Article Card */}
        {selectedCategory === "All" && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16 rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-[#131024] dark:via-[#17132e] dark:to-[#1a1435] border border-blue-200/70 dark:border-purple-900/40 p-6 sm:p-10 shadow-xl relative overflow-hidden group"
          >
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wider">
                    Featured Guide
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar size={13} /> {featuredPost.publishedAt}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Link href={`/blogs/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-slate-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200/70 dark:border-purple-900/40">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-purple-900 shadow-sm"
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {featuredPost.author.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-gray-400">
                        {featuredPost.author.role}
                      </div>
                    </div>
                  </div>

                  <Link href={`/blogs/${featuredPost.slug}`}>
                    <button className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer">
                      <span>Read Full Guide</span>
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="md:col-span-5 flex items-center justify-center">
                <div className="w-full p-4 rounded-2xl bg-white/80 dark:bg-[#120e22]/90 border border-purple-100 dark:border-purple-900/40 shadow-lg backdrop-blur-md transition-transform duration-500 group-hover:scale-[1.02]">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full max-h-[260px] object-contain rounded-xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-3xl bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-900/40 p-6 flex flex-col justify-between shadow-lg hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 group"
            >
              <div>
                <div className="relative mb-5 p-3 rounded-2xl bg-slate-50 dark:bg-purple-950/40 border border-slate-200/60 dark:border-purple-900/30 flex items-center justify-center overflow-hidden min-h-[160px]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="max-h-[140px] object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
                    {post.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={13} /> {post.publishedAt}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> {post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Link href={`/blogs/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-purple-900/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-white dark:border-purple-900 shadow-2xs"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                    {post.author.name}
                  </span>
                </div>

                <Link href={`/blogs/${post.slug}`}>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight size={13} />
                  </span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center text-slate-500 dark:text-gray-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-40" />
            <h3 className="text-xl font-bold mb-2">No articles found</h3>
            <p className="text-sm">Try searching for different keywords like "ATS", "Resume", or "Cover Letter".</p>
          </div>
        )}

      </main>

      <FooterSection />
    </div>
  );
}
