import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#123D3A] text-white shadow-xs hover:bg-[#0E2F2D]",
        secondary:
          "border-[#A9B5B0]/30 bg-[#F8F8F5] text-[#123D3A] hover:bg-[#E2ECE9]",
        destructive:
          "border-transparent bg-red-600 text-white shadow-xs hover:bg-red-700",
        outline: "text-[#123D3A] border-[#A9B5B0]/40",
        success: "border-[#123D3A]/20 bg-[#123D3A] text-white",
        accent: "border-[#D58A38]/30 bg-[#D58A38]/15 text-[#D58A38]",
        brand: "border-[#123D3A]/20 bg-[#123D3A]/10 text-[#123D3A]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
