import { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TranslationContext from "@/context/TranslationContext";
import Translations from "@/context/Translations.json";
import { IoMdCloseCircleOutline } from "react-icons/io";

const messages = [];

export const ChatHistory = ({ question, handleClose }) => {
  const [chatMessages, setChatMessages] = useState(messages);
  const { preferredLanguage } = useContext(TranslationContext);
  const [askedQuestion, setAskedQuestion] = useState(null);

  useEffect(() => {
    console.log({ question });
    setChatMessages([]);
    setAskedQuestion(null);
    if (question) {
      setAskedQuestion(question.question);
      if (question.answers && question.answers.length > 0) {
        const answers = [];
        question.answers.forEach((answer) => {
          answers.push({
            id: answer._id,
            name: answer.answeredByAi ? "AI" : question.askedToData.name,
            message: answer.text,
          });
        });

        setChatMessages(answers);
      }
    }
  }, [question]);

  const closeChat = () => {
    handleClose();
  };

  return (
    question && (
      <div className="relative my-auto">
        <div className="w-full max-w-md flex flex-col">
          <div className="absolute right-0 p-4 cursor-pointer">
            <IoMdCloseCircleOutline onClick={() => closeChat()} size={30} />
          </div>
          <div
            style={{
              boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
            }}
            className="bg-white p-4 h-full w-full"
          >
            <div className="flex flex-col space-y-1.5 pb-6">
              <h2 className="font-semibold text-lg tracking-tight">
                {Translations["Ask_Shaila"][preferredLanguage]}
              </h2>
              <p className="text-sm text-[#6b7280] leading-3">
                Powered by Team SSID
              </p>
            </div>
          </div>
          <div className="px-4 flex flex-col min-w-full max-h-[80vh] lg:min-h-[60vh] min-h-[80vh] overflow-y-scroll pb-8">
            <div className="flex gap-3 my-4 text-gray-600 text-sm bg-slate-50 shadow-md p-2 rounded-md">
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                <div className="rounded-full bg-gray-100 border p-1">
                  <svg
                    stroke="none"
                    fill="black"
                    stroke-width="0"
                    viewBox="0 0 16 16"
                    height="20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
                  </svg>
                </div>
              </span>
              <p className="leading-relaxed">
                <span className="block font-bold text-gray-700">
                  {Translations["You"][preferredLanguage]}{" "}
                </span>
                {askedQuestion}
              </p>
            </div>
            {chatMessages.map((chat) =>
              chat.name === "AI" ? (
                <div className="flex gap-3 my-4 text-gray-600 text-sm bg-slate-100 shadow-md p-2 rounded-md">
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                    <div className="rounded-full bg-gray-100 border p-1">
                      <svg
                        stroke="none"
                        fill="black"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        height="20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                        ></path>
                      </svg>
                    </div>
                  </span>
                  <p className="leading-relaxed">
                    <span className="block font-bold text-gray-700">
                      {Translations["Shaila"][preferredLanguage]}{" "}
                    </span>
                    <p className="text-gray-600">{chat.message}</p>
                  </p>
                </div>
              ) : (
                <div className="flex gap-3 my-4 text-gray-600 text-sm bg-slate-50 shadow-md p-2 rounded-md">
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                    <div className="rounded-full bg-gray-100 border p-1">
                      <svg
                        stroke="none"
                        fill="black"
                        stroke-width="0"
                        viewBox="0 0 16 16"
                        height="20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
                      </svg>
                    </div>
                  </span>
                  <p className="leading-relaxed">
                    <span className="block font-bold text-gray-700">
                      {chat.name}{" "}
                    </span>
                    {chat.message}
                  </p>
                </div>
              )
            )}
            {!question.humanAnswered && (
              <div className="flex gap-3 my-4 text-gray-600 text-sm bg-slate-100 shadow-md p-2 rounded-md">
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                  <div className="rounded-full bg-gray-100 border p-1">
                    <svg
                      stroke="none"
                      fill="black"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      height="20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                      ></path>
                    </svg>
                  </div>
                </span>
                <p className="leading-relaxed">
                  <span className="block font-bold text-gray-700">
                    {Translations["Shaila"][preferredLanguage]}{" "}
                  </span>
                  <p className="text-gray-600">
                    {question.askedToData.name}{" "}
                    {
                      Translations[
                        "has not answered yet. Please wait for the response. You will be notified once the response is available."
                      ][preferredLanguage]
                    }
                  </p>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};
