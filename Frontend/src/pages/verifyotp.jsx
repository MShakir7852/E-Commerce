
import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Get email from localStorage
  const useremail = localStorage.getItem("email");

  const handleVerify = async () => {
    if (!useremail) {
      toast.error("Email not found. Please request OTP again.");
      navigate("/forget-password");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`http://localhost:3000/api/auth/otp-verify/${useremail}`, {
        otp,
      });


      if (res.status === 200) {
        localStorage.setItem("useremail", useremail);

        toast.success(res.data.message);
        navigate(`/new-password/${useremail}`);
      }
    } catch (error) {
      console.log("OTP Verification Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!useremail) {
      toast.error("Email not found. Please enter your email again.");
      navigate("/forget-password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/auth/forget-password",
        {
          email: useremail,
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message || "OTP sent again.");
        navigate("/new-password");
        setOtp("");
      }
    } catch (error) {
      console.log("Resend OTP Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-pink-200 min-h-screen">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>

          <CardDescription>
            Enter the verification code we sent to your email address:{" "}
            <span className="font-medium">{useremail}</span>.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="otp-verification">
                Verification code
              </FieldLabel>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResend}
                disabled={loading}
              >
                <RefreshCwIcon className="mr-1 h-4 w-4" />
                Resend Code
              </Button>
            </div>

            <InputOTP
              maxLength={6}
              id="otp-verification"
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={loading}
            >
              <InputOTPGroup
                className="
                  *:data-[slot=input-otp-slot]:h-12
                  *:data-[slot=input-otp-slot]:w-11
                  *:data-[slot=input-otp-slot]:text-xl
                "
              >
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>

              <InputOTPSeparator className="mx-2" />

              <InputOTPGroup
                className="
                  *:data-[slot=input-otp-slot]:h-12
                  *:data-[slot=input-otp-slot]:w-11
                  *:data-[slot=input-otp-slot]:text-xl
                "
              >
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <FieldDescription>
              I no longer have access to this email address.
            </FieldDescription>
          </Field>
        </CardContent>

        <CardFooter>
          <Field>
            <Button
              type="button"
              className="w-full"
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>

            <div className="text-sm text-muted-foreground">
              Having trouble signing in?{" "}
              <span className="underline underline-offset-4 cursor-pointer">
                Contact support
              </span>
            </div>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}

export default VerifyOTP;
