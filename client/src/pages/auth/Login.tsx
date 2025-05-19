import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LoginFormValues } from "@/services/auth/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/lib/schemas/authSchemas";
import { useLogin } from "@/services/auth/mutations";
import { Link } from "react-router-dom";
import LoginForm from "@/components/forms/auth/LoginForm";
import Brand from "@/components/shared/Brand";

const Login = () => {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });

  const login = useLogin();

  const onLogin = async (values: LoginFormValues) => {
    await login.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <Card className="max-w-[450px] w-full">
      <CardHeader>
        <Brand className="mb-4 mx-auto" />
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email and password to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm form={form} onSubmit={onLogin} />
      </CardContent>

      <span className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/signup" className="underline text-primary">
          Signup
        </Link>
      </span>
    </Card>
  );
};

export default Login;
