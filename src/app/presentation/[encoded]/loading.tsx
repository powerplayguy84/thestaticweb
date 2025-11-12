import { Loader2 } from "lucide-react";

export default function PresentationLoading() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Preparing presentation...
        </p>
      </div>
    </div>
  );
}
