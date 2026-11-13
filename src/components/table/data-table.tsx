"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Loader2,
  GripVertical,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

const DEFAULT_LIMIT = 10;
const LIMIT_OPTIONS = [10, 25, 50, 100] as const;

// Types
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T extends Record<string, any>> {
  columns: TableColumn<T>[];
  apiEndpoint: string;
  enableActions?: boolean;
  actions?: {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    custom?: (row: T) => React.ReactNode;
  };
  onAdd?: () => void;
  addLabel?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  enableDelete?: boolean;
  enableEdit?: boolean;
  enableView?: boolean;
  skeletonRows?: number;
  deleteTitle?: string;
  deleteDescription?: (row: T) => string;
  onDeleteConfirm?: (row: T) => Promise<void>;
  // For demo mode
  mockData?: T[];
  limitOptions?: number[];
  enableReorder?: boolean;
  reorderEndpoint?: string;
  extraHeaderActions?: React.ReactNode;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Wrapper component that handles Suspense
export function DataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
  return (
    <React.Suspense
      fallback={
        <DataTableSkeleton
          columns={props.columns}
          skeletonRows={props.skeletonRows}
        />
      }
    >
      <DataTableInner {...props} />
    </React.Suspense>
  );
}

// Skeleton loader for the table
function DataTableSkeleton({
  columns,
  skeletonRows = 5,
}: {
  columns: Array<Pick<TableColumn<any>, "key" | "label">>;
  skeletonRows?: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-sm rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <div className="rounded-2xl border border-border/80 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border bg-[#F8F8F5]/60">
              <TableHead className="w-16">
                <Skeleton className="h-4 w-8" />
              </TableHead>
              {columns.map((col) => (
                <TableHead key={col.key}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
              <TableHead className="w-32">
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent border-b border-border/40">
                <TableCell>
                  <Skeleton className="h-6 w-8 rounded-md" />
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-6 w-full max-w-[180px] rounded-md" />
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-1.5">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function DataTableInner<T extends Record<string, any>>({
  columns,
  apiEndpoint,
  enableActions = true,
  actions,
  onAdd,
  addLabel = "إضافة جديد",
  searchPlaceholder = "بحث...",
  emptyMessage = "لا توجد بيانات مطابقة",
  enableDelete = true,
  enableEdit = true,
  enableView = true,
  skeletonRows = 5,
  deleteTitle = "تأكيد الحذف",
  deleteDescription,
  onDeleteConfirm,
  mockData,
  limitOptions = [...LIMIT_OPTIONS],
  enableReorder = false,
  reorderEndpoint,
  extraHeaderActions,
}: DataTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams?.get("page")) || 1);
  const limitFromUrl = Number(searchParams?.get("limit"));
  const [clientLimit, setClientLimit] = React.useState<number>(
    limitFromUrl > 0 ? limitFromUrl : DEFAULT_LIMIT
  );
  const limit = clientLimit;

  React.useEffect(() => {
    const lim = Number(searchParams?.get("limit"));
    if (lim > 0 && lim !== clientLimit) {
      setClientLimit(lim);
    }
  }, [searchParams]);

  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(null);
  const [searchValue, setSearchValue] = React.useState(searchParams?.get("search") || "");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<T | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isReorderMode, setIsReorderMode] = React.useState(false);
  const [reorderedData, setReorderedData] = React.useState<T[]>([]);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [isSavingOrder, setIsSavingOrder] = React.useState(false);

  const resolvedReorderEndpoint = React.useMemo(
    () => reorderEndpoint ?? `${apiEndpoint.replace(/\?.*$/, "")}/reorder`,
    [apiEndpoint, reorderEndpoint]
  );

  // Build query params
  const queryKey = React.useMemo(() => {
    const params = Object.fromEntries(searchParams?.entries() || []);
    return ["table-data", apiEndpoint, params];
  }, [apiEndpoint, searchParams]);

  // Fetch data
  const { data: queryData, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (mockData) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const search = searchParams?.get("search")?.toLowerCase();

        let filtered = [...mockData];
        if (search) {
          filtered = filtered.filter((item) =>
            Object.values(item).some((val) =>
              String(val).toLowerCase().includes(search)
            )
          );
        }

        const total = filtered.length;
        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        return {
          data: paginated,
          meta: {
            current_page: page,
            last_page: Math.ceil(total / limit) || 1,
            per_page: limit,
            total,
          },
        };
      }

      const params = Object.fromEntries(searchParams?.entries() || []);
      const apiParams = {
        ...params,
        page,
        limit,
      };
      const response = await api.get<any>(apiEndpoint, { params: apiParams });
      if (response.isError) throw new Error(response.message || "حدث خطأ أثناء جلب البيانات");

      // Normalize: support standard { data, meta } or { data, total, limit, offset }
      const raw = response as {
        data?: T[];
        total?: number;
        limit?: number;
        offset?: number;
        meta?: PaginationMeta;
      };

      if (
        raw.total !== undefined &&
        raw.limit !== undefined &&
        !raw.meta
      ) {
        const total = raw.total;
        const perPage = raw.limit;
        const offset = raw.offset ?? (page - 1) * perPage;
        return {
          ...response,
          data: raw.data ?? [],
          meta: {
            current_page: Math.floor(offset / perPage) + 1,
            last_page: Math.ceil(total / perPage) || 1,
            per_page: perPage,
            total,
          },
        };
      }

      // If already has meta
      if (response.meta) {
        return response;
      }

      // Fallback: array response
      if (Array.isArray(response.data)) {
        const total = response.data.length;
        return {
          ...response,
          data: response.data,
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: total || 10,
            total,
          },
        };
      }

      return response;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const data = React.useMemo(() => {
    const apiData = queryData?.data;
    if (Array.isArray(apiData)) return apiData as T[];
    return [];
  }, [queryData]);

  React.useEffect(() => {
    if (isReorderMode && data.length > 0) {
      setReorderedData([...data]);
    }
  }, [isReorderMode, data]);

  const displayData = isReorderMode ? (reorderedData.length > 0 ? reorderedData : data) : data;

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    setReorderedData((prev) => {
      const next = [...prev];
      const [removed] = next.splice(draggedIndex, 1);
      next.splice(dropIndex, 0, removed);
      return next;
    });
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getRowId = (row: T): string | number => {
    return row._id || row.id || "";
  };

  const handleSaveOrder = async () => {
    try {
      setIsSavingOrder(true);
      const order = displayData.map((row, i) => ({
        id: getRowId(row),
        orderIndex: (page - 1) * limit + i,
      }));
      const response = await api.patch(resolvedReorderEndpoint, { order });
      if (response.isError) throw new Error(response.message);
      toast.success("تم حفظ الترتيب بنجاح");
      queryClient.invalidateQueries({ queryKey: ["table-data", apiEndpoint] });
      setIsReorderMode(false);
    } catch {
      toast.error("فشل حفظ الترتيب");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleCancelReorder = () => {
    setIsReorderMode(false);
    setDraggedIndex(null);
  };

  const pagination: PaginationMeta = React.useMemo(() => {
    return (
      queryData?.meta || {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      }
    );
  }, [queryData]);

  // Update URL params
  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Debounced search
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      updateParams({ search: val.trim() || null, page: "1" });
    }, 350);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    updateParams({ search: null, page: "1" });
  };

  // Handle sort
  const handleSort = (columnKey: string) => {
    let newDirection: "asc" | "desc" | null = null;
    let newColumn: string | null = columnKey;

    if (sortColumn === columnKey) {
      if (sortDirection === null || sortDirection === "asc") {
        newDirection = sortDirection === null ? "asc" : "desc";
      } else {
        newDirection = null;
        newColumn = null;
      }
    } else {
      newDirection = "asc";
    }

    setSortColumn(newColumn);
    setSortDirection(newDirection);

    if (newDirection === null) {
      updateParams({ sort_field: null, sort_order: null });
    } else {
      updateParams({ sort_field: columnKey, sort_order: newDirection });
    }
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage.toString() });
  };

  const handleLimitChange = (newLimit: string) => {
    const num = Number(newLimit);
    if (num > 0) {
      setClientLimit(num);
      updateParams({ limit: newLimit, page: "1" });
      queryClient.invalidateQueries({ queryKey: ["table-data", apiEndpoint] });
    }
  };

  const handleDeleteClick = (row: T) => {
    setSelectedRow(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;

    try {
      setIsDeleting(true);
      if (onDeleteConfirm) {
        await onDeleteConfirm(selectedRow);
      } else {
        const id = getRowId(selectedRow);
        const baseEndpoint = apiEndpoint.replace(/\?.*$/, "");
        const response = await api.delete(`${baseEndpoint}/${id}`);
        if (response.isError) throw new Error(response.message || "فشل الحذف");
        toast.success(response.message || "تم الحذف بنجاح");
      }
      queryClient.invalidateQueries({ queryKey: ["table-data", apiEndpoint] });
      setDeleteDialogOpen(false);
      setSelectedRow(null);
    } catch (err: any) {
      toast.error(err.message || "فشل حذف العنصر");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pr-10 pl-9 bg-white rounded-xl border-[#A9B5B0]/40 focus:border-[#123D3A]"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1.5 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full hover:bg-slate-100"
              onClick={handleClearSearch}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {extraHeaderActions}

          {enableReorder && !isReorderMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsReorderMode(true)}
            >
              <GripVertical className="h-4 w-4" />
              ترتيب بالسحب والإفلات
            </Button>
          )}
          {enableReorder && isReorderMode && (
            <>
              <Button
                type="button"
                size="sm"
                className="gap-2 bg-[#123D3A] text-white hover:bg-[#0E2F2D]"
                onClick={handleSaveOrder}
                disabled={isSavingOrder}
              >
                {isSavingOrder ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {isSavingOrder ? "جاري الحفظ..." : "حفظ الترتيب"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelReorder}
                disabled={isSavingOrder}
              >
                إلغاء
              </Button>
            </>
          )}
          {onAdd && !isReorderMode && (
            <Button
              onClick={onAdd}
              className="gap-2 bg-[#123D3A] text-white hover:bg-[#0E2F2D] shadow-sm"
            >
              <Plus className="h-4 w-4" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-border/80 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border bg-[#F8F8F5]/80">
              {enableReorder && isReorderMode && (
                <TableHead className="w-10 text-muted-foreground font-semibold" />
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "text-slate-700 font-bold text-xs sm:text-sm py-3.5",
                    column.width,
                    column.sortable && "cursor-pointer select-none hover:text-[#123D3A]"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{column.label}</span>
                    {column.sortable && sortColumn === column.key && (
                      <>
                        {sortDirection === "asc" && (
                          <ChevronUp className="h-3.5 w-3.5 text-[#123D3A]" />
                        )}
                        {sortDirection === "desc" && (
                          <ChevronDown className="h-3.5 w-3.5 text-[#123D3A]" />
                        )}
                      </>
                    )}
                  </div>
                </TableHead>
              ))}
              {enableActions && (
                <TableHead className="w-28 text-slate-700 font-bold text-xs sm:text-sm text-left pl-4">
                  الإجراءات
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent border-b border-border/40">
                  {columns.map((column) => (
                    <TableCell key={column.key} className="py-3">
                      <Skeleton className="h-5 w-full max-w-[180px] rounded-md" />
                    </TableCell>
                  ))}
                  {enableActions && (
                    <TableCell className="py-3">
                      <div className="flex gap-1 justify-end">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : displayData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (enableActions ? 1 : 0) +
                    (enableReorder && isReorderMode ? 1 : 0)
                  }
                  className="h-40 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Filter className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-sm text-slate-600">{emptyMessage}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row, rowIndex) => {
                const rowKey = String(getRowId(row) || rowIndex);
                return (
                  <TableRow
                    key={rowKey}
                    draggable={enableReorder && isReorderMode}
                    onDragStart={() => enableReorder && isReorderMode && handleDragStart(rowIndex)}
                    onDragOver={enableReorder && isReorderMode ? handleDragOver : undefined}
                    onDrop={(e) => enableReorder && isReorderMode && handleDrop(e, rowIndex)}
                    onDragEnd={enableReorder && isReorderMode ? handleDragEnd : undefined}
                    className={cn(
                      "border-b border-border/50 hover:bg-[#F8F8F5]/50 transition-colors",
                      enableReorder && isReorderMode && "cursor-grab active:cursor-grabbing",
                      draggedIndex === rowIndex && "opacity-50 bg-[#123D3A]/5"
                    )}
                  >
                    {enableReorder && isReorderMode && (
                      <TableCell className="w-10 p-2 text-muted-foreground">
                        <div
                          className="flex cursor-grab active:cursor-grabbing touch-none"
                          aria-hidden
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key} className={cn("py-3 text-sm", column.className)}>
                        {column.render
                          ? column.render((row as any)[column.key], row, rowIndex)
                          : String((row as any)[column.key] ?? "")}
                      </TableCell>
                    ))}
                    {enableActions && (
                      <TableCell className="py-3">
                        <div className="flex items-center justify-end gap-1">
                          {actions?.custom && actions.custom(row)}

                          {enableView && actions?.onView && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-600 hover:text-[#123D3A] hover:bg-[#123D3A]/10 rounded-lg"
                              title="عرض التفاصيل"
                              onClick={() => actions.onView?.(row)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {enableEdit && actions?.onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="تعديل"
                              onClick={() => actions.onEdit?.(row)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {enableDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="حذف"
                              onClick={() => handleDeleteClick(row)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Limit selector */}
      {pagination.total > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs sm:text-sm text-muted-foreground">
              عرض {(pagination.current_page - 1) * pagination.per_page + 1} -{" "}
              {Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total
              )}{" "}
              من أصل <strong className="text-slate-800">{pagination.total}</strong> سجل
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                العدد لكل صفحة:
              </span>
              <Select
                value={String(clientLimit)}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-[72px] h-8 text-xs bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {limitOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {pagination.last_page > 1 && (
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      pagination.current_page > 1 &&
                      handlePageChange(pagination.current_page - 1)
                    }
                    className={cn(
                      pagination.current_page === 1 &&
                        "pointer-events-none opacity-40 cursor-not-allowed"
                    )}
                  />
                </PaginationItem>
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                  .filter((p) => {
                    const current = pagination.current_page;
                    return (
                      p === 1 ||
                      p === pagination.last_page ||
                      Math.abs(p - current) <= 1
                    );
                  })
                  .map((p, i, arr) => (
                    <React.Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(p)}
                          isActive={p === pagination.current_page}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    </React.Fragment>
                  ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      pagination.current_page < pagination.last_page &&
                      handlePageChange(pagination.current_page + 1)
                    }
                    className={cn(
                      pagination.current_page === pagination.last_page &&
                        "pointer-events-none opacity-40 cursor-not-allowed"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-right text-lg font-bold text-slate-900">
              {deleteTitle}
            </DialogTitle>
            <DialogDescription className="text-right text-slate-600 text-sm pt-2">
              {selectedRow && deleteDescription
                ? deleteDescription(selectedRow)
                : "هل أنت متأكد من حذف هذا السجل نهائياً؟ لا يمكن التراجع عن هذا الإجراء."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 sm:justify-start flex-row-reverse mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "جاري الحذف..." : "حذف نهائي"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
