import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { useDemo } from "@/context/demo-context";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { exitDemo } = useDemo();

  const handleLogin = () => {
    exitDemo();
    window.location.href = "/api/login";
  };

  if (dismissed) return null;

  return (
    <div className="bg-primary text-primary-foreground px-4 py-2 text-center text-sm flex items-center justify-center gap-4 shrink-0">
      <span>
        You're viewing AIO Mapper in demo mode with sample data.
      </span>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleLogin}
        data-testid="button-demo-signup"
      >
        Sign Up Free
      </Button>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-primary-foreground/10 rounded"
        data-testid="button-demo-dismiss"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
