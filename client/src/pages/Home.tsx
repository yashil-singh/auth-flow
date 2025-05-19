import useAuthStore, { selectUser } from "@/lib/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATE_FORMAT } from "@/lib/constants";
import { format } from "date-fns";
import ThemeToggler from "@/components/shared/ThemeToggler";
import LogoutConfirmation from "@/components/dialogs/LogoutConfirmation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Brand from "@/components/shared/Brand";

const Home = () => {
  const user = useAuthStore(selectUser);

  return (
    <div className="flex items-center justify-center flex-col h-screen gap-4">
      <Brand className="mb-4" />

      <i className="text-muted-foreground">Logged In as:</i>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Avatar className="size-12">
            <AvatarFallback className="animate-pulse w-full h-full"></AvatarFallback>
            <AvatarImage src="https://avatar.iran.liara.run/public/boy" />
          </Avatar>
          <span>
            <b>
              <i>{user?.name}</i>
            </b>
            <p>
              <i>{user?.email}</i>
            </p>
          </span>
        </div>

        <LogoutConfirmation>
          <Button variant="outline" size="icon">
            <LogOut />
          </Button>
        </LogoutConfirmation>
      </div>

      <i className="text-sm text-muted-foreground">
        Joined {format(new Date(user?.createdAt ?? ""), DATE_FORMAT)}.
      </i>

      <ThemeToggler />
    </div>
  );
};

export default Home;
