import useAuthStore, {
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
} from "@/lib/stores/authStore";
import Loading from "@/pages/Loading";
import { Navigate, Outlet } from "react-router-dom";

const RootLayout = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore(selectUser);
  const isLoading = useAuthStore(selectIsLoading);

  if (isLoading) return <Loading />;

  if (isAuthenticated && user) {
    if (!user.isVerified) return <Navigate to="/verify" />;
  } else return <Navigate to="/login" />;

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default RootLayout;
