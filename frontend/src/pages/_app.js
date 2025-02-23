import RouterLoader from "@/components/helper/RouterLoader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoginProvider } from "@/context/LoginContext";
import { TranslationProvider } from "@/context/TranslationContext";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? "with" : "without"
        } shallow routing`
      );
      setLoading(true);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", () => setLoading(false));
    router.events.on("routeChangeError", () => setLoading(false));

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", () => setLoading(false));
      router.events.off("routeChangeError", () => setLoading(false));
    };
  }, []);
  return (
    <SnackbarProvider maxSnack={3}>
    <LoginProvider>
      <TranslationProvider>
        <TooltipProvider>
          <Component {...pageProps} />;
          {loading ? (
            <div className="fixed top-0 left-0 w-full z-[9999] h-2">
              <RouterLoader />
            </div>
          ) : null}
        </TooltipProvider>
      </TranslationProvider>
    </LoginProvider>
    </SnackbarProvider>
  );
}
