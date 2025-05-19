import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/90",
        destructive: "bg-destructive hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary hover:bg-secondary/80",
      },
      size: {
        default: "h-6 w-11",
        sm: "h-4.5 w-8",
        lg: "h-8 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  thumb?: React.ReactNode;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, thumb, variant, size, ...props }, ref) => {
  const notchSize =
    size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-5";
  const notchPosition =
    size === "sm"
      ? "data-[state=checked]:translate-x-3"
      : size === "lg"
      ? "data-[state=checked]:translate-x-7"
      : "data-[state=checked]:translate-x-5";
  return (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ variant, size }), className)}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none size-5 rounded-full bg-background text-primary shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 flex items-center justify-center p-1",
          notchSize,
          notchPosition
        )}
      >
        {thumb}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
