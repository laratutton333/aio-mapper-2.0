import { useAuth } from "@/hooks/use-auth";
import { useDemo } from "@/context/demo-context";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const { isDemo, setIsDemo } = useDemo();

  const checkDemoFromUrlOrStorage = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("demo") === "true") {
        sessionStorage.setItem("aio-demo-mode", "true");
        setIsDemo(true);
        return true;
      }
      if (sessionStorage.getItem("aio-demo-mode") === "true") {
        setIsDemo(true);
        return true;
      }
    }
    return false;
  };

  if (isDemo || checkDemoFromUrlOrStorage()) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/login";
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
