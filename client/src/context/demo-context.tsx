import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DemoContextType {
  isDemo: boolean;
  setIsDemo: (value: boolean) => void;
  exitDemo: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(() => {
    // Check URL params on initial load
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("demo") === "true") {
        sessionStorage.setItem("aio-demo-mode", "true");
        return true;
      }
      // Check session storage for persisted demo state
      return sessionStorage.getItem("aio-demo-mode") === "true";
    }
    return false;
  });

  useEffect(() => {
    // Check URL on mount and whenever URL changes
    const checkDemoParam = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("demo") === "true") {
        setIsDemo(true);
        sessionStorage.setItem("aio-demo-mode", "true");
      }
    };

    checkDemoParam();
    window.addEventListener("popstate", checkDemoParam);
    return () => window.removeEventListener("popstate", checkDemoParam);
  }, []);

  const exitDemo = () => {
    setIsDemo(false);
    sessionStorage.removeItem("aio-demo-mode");
  };

  return (
    <DemoContext.Provider value={{ isDemo, setIsDemo, exitDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo(): DemoContextType {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}
