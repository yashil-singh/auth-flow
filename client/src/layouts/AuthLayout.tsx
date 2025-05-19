import useAuthStore, {
  selectIsAuthenticated,
  selectIsLoading,
} from "@/lib/stores/authStore";
import Loading from "@/pages/Loading";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore(selectIsLoading);

  if (isLoading) return <Loading />;

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
