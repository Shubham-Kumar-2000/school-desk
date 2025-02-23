import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import LoginContext from "./LoginContext";
import Navbar from "@/layout/Navbar";
import { getStudentId } from "@/utils/CookieManager";
import { Chat } from "@/components/custom/Chat";

export default function isAuth(Component) {
  return function IsAuth(props) {
    const { loggedIn } = useContext(LoginContext);
    const { push } = useRouter();

    useEffect(() => {
      if (!loggedIn) {
        push("/auth");
      } else if (loggedIn) {
        if (!getStudentId()) {
          push("/profile");
        }
      }
    }, []);

    if (!loggedIn) {
      return null;
    }

    return (
      <>
        <Navbar />
        <Component {...props} />
        <Chat />
      </>
    )
  };
}
