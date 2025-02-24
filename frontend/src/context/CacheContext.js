import { FormalLoader } from "@/components/helper/FormalLoader";
import { addUserData, getUserData, initDB, Stores } from "@/DB/Init";
import {
  fetchQuestions,
  fetchStudentNotifications,
  fetchUserData,
} from "@/requests/ApiServices";

const { createContext, useEffect, useState } = require("react");

const CacheContext = createContext();
export default CacheContext;

export const CacheProvider = ({ children }) => {
  const [isDBReady, setIsDBReady] = useState(false);

  const fetchUserDataWithCache = async () => {
    let data = null;
    if (navigator.onLine) {
      let response = await fetchUserData();
      console.log("fetchUserDataWithCache", response);
      if (!response.data.err) {
        try {
          const res = await addUserData(
            Stores.SchoolDesK,
            { ...response.data },
            "userData"
          );
        } catch (err) {
          if (err instanceof Error) {
            console.log("fetchUserData", err);
          } else {
            console.log("fetchUserData", err);
          }
        }
      }
      return response;
    } else {
      const users = await getUserData(Stores.SchoolDesK, "userData");
      console.log("fetchUserDataWithCache", users);
    }
  };

  const fetchAnnouncementsWithCache = async (params) => {
    let data = null;
    if (navigator.onLine) {
      let response = await fetchStudentNotifications(params);
      console.log("fetchAnnouncementsWithCache", response);
      if (!response.data.err) {
        try {
          const res = await addUserData(
            Stores.SchoolDesK,
            { ...response.data },
            "announcements"
          );
        } catch (err) {
          if (err instanceof Error) {
            console.log("fetchAnnouncements", err);
          } else {
            console.log("fetchAnnouncements", err);
          }
        }
      }
      return response;
    } else {
      const announcements = await getUserData(
        Stores.SchoolDesK,
        "announcements"
      );
      console.log("fetchAnnouncementsWithCache", announcements);
      return {
        data: { ...announcements },
        offLine: true,
      };
    }
  };

  const fetchQuestionWithCache = async (params) => {
    let data = null;
    if (navigator.onLine) {
      let response = await fetchQuestions(params);
      console.log("fetchQuestionWithCache", response);
      if (!response.data.err) {
        try {
          const res = await addUserData(
            Stores.SchoolDesK,
            { ...response.data },
            "questions"
          );
        } catch (err) {
          if (err instanceof Error) {
            console.log("fetchQuestion", err);
          } else {
            console.log("fetchQuestion", err);
          }
        }
      }
      return response;
    } else {
      const questions = await getUserData(Stores.SchoolDesK, "questions");
      console.log("fetchQuestionWithCache", questions);
      return {
        data: { ...questions },
        offLine: true,
      };
    }
  };

  useEffect(() => {
    handleInitDB();
  }, []);

  const handleInitDB = async () => {
    const status = await initDB();
    console.log("handleInitDB", status);
    setIsDBReady(status);
  };

  return (
    <CacheContext.Provider
      value={{
        fetchUserDataWithCache,
        fetchAnnouncementsWithCache,
        fetchQuestionWithCache,
      }}
    >
      {isDBReady ? children : <FormalLoader />}
    </CacheContext.Provider>
  );
};
