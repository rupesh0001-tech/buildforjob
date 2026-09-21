"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Sun, Moon, Menu, X, User, LogOut, LayoutDashboard, Settings } from '@/lib/icons';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Button1 } from "@/components/general/buttons/button1";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { UserDropdown } from "@/components/general/user-dropdown";
import { cn } from "../../../lib/utils";

export interface NavbarProps {
  isScrolled?: boolean;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  theme?: string;
  setTheme?: (theme: string) => void;
}

export function Navbar(props: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  // Internal fallback state when props are omitted (e.g. Server Components)
  const [internalIsScrolled, setInternalIsScrolled] = useState(false);
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);

  const activeIsScrolled = props.isScrolled ?? internalIsScrolled;
  const activeMobileOpen = props.mobileMenuOpen ?? internalMobileMenuOpen;

  const toggleMobileMenu = (open: boolean) => {
    if (props.setMobileMenuOpen) {
      props.setMobileMenuOpen(open);
    } else {
      setInternalMobileMenuOpen(open);
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setInternalIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname !== "/") {
      e.preventDefault();
      router.push(`/#${targetId}`);
    } else {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        activeIsScrolled 
          ? "bg-white/80 dark:bg-black/60 backdrop-blur-xl border-black/5 dark:border-white/10 py-2.5 shadow-2xl shadow-purple-900/5" 
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className={cn('max-w-7xl', 'mx-auto', 'px-6', 'flex', 'items-center', 'justify-between')}>
        <div className={cn('flex', 'items-center', 'gap-2')}>
          <Link href="/" className={cn('font-bold', 'text-lg', 'tracking-tight', 'flex', 'items-center')}>
             <img 
               src="/logo-black.png" 
               width={140} 
               height={40} 
               alt="BuildForJob Logo" 
               className="w-[140px] h-auto dark:hidden block object-contain" 
             />
             <img 
               src="/logo-light.png" 
               width={140} 
               height={40} 
               alt="BuildForJob Logo" 
               className="w-[140px] h-auto hidden dark:block object-contain" 
             />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className={cn('hidden', 'md:flex', 'gap-8', 'items-center', 'text-base', 'font-medium', 'text-gray-600', 'dark:text-gray-300')}>
          <Link href="/#features" onClick={(e) => handleNavClick(e, "features")} className={cn('hover:text-black', 'dark:hover:text-white', 'cursor-pointer', 'transition-colors')}>Features</Link>
          <Link href="/blogs" className={cn('hover:text-black', 'dark:hover:text-white', 'cursor-pointer', 'transition-colors')}>Blog</Link>
          <Link href="/#pricing" onClick={(e) => handleNavClick(e, "pricing")} className={cn('hover:text-black', 'dark:hover:text-white', 'cursor-pointer', 'transition-colors')}>Pricing</Link>
          
          <div className={cn('flex', 'gap-4', 'items-center', 'ml-4', 'border-l', 'border-black/10', 'dark:border-white/10', 'pl-8')}>

            {mounted && isAuthenticated ? (
              <div className={cn('flex', 'items-center', 'gap-4')}>
                <Link href="/dashboard">
                  <Button variant="ghost" className="font-semibold">Dashboard</Button>
                </Link>
                <UserDropdown />
              </div>
            ) : (
              <>
                <Link className="cursor-pointer" href="/login">
                  <Button className="cursor-pointer"  variant="ghost">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button1 className={cn('py-2.5', 'h-auto')}>
                    Start Building Free
                  </Button1>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className={cn('md:hidden', 'flex', 'items-center', 'gap-4')}>
          <button 
            className={cn('text-gray-600', 'dark:text-gray-300')}
            onClick={() => toggleMobileMenu(!activeMobileOpen)}
          >
            {activeMobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {activeMobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn('absolute', 'top-full', 'left-0', 'right-0', 'bg-white/95', 'dark:bg-black/95', 'backdrop-blur-xl', 'border-b', 'border-black/5', 'cursor-pointer', 'dark:border-white/10', 'p-6', 'flex', 'flex-col', 'gap-4', 'shadow-2xl', 'md:hidden')}
          >
            <Link 
              href="/#features" 
              onClick={(e) => {
                toggleMobileMenu(false);
                handleNavClick(e, "features");
              }} 
              className={cn('text-lg', 'text-gray-600', 'dark:text-gray-300', 'hover:text-black', 'dark:hover:text-white')}
            >
              Features
            </Link>
            <Link href="/blogs" onClick={() => toggleMobileMenu(false)} className={cn('text-lg', 'text-gray-600', 'dark:text-gray-300', 'hover:text-black', 'dark:hover:text-white')}>Blog</Link>
            <Link 
              href="/#pricing" 
              onClick={(e) => {
                toggleMobileMenu(false);
                handleNavClick(e, "pricing");
              }} 
              className={cn('text-lg', 'text-gray-600', 'dark:text-gray-300', 'hover:text-black', 'dark:hover:text-white')}
            >
              Pricing
            </Link>
            
            <div className={cn('h-px', 'bg-black/10', 'dark:bg-white/10', 'my-2')} />
            
            {mounted && isAuthenticated ? (
              <>
                <div className={cn('flex', 'items-center', 'gap-3', 'px-1', 'py-2')}>
                  <div className="relative">
                    <div className={cn('w-10', 'h-10', 'rounded-full', 'bg-purple-100', 'dark:bg-purple-900/40', 'text-purple-600', 'dark:text-purple-400', 'flex', 'items-center', 'justify-center', 'text-sm', 'font-bold', 'overflow-hidden')}>
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className={cn('w-full', 'h-full', 'object-cover')} />
                      ) : (
                        <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                      )}
                    </div>
                    {user?.plan === 'PRO' && (
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-extrabold tracking-wider rounded-full border-2 border-white dark:border-[#0c0c0e] uppercase pointer-events-none shadow-xs">
                        PRO
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={cn('text-sm', 'font-bold', 'text-black', 'dark:text-white')}>{user?.firstName} {user?.lastName}</p>
                      {user?.plan === 'PRO' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className={cn('text-xs', 'text-gray-500')}>{user?.email}</p>
                  </div>
                </div>
                <Link href="/dashboard" onClick={() => toggleMobileMenu(false)} className={cn('text-lg', 'font-medium', 'text-gray-600', 'dark:text-gray-300', 'hover:text-black', 'dark:hover:text-white')}>Dashboard</Link>
                <button onClick={handleLogout} className={cn('text-lg', 'font-medium', 'text-red-500', 'text-left')}>Log Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => toggleMobileMenu(false)} className={cn('cursor-pointer', 'text-left', 'text-lg', 'text-gray-600', 'dark:text-gray-300', 'hover:text-black', 'dark:hover:text-white')}>Log in</Link>
                <Link href="/register" onClick={() => toggleMobileMenu(false)} className={cn('cursor-pointer', 'bg-black', 'text-white', 'dark:bg-white', 'dark:text-black', 'px-5', 'py-3', 'rounded-xl', 'mt-2', 'font-medium', 'text-center')}>
                  Start Building Free
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

