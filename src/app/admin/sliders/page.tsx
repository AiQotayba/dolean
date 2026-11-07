"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Sliders as SlidersIcon,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import { Header } from "../AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ISliderItem {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  link: string;
  buttonText?: string;
  order: number;
  isActive: boolean;
}

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState<ISliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<ISliderItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    badge: "مميز",
    link: "/courses",
    buttonText: "استكشف الفرصة",
    order: 1,
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const token = Cookies.get("authorization");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/sliders", { headers });
      setSliders(res.data);
    } catch (err: any) {
      console.error("Error loading sliders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const openAddDialog = () => {
    setEditingSlider(null);
    setFormData({
      title: "",
      subtitle: "",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80",
      badge: "فرصة تدريبية",
      link: "/courses",
      buttonText: "استكشف التدريب",
      order: sliders.length + 1,
      isActive: true,
    });
    setErrorMsg("");
    setDialogOpen(true);
  };

  const openEditDialog = (slider: ISliderItem) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle || "",
      image: slider.image,
      badge: slider.badge || "مميز",
      link: slider.link || "/courses",
      buttonText: slider.buttonText || "استكشف الفرصة",
      order: slider.order || 1,
      isActive: slider.isActive ?? true,
    });
    setErrorMsg("");
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image.trim()) {
      setErrorMsg("يرجى إدخال عنوان السلايدر ورابط الصورة");
      return;
    }

    try {
      setSaving(true);
      if (editingSlider) {
        await axios.put(`/api/admin/sliders/${editingSlider._id}`, formData, { headers });
      } else {
        await axios.post("/api/admin/sliders", formData, { headers });
      }
      setDialogOpen(false);
      fetchSliders();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (slider: ISliderItem) => {
    try {
      const updatedStatus = !slider.isActive;
      setSliders((prev) =>
        prev.map((s) => (s._id === slider._id ? { ...s, isActive: updatedStatus } : s))
      );
      await axios.put(
        `/api/admin/sliders/${slider._id}`,
        { isActive: updatedStatus },
        { headers }
      );
    } catch (err) {
      console.error("Error toggling slider state:", err);
      fetchSliders();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا السلايدر؟")) return;
    try {
      await axios.delete(`/api/admin/sliders/${id}`, { headers });
      setSliders((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("حدث خطأ أثناء حذف السلايدر");
    }
  };

  return (
    <div className="space-y-6">
      <Header
        title="إدارة السلايدرات والإعلانات البارزة"
        subtitle="تحكم في البانرات الرئيسية الترويجية المعروضة في واجهة منصة تلاقي للطلاب والزوار"
        action={
          <Button
            onClick={openAddDialog}
            className="bg-[#123D3A] hover:bg-[#0E2F2D] text-white flex items-center gap-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة سلايدر جديد</span>
          </Button>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي السلايدرات</span>
            <SlidersIcon className="w-4 h-4 text-[#D58A38]" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{sliders.length}</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">السلايدرات النشطة</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {sliders.filter((s) => s.isActive).length}
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">المعطلة مؤقتاً</span>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-600 mt-2">
            {sliders.filter((s) => !s.isActive).length}
          </div>
        </Card>
      </div>

      {/* Sliders Grid List */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          جاري تحميل السلايدرات...
        </div>
      ) : sliders.length === 0 ? (
        <Card className="p-12 text-center bg-white border-dashed border-2 border-slate-200">
          <SlidersIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">لا توجد سلايدرات مضافة حالياً</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
            أضف أول سلايدر للترويج لأحدث التدريبات وفرص العمل في إدلب والشمال السوري.
          </p>
          <Button onClick={openAddDialog} className="bg-[#123D3A] text-white">
            + إضافة سلايدر
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sliders.map((slider) => (
            <Card
              key={slider._id}
              className={`overflow-hidden border-slate-200/90 bg-white transition shadow-xs hover:shadow-md ${
                !slider.isActive ? "opacity-75 grayscale-25" : ""
              }`}
            >
              {/* Image Preview Banner */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={slider.image}
                  alt={slider.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#D58A38] text-white shadow-xs">
                    {slider.badge || "مميز"}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                    ترتيب: {slider.order}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 left-3 text-right">
                  <h3 className="text-base font-black text-white leading-snug line-clamp-2">
                    {slider.title}
                  </h3>
                  {slider.subtitle && (
                    <p className="text-xs text-[#A9B5B0] mt-1 line-clamp-1">
                      {slider.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Slider Details & Actions */}
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5 truncate max-w-[220px]">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{slider.link}</span>
                  </span>
                  <Badge variant="outline" className="text-[11px]">
                    زر: {slider.buttonText || "استكشف"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  {/* Active Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={slider.isActive}
                      onCheckedChange={() => handleToggleActive(slider)}
                    />
                    <span className="text-xs font-bold text-slate-700">
                      {slider.isActive ? "مفعل وظاهر" : "معطل"}
                    </span>
                  </div>

                  {/* Edit / Delete Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(slider)}
                      className="text-slate-700 border-slate-200 h-8 px-2.5 rounded-lg text-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 ml-1" />
                      <span>تعديل</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(slider._id)}
                      className="h-8 px-2.5 rounded-lg text-xs bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5 ml-1" />
                      <span>حذف</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Slider Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingSlider ? "تعديل بيانات السلايدر" : "إضافة سلايدر إعلاني جديد"}
            </DialogTitle>
            <DialogDescription>
              حدد العنوان الجذاب، الوصف المختصر، ورابط التوجيه لعرضه في الصفحة الرئيسية.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">عنوان السلايدر (رئيسي) *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="مثال: دبلوم الذكاء الاصطناعي وتحليل البيانات في إدلب"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subtitle">الوصف الفرعي التوضيحي</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="مثال: تدريب مكثف معتمد يؤهلك للعمل عن بعد مع كبرى الشركات"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image">رابط صورة الخلفية (Image URL) *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                required
              />
              <p className="text-[11px] text-slate-400">
                يفضل استخدام صورة عريضة عالية الجودة بدقة 1600x900 بكسل
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="badge">النص الترويجي (الشارة Badge)</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="مثال: منحة مجانية / تدريب جديد"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="buttonText">نص الزر التفاعلي</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="مثال: استكشف الفرصة / سجل الآن"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="link">رابط التوجيه (Link)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/courses أو https://..."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="order">ترتيب الظهور (Order)</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <span className="text-xs font-bold text-slate-700">
                تفعيل وظهور السلايدر في الموقع فور الحفظ
              </span>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#123D3A] text-white hover:bg-[#0E2F2D] w-full sm:w-auto"
              >
                {saving ? "جاري الحفظ..." : editingSlider ? "حفظ التعديلات" : "إضافة السلايدر"}
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
