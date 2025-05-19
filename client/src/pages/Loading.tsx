import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <p className="flex items-center gap-2">
        <Loader2 className="animate-spin" /> Loading
      </p>
    </div>
  );
};

export default Loading;
