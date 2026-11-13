"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from "js-cookie";
import { Menu, X, User, PlusCircle, Compass, Home, Info, HelpCircle } from 'lucide-react';
import Logo from './Logo';

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileHref, setProfileHref] = useState("/auth?route=login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authorization");
    const isAdmin = Cookies.get("isAdmin");
    if (token && token.length > 10) {
      setIsLoggedIn(true);
      setProfileHref(isAdmin === 'true' ? "/admin" : "/profile");
    } else {
      setIsLoggedIn(false);
      setProfileHref("/auth?route=login");
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/" text="الرئيسية" icon={<Home className="w-4 h-4" />} />
              <NavLink href="/courses" text="الدورات" icon={<Compass className="w-4 h-4" />} />
              <NavLink href="/how-it-works" text="كيف تستفيد؟" icon={<HelpCircle className="w-4 h-4" />} />
              <NavLink href="/about" text="من نحن" icon={<Info className="w-4 h-4" />} />
            </div>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Primary CTA: Filled in Warm Orange with generous padding */}
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#D58A38] hover:bg-[#BE772B] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#D58A38]/25 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>اطلب دورتك مجاناً</span>
            </Link>

            {/* Secondary CTA: Plain text link */}
            <Link
              href={profileHref}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#123D3A] hover:bg-slate-100/70 rounded-xl transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>{isLoggedIn ? (profileHref === '/admin' ? 'لوحة التحكم' : 'حسابي') : 'تسجيل الدخول'}</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-lg animate-in fade-in duration-150">
          <div className="space-y-1">
            <MobileNavLink
              href="/"
              text="الرئيسية"
              icon={<Home className="w-4 h-4" />}
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/courses"
              text="الدورات"
              icon={<Compass className="w-4 h-4" />}
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/how-it-works"
              text="كيف تستفيد؟"
              icon={<HelpCircle className="w-4 h-4" />}
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/about"
              text="من نحن"
              icon={<Info className="w-4 h-4" />}
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-[#D58A38] text-white text-center font-bold text-sm shadow-md shadow-[#D58A38]/20 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>اطلب دورتك مجاناً</span>
            </Link>

            <Link
              href={profileHref}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 rounded-xl border border-slate-200 text-slate-700 text-center font-medium text-xs hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>{isLoggedIn ? (profileHref === '/admin' ? 'لوحة التحكم' : 'حسابي') : 'تسجيل الدخول'}</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, text, icon }: { href: string; text: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-primary-600 hover:bg-primary-50/50 transition-colors"
    >
      <span className="text-slate-400">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}

function MobileNavLink({
  href,
  text,
  icon,
  onClick,
}: {
  href: string;
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-primary-50 hover:text-primary-700 transition-colors"
    >
      <span className="text-primary-600">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}
