import { cn } from "@/lib/utils";
import { Workflow } from "lucide-react";

const Brand = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 w-fit text-primary",
        className
      )}
    >
      <Workflow />
      <h1 className="font-black text-xl">Auth-Flow</h1>
    </div>
  );
};

export default Brand;
