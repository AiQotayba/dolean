import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#123D3A] disabled:pointer-events-none disabled:opacity-50 active:scale-98 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#123D3A] text-white shadow-sm hover:bg-[#0E2F2D] active:bg-[#0A2220]",
        destructive:
          "bg-red-600 text-white shadow-xs hover:bg-red-700",
        outline:
          "border border-[#A9B5B0]/40 bg-white text-slate-800 hover:bg-[#F8F8F5] hover:text-[#123D3A]",
        secondary:
          "bg-[#F8F8F5] text-[#123D3A] border border-[#A9B5B0]/30 shadow-xs hover:bg-[#E2ECE9]",
        ghost: "hover:bg-[#F8F8F5] hover:text-[#123D3A]",
        link: "text-[#D58A38] underline-offset-4 hover:underline",
        primary: "bg-[#123D3A] text-white hover:bg-[#0E2F2D]",
        accent: "bg-[#D58A38] text-white hover:bg-[#BE772B]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-13 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
