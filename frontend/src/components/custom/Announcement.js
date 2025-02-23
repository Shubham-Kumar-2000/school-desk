import { Card, CardContent } from "@/components/ui/card";
import {
  acknowledgeNotification,
  fetchStudentNotifications,
} from "@/requests/ApiServices";
import { MessageCircle } from "lucide-react";
import { forwardRef, useContext, useEffect, useState } from "react";
import { MdOutlineDownloadDone } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FormalLoader } from "../helper/FormalLoader";
import { Dialog, Slide } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AnnouncementQuestions from "./AnnouncementQuestions";
import TranslationContext from "@/context/TranslationContext";
import Translations from "@/context/Translations.json";
import { PiSpeakerHighBold } from "react-icons/pi";
import LangCode from "@/utils/LangCode.json";
import { useSnackbar } from "notistack";
import { NOTICE_TYPES } from "@/utils/Helpers";
import Chip from "@mui/material/Chip";
import { IoMdCloseCircleOutline } from "react-icons/io";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Announcement = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { preferredLanguage } = useContext(TranslationContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [currentNotice, setCurrentNotice] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [page, activeTab]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    await fetchStudentNotifications({
      page,
      noticeType: activeTab === "ALL" ? null : activeTab,
    })
      .then((res) => {
        console.log({ res });
        if (!res.data.err) {
          setAnnouncements(res.data.notices);
          setHasMore(res.data.hasNext);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log({ err });
        setLoading(false);
      });
  };

  const handleAcknowledge = async (id) => {
    console.log({ id });
    try {
      const response = await acknowledgeNotification(id);
      console.log({ response });
      if (!response.data.err) {
        const updatedAnnouncements = announcements.map((announcement) => {
          if (announcement._id === id) {
            return {
              ...announcement,
              targets: { ...announcement.targets, acknowledged: true },
            };
          }
          return announcement;
        });
        setAnnouncements(updatedAnnouncements);
        enqueueSnackbar("Acknowledged Successfully", { variant: "success" });
      }
    } catch (error) {
      console.log({ error });
    }
  };
  const handleClose = () => {
    setCurrentNotice(null);
  };

  const handleCurrentNotice = (notice) => {
    setCurrentNotice(notice);
  };

  const readALoud = (notice) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = notice.title;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    speech.lang = LangCode.languageCodes[preferredLanguage];
    window.speechSynthesis.speak(speech);
    speech.text = notice.description;
    window.speechSynthesis.speak(speech);
  };

  const handleChip = (type) => {
    console.log({ type });
    setActiveTab(type.key);
  };

  const handleResult = (notice) => {
    console.log({ notice });
    if (notice.resultAttachedData) {
      setResults(notice.resultAttachedData);
    }
  };

  return (
    <>
      {currentNotice && (
        <Dialog
          open={currentNotice ? true : false}
          onClose={handleClose}
          TransitionComponent={Transition}
          fullScreen={fullScreen}
          className="bg-transparent w-full"
          disableEscapeKeyDown
        >
          <AnnouncementQuestions
            notice={currentNotice}
            handleClose={handleClose}
          />
        </Dialog>
      )}
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">
          {Translations["Announcements"][preferredLanguage]}
        </h2>
        <div className="flex gap-2 flex-wrap">
          {NOTICE_TYPES.map((type) => (
            <Chip
              label={`${Translations[type.value][preferredLanguage]}`}
              variant={activeTab === type.key ? "filled" : "outlined"}
              onClick={() => handleChip(type)}
            />
          ))}
        </div>
        <div className="space-y-4">
          {loading ? (
            <FormalLoader />
          ) : (
            <div>
              {announcements.length === 0 ? (
                <div>
                  <h2 className="text-2xl font-bold m-auto text-center opacity-75 mt-8">
                    {
                      Translations[
                        "No notifications available at the moment. Please check back later."
                      ][preferredLanguage]
                    }
                  </h2>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <Card
                    key={announcement._id}
                    className="p-4 shadow-md border rounded-lg my-2"
                  >
                    <CardContent className="flex flex-col gap-3">
                      {announcement.image && (
                        <img
                          src={announcement.image}
                          alt={announcement.title}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold break-all">
                          {announcement.title}
                        </h3>
                        <p className="text-gray-600 break-all">
                          {announcement.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500">
                        <Tooltip>
                          <TooltipTrigger>
                            <PiSpeakerHighBold
                              className="w-5 h-5 cursor-pointer hover:text-gray-700"
                              onClick={() => readALoud(announcement)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Read A Loud</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <MessageCircle
                              className="w-5 h-5 cursor-pointer hover:text-gray-700"
                              onClick={() => handleCurrentNotice(announcement)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ask Question</p>
                          </TooltipContent>
                        </Tooltip>
                        {announcement.targets.acknowledgementRequired &&
                          !announcement.targets.acknowledged && (
                            <Tooltip>
                              <TooltipTrigger>
                                <MdOutlineDownloadDone
                                  className="w-5 h-5 cursor-pointer hover:text-gray-700"
                                  onClick={() =>
                                    handleAcknowledge(announcement._id)
                                  }
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Acknowledge</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        {announcement.resultAttachedData && (
                          <button
                            className="border rounded-md px-2 py-1 bg-gray-400 text-black text-sm cursor-pointer"
                            onClick={() => handleResult(announcement)}
                          >
                            Show Result
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
          {announcements.length > 0 && (
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem onClick={() => setPage(page - 1)}>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink href="#" className="font-semibold">
                    {page}
                  </PaginationLink>
                </PaginationItem>

                {hasMore && (
                  <PaginationItem onClick={() => setPage(page + 1)}>
                    <PaginationNext href="#" />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
      {results && (
        <Dialog
          open={results ? true : false}
          onClose={() => setResults(null)}
          TransitionComponent={Transition}
          fullScreen={fullScreen}
          className="bg-transparent w-full"
          disableEscapeKeyDown
        >
          <div className="p-4 relative">
            <div className="absolute right-2 cursor-pointer">
              <IoMdCloseCircleOutline
                onClick={() => setResults(null)}
                size={30}
              />
            </div>
            <h2 className="text-2xl font-bold mb-4">Exam Results</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Subject</th>
                  <th className="py-2 px-4 border-b">Marks</th>
                  <th className="py-2 px-4 border-b">Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {results.entries.map((entry, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{entry.subject}</td>
                    <td className="py-2 px-4 border-b">{entry.marks}</td>
                    <td className="py-2 px-4 border-b">{entry.totalMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Dialog>
      )}
    </>
  );
};
