"use client";

import React, { useState, useEffect } from "react";
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
  Send,
  Pin,
  PinOff,
} from "lucide-react";
import Logo from "@/components/theme/Logo";
import { toast } from "sonner";

interface NavItemDef {
  id: string;
  title: string;
  href: string;
  icon: any;
  badge?: string | null;
  exact?: boolean;
}

const ALL_NAV_ITEMS: NavItemDef[] = [
  {
    id: "home",
    title: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    id: "users-details",
    title: "طلبات واهتمامات الطلاب",
    href: "/admin/users-details",
    icon: UserCheck,
    badge: "رئيسي",
  },
  {
    id: "send-training",
    title: "إرسال تدريب للطلاب",
    href: "/admin/send-training",
    icon: Send,
    badge: "واتساب",
  },
  {
    id: "courses",
    title: "الدورات والتدريبات",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    id: "def-courses",
    title: "مسودات ومقترحات الدورات",
    href: "/admin/def-courses",
    icon: FileEdit,
    badge: "مراجعة",
  },
  {
    id: "ai-course",
    title: "توليد دورة بالـ AI",
    href: "/admin/ai-course",
    icon: Sparkles,
    badge: "AI",
  },
  {
    id: "users",
    title: "حسابات المستخدمين والمدراء",
    href: "/admin/users",
    icon: Users,
  },
  {
    id: "centers",
    title: "المراكز والمنظمات بإدلب",
    href: "/admin/centers",
    icon: Building2,
  },
  {
    id: "sections",
    title: "أقسام وتصنيفات الدورات",
    href: "/admin/sections",
    icon: Layers,
  },
  {
    id: "sliders",
    title: "إدارة السلايدرات والإعلانات",
    href: "/admin/sliders",
    icon: Sliders,
  },
  {
    id: "stats",
    title: "الإحصائيات الشاملة",
    href: "/admin/stats",
    icon: BarChart3,
  },
];

const DEFAULT_PINNED = ["home", "users-details", "send-training", "courses"];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Pinned items from LocalStorage
  const [pinnedIds, setPinnedIds] = useState<string[]>(DEFAULT_PINNED);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("talaqi_pinned_nav");
      if (stored) {
        setPinnedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load pinned nav:", e);
    }
  }, []);

  const togglePin = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setPinnedIds((prev) => {
      let updated: string[];
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
        toast.info("تمت إزالة التثبيت من الوصول السريع");
      } else {
        updated = [...prev, id];
        toast.success("تم تثبيت العنصر في الوصول السريع 📌");
      }
      try {
        localStorage.setItem("talaqi_pinned_nav", JSON.stringify(updated));
      } catch (err) {
        console.warn("Storage error:", err);
      }
      return updated;
    });
  };

  // Collapsible sections state
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

  // Collapsible Groups
  const collapsibleGroups = [
    {
      id: "users",
      title: "المستخدمين والطلاب",
      icon: Users,
      items: [
        ALL_NAV_ITEMS.find((i) => i.id === "users")!,
        ALL_NAV_ITEMS.find((i) => i.id === "users-details")!,
      ],
    },
    {
      id: "orgs",
      title: "المنظمات والمراكز",
      icon: Building2,
      items: [ALL_NAV_ITEMS.find((i) => i.id === "centers")!],
    },
    {
      id: "trainings",
      title: "إدارة التدريبات",
      icon: GraduationCap,
      items: [
        ALL_NAV_ITEMS.find((i) => i.id === "courses")!,
        ALL_NAV_ITEMS.find((i) => i.id === "def-courses")!,
        ALL_NAV_ITEMS.find((i) => i.id === "ai-course")!,
        ALL_NAV_ITEMS.find((i) => i.id === "send-training")!,
        ALL_NAV_ITEMS.find((i) => i.id === "sections")!,
      ],
    },
    {
      id: "platform",
      title: "إدارة المنصة",
      icon: Settings,
      items: [
        ALL_NAV_ITEMS.find((i) => i.id === "sliders")!,
        ALL_NAV_ITEMS.find((i) => i.id === "sections")!,
        ALL_NAV_ITEMS.find((i) => i.id === "stats")!,
      ],
    },
  ];

  const pinnedItems = ALL_NAV_ITEMS.filter((item) => pinnedIds.includes(item.id));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-l border-slate-200/90 text-right select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
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
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Pinned Quick Access (الوصول السريع المثبت بالدبابيس) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="text-[11px] font-black text-slate-400 tracking-wider flex items-center gap-1">
              <Pin className="w-3 h-3 text-[#D58A38]" />
              <span>الوصول السريع المثبت</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">({pinnedItems.length})</span>
          </div>

          {pinnedItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <div
                key={item.id}
                className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? "bg-[#123D3A] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 min-w-0 truncate flex-1"
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-[#D58A38]" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span className="truncate">{item.title}</span>
                </Link>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badge === "واتساب"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.badge === "AI"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Pin toggle button */}
                  <button
                    type="button"
                    onClick={(e) => togglePin(item.id, e)}
                    className={`p-1 rounded-md transition ${
                      isActive
                        ? "text-white/70 hover:text-white"
                        : "text-slate-300 hover:text-[#D58A38] hover:bg-amber-50"
                    }`}
                    title="إلغاء التثبيت من الوصول السريع"
                  >
                    <Pin className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Separator */}
        <div className="pt-2 border-t border-slate-100">
          <p className="px-2 text-[11px] font-black text-slate-400 tracking-wider mb-2">
            كافة الأقسام (اضغط 📌 للتثبيت)
          </p>

          {/* Collapsible Accordion Sections */}
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
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition"
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
                      {group.items.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive =
                          pathname === subItem.href ||
                          pathname?.startsWith(`${subItem.href}/`);
                        const isPinned = pinnedIds.includes(subItem.id);

                        return (
                          <div
                            key={subItem.id}
                            className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isSubActive
                                ? "bg-[#123D3A]/10 text-[#123D3A] font-bold"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                          >
                            <Link
                              href={subItem.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-2 min-w-0 truncate flex-1"
                            >
                              <SubIcon
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSubActive ? "text-[#123D3A]" : "text-slate-400"
                                }`}
                              />
                              <span className="truncate">{subItem.title}</span>
                            </Link>

                            <button
                              type="button"
                              onClick={(e) => togglePin(subItem.id, e)}
                              className={`p-1 rounded opacity-60 group-hover:opacity-100 transition ${
                                isPinned
                                  ? "text-[#D58A38]"
                                  : "text-slate-300 hover:text-slate-600"
                              }`}
                              title={isPinned ? "مثبت في الوصول السريع" : "تثبيت في الوصول السريع"}
                            >
                              <Pin className={`w-3 h-3 ${isPinned ? "fill-current" : ""}`} />
                            </button>
                          </div>
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
      <div className="p-3 border-t border-slate-100 space-y-1.5 bg-slate-50/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-[#123D3A] hover:text-[#123D3A] transition shadow-2xs"
        >
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D58A38]" />
            <span>معاينة واجهة الطلاب</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>تسجيل الخروج</span>
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
