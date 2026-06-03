import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-white/20 bg-[linear-gradient(135deg,#4f46e5,#6d5dfc_55%,#f59e0b)] text-primary-foreground shadow-[0_18px_38px_rgba(79,70,229,0.26)] hover:scale-[1.02] hover:shadow-[0_22px_54px_rgba(79,70,229,0.34)] active:scale-[0.98]",
        secondary: "border border-slate-200 bg-white/75 text-slate-950 shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:bg-white",
        outline: "border border-slate-200 bg-white/60 text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur hover:border-indigo-200 hover:bg-white",
        ghost: "text-slate-700 hover:bg-white/60 hover:text-slate-950",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success: "bg-success text-white hover:bg-green-600",
        dark: "border border-white/10 bg-slate-950 text-white shadow-[0_18px_44px_rgba(2,6,23,0.28)] hover:bg-slate-900"
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-5",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { buttonVariants };
