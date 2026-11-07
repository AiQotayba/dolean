"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  FolderKanban,
  Hash,
  Star,
  Code,
  Briefcase,
  Wrench,
  Languages,
  Palette,
  Calculator,
  HeartPulse,
  BarChart3,
  Compass,
} from "lucide-react";
import { Header } from "../AdminHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ISectionItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  featured: boolean;
}

const ICON_MAP: Record<string, any> = {
  Code,
  Briefcase,
  Wrench,
  Languages,
  Palette,
  Calculator,
  HeartPulse,
  BarChart3,
  Compass,
  FolderKanban,
};

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<ISectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<ISectionItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Compass",
    order: 1,
    isActive: true,
    featured: true,
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const token = Cookies.get("authorization");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/sections", { headers });
      setSections(res.data);
    } catch (err) {
      console.error("Error loading sections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openAddDialog = () => {
    setEditingSection(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "Code",
      order: sections.length + 1,
      isActive: true,
      featured: true,
    });
    setErrorMsg("");
    setDialogOpen(true);
  };

  const openEditDialog = (section: ISectionItem) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      slug: section.slug,
      description: section.description || "",
      icon: section.icon || "Code",
      order: section.order || 1,
      isActive: section.isActive ?? true,
      featured: section.featured ?? true,
    });
    setErrorMsg("");
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("يرجى إدخال اسم القسم");
      return;
    }

    try {
      setSaving(true);
      if (editingSection) {
        await axios.put(`/api/admin/sections/${editingSection._id}`, formData, { headers });
      } else {
        await axios.post("/api/admin/sections", formData, { headers });
      }
      setDialogOpen(false);
      fetchSections();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (section: ISectionItem) => {
    try {
      const updated = !section.isActive;
      setSections((prev) =>
        prev.map((s) => (s._id === section._id ? { ...s, isActive: updated } : s))
      );
      await axios.put(`/api/admin/sections/${section._id}`, { isActive: updated }, { headers });
    } catch (err) {
      console.error("Error toggling section status:", err);
      fetchSections();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    try {
      await axios.delete(`/api/admin/sections/${id}`, { headers });
      setSections((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="space-y-6">
      <Header
        title="إدارة أقسام وتصنيفات الدورات"
        subtitle="تنظيم وتصنيف الدورات التدريبية في إدلب وفق مسارات تخصصية واضحة للطلاب والمراكز"
        action={
          <Button
            onClick={openAddDialog}
            className="bg-[#123D3A] hover:bg-[#0E2F2D] text-white flex items-center gap-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قسم جديد</span>
          </Button>
        }
      />

      {/* Sections Table Card */}
      <Card className="bg-white border-slate-200/90 overflow-hidden shadow-xs">
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            جاري تحميل الأقسام...
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            لا توجد أقسام مسجلة. انقر على "إضافة قسم جديد" للبدء.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">ترتيب</TableHead>
                <TableHead>القسم والأيقونة</TableHead>
                <TableHead>الاسم البرمجي (Slug)</TableHead>
                <TableHead className="hidden md:table-cell">الوصف</TableHead>
                <TableHead className="text-center">الحالة</TableHead>
                <TableHead className="text-center">مميز</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => {
                const IconComponent = ICON_MAP[section.icon || ""] || FolderKanban;
                return (
                  <TableRow key={section._id}>
                    <TableCell className="text-center font-bold text-slate-400">
                      {section.order}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#123D3A] shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                            {section.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[10px] text-slate-500">
                        {section.slug}
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-xs text-slate-500 max-w-xs truncate">
                      {section.description || "بدون وصف"}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center">
                        <Switch
                          checked={section.isActive}
                          onCheckedChange={() => handleToggleActive(section)}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {section.featured ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>رئيسي</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(section)}
                          className="h-8 px-2 rounded-lg text-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(section._id)}
                          className="h-8 px-2 rounded-lg text-xs bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add / Edit Section Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "تعديل القسم التدريبي" : "إضافة قسم وتصنيف جديد"}
            </DialogTitle>
            <DialogDescription>
              أدخل اسم القسم ووصفه ليظهر كفلتر وتصنيف للطلاب في المنصة.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="secName">اسم القسم (عربي) *</Label>
              <Input
                id="secName"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    name: val,
                    slug: formData.slug || val.toLowerCase().trim().replace(/\s+/g, "-"),
                  });
                }}
                placeholder="مثال: ذكاء اصطناعي وأتمتة"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="secSlug">المعرف البرمجي (Slug)</Label>
              <Input
                id="secSlug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="ai-automation"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="secDesc">الوصف التعريفي</Label>
              <Input
                id="secDesc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="نبذة عن المهارات المشمولة في هذا القسم"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="secIcon">الأيقونة (Lucide Icon)</Label>
                <Input
                  id="secIcon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Code, Wrench, Briefcase..."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="secOrder">الترتيب</Label>
                <Input
                  id="secOrder"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <span className="text-xs font-bold text-slate-700">مفعل</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <span className="text-xs font-bold text-slate-700">مميز بالرئيسية</span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#123D3A] text-white hover:bg-[#0E2F2D] w-full sm:w-auto"
              >
                {saving ? "جاري الحفظ..." : editingSection ? "حفظ التعديلات" : "إضافة القسم"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
