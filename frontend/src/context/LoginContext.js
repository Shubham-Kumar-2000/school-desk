import { FormalLoader } from "@/components/helper/FormalLoader";
import { fetchUserData, sendOtp, verifyOtp } from "@/requests/ApiServices";
import { getStudentId, getToken } from "@/utils/CookieManager";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

const LoginContext = createContext();
export default LoginContext;

export const LoginProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [phone, setPhone] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [appLoader, setAppLoader] = useState(true);
  const router = useRouter();

  const handleOTPInput = async (phoneNumber) => {
    setPhone(phoneNumber);
    let data = null;
    await sendOtp({ phone: `+91${phoneNumber}`, resend: false })
      .then((result) => {
        data = result.data;
      })
      .catch((err) => {
        console.log({ err });
        data = null;
      });

    return data;
  };

  const handleOTPSubmit = async (otp) => {
    let data = null;

    await verifyOtp({ phone: `+91${phone}`, otp })
      .then((result) => {
        data = result.data;
      })
      .catch((err) => {
        console.log({ err });
        data = null;
      });

    return data;
  };

  const handlePhoneReset = () => {
    setPhone("");
  };

  const handleLoginState = (currState) => {
    setLoggedIn(currState);
  };

  const getLoggedInUserData = async () => {
    if (getToken()) {
      await fetchUserData()
        .then((res) => {
          if (res.data) {
            let result = res.data;
            if (result.err) {
              if (result.logout) {
                logout();
                window.location.href = "/";
              } else {
                logout();
                router.push("/404");
              }
            } else {
              setUserData(result.user);
              setLoggedIn(true);
              let currentStudentId = getStudentId();
              console.log({ currentStudentId });
              if (!getStudentId()) {
                router.push("/profile");
              } else {
                let currentStudentId = getStudentId();
                let student = result.user.students.find(
                  (student) => student._id === currentStudentId
                );
                setCurrentStudent(student);
              }
            }
          } else {
            router.push("/404");
          }
        })
        .catch((err) => {
          console.log({ err });
          // router.push("/500");
        })
        .finally(() => {
          setAppLoader(false);
        });
    } else {
      if (router.pathname === "/profile") {
        router.push("/").then((res) => setAppLoader(false));
      } else {
        setAppLoader(false);
      }
    }
  };

  useEffect(() => {
    getLoggedInUserData();
  }, []);

  return (
    <LoginContext.Provider
      value={{
        handleOTPInput,
        handleOTPSubmit,
        handlePhoneReset,
        handleLoginState,
        phone,
        loggedIn,
        userData,
        setUserData,
        appLoader,
        currentStudent,
        setCurrentStudent,
        getLoggedInUserData
      }}
    >
      {appLoader ? <FormalLoader /> : children}
    </LoginContext.Provider>
  );
};
