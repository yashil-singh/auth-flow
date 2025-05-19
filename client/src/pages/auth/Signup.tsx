import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { SignupFormValues } from "@/services/auth/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupFormSchema } from "@/lib/schemas/authSchemas";
import { useSignup } from "@/services/auth/mutations";
import SignupForm from "@/components/forms/auth/SignupForm";
import Brand from "@/components/shared/Brand";

const Signup = () => {
  const form = useForm<SignupFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signupFormSchema),
  });

  const signup = useSignup();

  const onSignup = async (values: SignupFormValues) => {
    await signup.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <>
      <Card className="max-w-[450px] w-full">
        <Brand className="mb-4 mx-auto" />

        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            Enter your name, email and password to create a new account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm form={form} onSubmit={onSignup} />
        </CardContent>
        <span className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="underline text-primary">
            Login
          </Link>
        </span>
      </Card>
    </>
  );
};

export default Signup;
