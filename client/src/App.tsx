import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Toaster } from "./components/ui/sonner";
import { useMe } from "./services/auth/queries";
import { useEffect } from "react";
import useAuthStore from "./lib/stores/authStore";
import Loading from "./pages/Loading";
import useThemeStore, { selectTheme } from "./lib/stores/themeStore";

function App() {
  const theme = useThemeStore(selectTheme);
  const isLightMode = theme === "light";

  const setUser = useAuthStore((state) => state.setUser);
  const { data, isPending } = useMe();

  useEffect(() => {
    if (data) {
      setUser(data.data);
    }
  }, [data, setUser]);

  useEffect(() => {
    const root = window.document.documentElement;

    if (isLightMode) {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  }, [isLightMode]);

  if (isPending) return <Loading />;

  return (
    <>
      <RouterProvider router={router} />
      <Toaster theme={theme} richColors closeButton />
    </>
  );
}

export default App;
