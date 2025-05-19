import LogoutConfirmation from "@/components/dialogs/LogoutConfirmation";
import { Button } from "@/components/ui/button";
import useAuthStore, { selectUser } from "@/lib/stores/authStore";
import { LogOut, RotateCw } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { VerifyAccountFormValues } from "@/services/auth/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyAccountSchema } from "@/lib/schemas/authSchemas";
import { useResendVerification, useVerify } from "@/services/auth/mutations";

const VerifyAccount = () => {
  const user = useAuthStore(selectUser);
  const resendOn = useAuthStore((state) => state.verificationResendOn);
  const setResendOn = useAuthStore((state) => state.setVerificationResendOn);

  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const form = useForm<VerifyAccountFormValues>({
    defaultValues: {
      token: "",
    },
    resolver: zodResolver(verifyAccountSchema),
  });

  const verifyAccountMutation = useVerify();
  const resendVerificationMutation = useResendVerification();

  const onVerify = async (values: VerifyAccountFormValues) => {
    await verifyAccountMutation.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const handleResend = async () => {
    await resendVerificationMutation.mutateAsync(undefined, {
      onSuccess: () => {
        setResendOn(new Date(Date.now() + 60 * 1000));
      },
    });
  };

  useEffect(() => {
    if (!resendOn) return;

    const target = new Date(resendOn).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((target - now) / 1000));
      setRemainingSeconds(diff);

      if (diff === 0) {
        setResendOn(null);
      }
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [resendOn, setResendOn]);

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4 p-4">
      <h1 className="text-2xl font-black text-center">Verify Account</h1>

      <div className="max-w-md text-center space-y-8">
        <p>
          A 6-digit code has been sent to `
          <b>
            <i>{user?.email}</i>
          </b>
          `. If you cannot find it, please check your spam folders or request a
          new one.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onVerify)} className="space-y-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="flex-1">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            className="flex-1 aspect-square h-fit sm:text-xl"
                            index={index}
                            aria-invalid={!!fieldState.error}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              loadingLabel="Verifying"
              disabled={resendVerificationMutation.isPending}
              loading={form.formState.isSubmitting}
              className="w-full"
            >
              Verify
            </Button>
          </form>
        </Form>

        <div className="w-full flex items-center gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleResend}
            loadingLabel="Resending"
            loading={resendVerificationMutation.isPending}
            disabled={remainingSeconds > 0 || form.formState.isSubmitting}
          >
            {remainingSeconds > 0 ? (
              `Resend in ${remainingSeconds}s`
            ) : (
              <>
                Resend
                <RotateCw />
              </>
            )}{" "}
          </Button>
          <LogoutConfirmation>
            <Button className="flex-1" variant="destructive">
              Logout <LogOut />
            </Button>
          </LogoutConfirmation>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
