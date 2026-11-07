"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  UserCheck,
  BookOpen,
  FileEdit,
  Sparkles,
  Users,
  Building2,
  Layers,
  Sliders,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Compass,
  GraduationCap,
  Settings,
} from "lucide-react";
import Logo from "@/components/theme/Logo";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Collapsible sections state - closed by default, auto-opened if active child
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    users: false,
    orgs: false,
    trainings: false,
    platform: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    Cookies.remove("authorization", { path: "/" });
    Cookies.remove("isAdmin", { path: "/" });
    router.push("/auth?route=login");
  };

  // 1. Top 5 Direct Main Links
  const directLinks = [
    {
      title: "لوحة التحكم الرئيسية",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
      exact: true,
    },
    {
      title: "طلبات واهتمامات الطلاب",
      href: "/admin/users-details",
      icon: UserCheck,
      badge: "رئيسي",
      exact: false,
    },
    {
      title: "الدورات والتدريبات",
      href: "/admin/courses",
      icon: BookOpen,
      badge: null,
      exact: false,
    },
    {
      title: "مسودات ومقترحات الدورات",
      href: "/admin/def-courses",
      icon: FileEdit,
      badge: "مراجعة",
      exact: false,
    },
    {
      title: "إضافة دورة بالـ AI",
      href: "/admin/ai-course",
      icon: Sparkles,
      badge: "AI",
      exact: false,
    },
  ];

  // 2. Collapsible Groups (أقسام فرعية تفتح وتغلق)
  const collapsibleGroups = [
    {
      id: "users",
      title: "المستخدمين والطلاب",
      icon: Users,
      items: [
        {
          title: "حسابات المستخدمين والمدراء",
          href: "/admin/users",
          icon: Users,
        },
        {
          title: "طلبات واهتمامات الطلاب",
          href: "/admin/users-details",
          icon: UserCheck,
        },
      ],
    },
    {
      id: "orgs",
      title: "المنظمات والمراكز",
      icon: Building2,
      items: [
        {
          title: "المراكز والمنظمات بإدلب",
          href: "/admin/centers",
          icon: Building2,
        },
      ],
    },
    {
      id: "trainings",
      title: "إدارة التدريبات",
      icon: GraduationCap,
      items: [
        {
          title: "الدورات والتدريبات المعتمدة",
          href: "/admin/courses",
          icon: BookOpen,
        },
        {
          title: "مسودات ومقترحات الدورات",
          href: "/admin/def-courses",
          icon: FileEdit,
        },
        {
          title: "توليد دورة بالذكاء الاصطناعي",
          href: "/admin/ai-course",
          icon: Sparkles,
        },
        {
          title: "أقسام وتصنيفات الدورات",
          href: "/admin/sections",
          icon: Layers,
        },
      ],
    },
    {
      id: "platform",
      title: "إدارة المنصة",
      icon: Settings,
      items: [
        {
          title: "إدارة السلايدرات والإعلانات",
          href: "/admin/sliders",
          icon: Sliders,
        },
        {
          title: "إدارة الأقسام والتصنيفات",
          href: "/admin/sections",
          icon: Layers,
        },
        {
          title: "الإحصائيات الشاملة للمنصة",
          href: "/admin/stats",
          icon: BarChart3,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-l border-slate-200/90 text-right select-none">
      {/* Brand Header: Only Official Logo and Platform Name */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 group">
          <Logo size="md" />
        </Link>

        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* Priority 1: Direct Main Fast Links */}
        <div className="space-y-1">
          {directLinks.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                  isActive
                    ? "bg-[#123D3A] text-white shadow-sm shadow-[#123D3A]/20"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-[#D58A38]" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{item.title}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badge === "AI"
                        ? "bg-purple-100 text-purple-700"
                        : item.badge === "رئيسي"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Separator */}
        <div className="pt-2 border-t border-slate-100">
          <p className="px-3 text-[11px] font-black text-slate-400 tracking-wider mb-2">
            الأقسام والإدارة المتقدمة
          </p>

          {/* Priority 2: Collapsible Accordion Sections */}
          <div className="space-y-1.5">
            {collapsibleGroups.map((group) => {
              const GroupIcon = group.icon;
              const hasActiveChild = group.items.some(
                (sub) => pathname === sub.href || pathname?.startsWith(`${sub.href}/`)
              );
              const isOpen = openSections[group.id] || false;

              return (
                <div
                  key={group.id}
                  className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50"
                >
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(group.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition"
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon
                        className={`w-3.5 h-3.5 ${
                          hasActiveChild ? "text-[#123D3A]" : "text-slate-400"
                        }`}
                      />
                      <span>{group.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {hasActiveChild && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#123D3A]" />
                      )}
                      {isOpen ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Body */}
                  {isOpen && (
                    <div className="px-2 pb-2 pt-1 space-y-1 bg-white border-t border-slate-100">
                      {group.items.map((subItem, subIdx) => {
                        const SubIcon = subItem.icon;
                        const isSubActive =
                          pathname === subItem.href ||
                          pathname?.startsWith(`${subItem.href}/`);

                        return (
                          <Link
                            key={subIdx}
                            href={subItem.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                              isSubActive
                                ? "bg-[#123D3A]/10 text-[#123D3A] font-bold"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                          >
                            <SubIcon
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isSubActive ? "text-[#123D3A]" : "text-slate-400"
                              }`}
                            />
                            <span className="truncate">{subItem.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / Account / Live View */}
      <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-[#123D3A] hover:text-[#123D3A] transition shadow-2xs"
        >
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D58A38]" />
            <span>معاينة واجهة الطلاب</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج من الإدارة</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Toggle Trigger Button */}
      <div className="lg:hidden fixed top-3 right-3 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-md hover:bg-slate-50 transition active:scale-95"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
