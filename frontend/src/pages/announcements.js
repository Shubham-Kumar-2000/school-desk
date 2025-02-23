import { Announcement as AnnouncementComp } from "@/components/custom/Announcement";
import isAuth from "@/context/isAuth";

const Announcement = () => {
  return <AnnouncementComp />;
};

export default isAuth(Announcement);
