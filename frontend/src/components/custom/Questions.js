import { fetchQuestions } from "@/requests/ApiServices";
import React, { forwardRef, useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Volume2, X } from "lucide-react";
import { Dialog, Slide } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Button } from "@/components/ui/button";
import { ChatHistory } from "./ChatHistory";
import TranslationContext from "@/context/TranslationContext";
import Translations from "@/context/Translations.json";
import { FormalLoader } from "../helper/FormalLoader";
import CacheContext from "@/context/CacheContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Questions = () => {
  const { preferredLanguage } = useContext(TranslationContext);
  const { fetchQuestionWithCache } = useContext(CacheContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionSelected, setQuestionSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchQuestionsData();
  }, []);

  const handleChatOpen = (question) => {
    console.log(question);
    setIsChatOpen(true);
    setQuestionSelected(question);
  };

  const fetchQuestionsData = async () => {
    setLoading(true);
    await fetchQuestionWithCache()
      .then((res) => {
        console.log({ res });
        if (!res.data.err && !res.offLine) {
          setQuestions(res.data.questions);
        } else {
          if (res.offLine) {
            console.log("working in offline mode");
            setQuestions(res.data.questions);
          }
        }
      })
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    setIsChatOpen(false);
    setQuestionSelected(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {Translations["My_Questions"][preferredLanguage]}
      </h2>
      <div className="space-y-4">
        {loading ? (
          <FormalLoader />
        ) : questions.length === 0 ? (
          <div>
            <h2 className="text-2xl font-bold m-auto text-center opacity-75 mt-8">
              {Translations["No questions asked yet!"][preferredLanguage]}
            </h2>
          </div>
        ) : (
          questions.map((question) => (
            <Card
              key={question._id}
              className="py-2 shadow-md border rounded-lg"
              onClick={() => handleChatOpen(question)}
            >
              <CardContent className="flex flex-col gap-3">
                <div>
                  <h3 className="text-lg font-semibold break-all">
                    {question.question}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-gray-500">
                  <MessageCircle className="w-5 h-5 cursor-pointer hover:text-gray-700" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {questionSelected && (
        <Dialog
          open={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          fullScreen={fullScreen}
          className="bg-transparent w-full"
          disableEscapeKeyDown
        >
          <ChatHistory question={questionSelected} handleClose={handleClose} />
        </Dialog>
      )}
    </div>
  );
};
