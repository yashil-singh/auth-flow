import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState, type PropsWithChildren } from "react";
import { useLogout } from "@/services/auth/mutations";
import useAuthStore from "@/lib/stores/authStore";

const LogoutConfirmation = ({ children }: PropsWithChildren) => {
  const logoutMutation = useLogout();
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const [logoutAlertOpen, setLogoutAlertOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogout = async () => {
    setIsLoggingOut(true);
    const result = await logoutMutation.mutateAsync();
    if (result?.message) {
      logoutUser();
    }
    setLogoutAlertOpen(false);
    setIsLoggingOut(false);
  };

  return (
    <AlertDialog open={logoutAlertOpen} onOpenChange={setLogoutAlertOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout? You will have to re-enter your
            email and password to login again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            loadingLabel="Logging out"
            loading={isLoggingOut}
            onClick={onLogout}
            variant="destructive"
          >
            Logout
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutConfirmation;
