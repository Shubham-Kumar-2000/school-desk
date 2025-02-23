import { useContext, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginContext from "@/context/LoginContext";
import { CircularProgress } from "@mui/material";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/router";
import { setToken } from "@/utils/CookieManager";

export const Auth = () => {
  const [phoneInputError, setPhoneInputError] = useState();
  const [loader, setLoader] = useState(false);
  const {
    handleOTPInput,
    handleOTPSubmit,
    handleLoginState,
    handleUserStatusState,
    setUserData,
    getLoggedInUserData
  } = useContext(LoginContext);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [value, setValue] = useState("");
  const { push } = useRouter();

  const [phoneNo, setPhoneNo] = useState("");

  const myInput = useRef();

  useEffect(() => {
    myInput?.current?.focus();
  }, [myInput]);

  const handlePhoneNoOnchange = (e) => {
    // console.log({ e });
    setPhoneNo(e.target.value);
    if (phoneInputError) {
      setPhoneInputError(null);
    }
  };

  const handleGetOtp = async () => {
    if (!phoneNo || !(phoneNo && String(phoneNo).length === 10)) {
      setPhoneInputError("Please enter valid mobile number");
      return;
    }
    setLoader(true);
    const data = await handleOTPInput(phoneNo);
    if (data) {
      if (data.success) {
        setShowOTPInput(true);
      } else {
        setPhoneInputError("Please enter valid mobile number");
      }
    } else {
      setPhoneInputError("Its not you! Its us please try after sometime!");
    }
    setLoader(false);
  };

  const handleLogin = async () => {
    if (!value || !(value && String(value).length === 6)) {
      setPhoneInputError("Please enter valid 6 digit OTP.");
      return;
    }
    setLoader(true);
    const data = await handleOTPSubmit(value);
    if (data) {
      if (!data.err) {
        handleLoginState(true);
        setToken(data.token);
        await getLoggedInUserData();
        push("/profile");
      } else {
        setValue("");
        setPhoneInputError("Please enter valid 6 digit OTP.");
      }
    } else {
      setValue("");
      setPhoneInputError("Something went wrong please try again later!");
    }
    setLoader(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 w-full">
      <Card className="bg-clr-background flex flex-col min-w-72">
        <CardHeader>
          <CardTitle className="text-center text-clr-secondary ">
            Welcome to
            <span className="text-clr-foreground"> School-Desk</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Phone number</Label>
            <div className="flex items-center justify-center">
              <div className="w-10 border p-1 rounded-md">+91</div>
              <Input
                type="number"
                placeholder="Enter your phone number"
                autoComplete="off"
                ref={myInput}
                value={phoneNo}
                name="phoneNo"
                onChange={(e) => handlePhoneNoOnchange(e)}
                disabled={showOTPInput}
              />
            </div>
          </div>

          {showOTPInput && (
            <div className="mt-4 mb-2">
              <Label>One-Time Password</Label>
              <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <span className="text-xs text-clr-accent">
                Please enter the one-time password sent to your phone.
              </span>
            </div>
          )}

          <div className="w-full">
            <span className="text-red-500 text-xs">
              {phoneInputError ? phoneInputError : <>&nbsp;</>}
            </span>
          </div>

          <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
            <p>Didn&#39;t recieve code?</p>
            <span
              className="flex flex-row items-center text-blue-600 cursor-pointer"
              onClick={() => handleGetOtp()}
            >
              Resend
            </span>
          </div>

          <div className="mt-2 mb-6">
            {showOTPInput ? (
              <Button
                className="w-full bg-clr-foreground rounded-md hover:bg-clr-foreground"
                onClick={handleLogin}
                disabled={loader}
              >
                <span className="flex items-center justify-center gap-4">
                  {loader && (
                    <CircularProgress size={20} disableShrink color="inherit" />
                  )}
                  Verify OTP
                </span>
              </Button>
            ) : (
              <Button
                className="w-full bg-clr-foreground rounded-md hover:bg-clr-foreground"
                onClick={handleGetOtp}
                disabled={loader}
              >
                <span className="flex items-center justify-center gap-4">
                  {loader && (
                    <CircularProgress size={20} disableShrink color="inherit" />
                  )}
                  Get OTP
                </span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
