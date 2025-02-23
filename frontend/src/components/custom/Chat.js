import { createQuestion, humanIntervention } from "@/requests/ApiServices";
import { useContext, useEffect, useState } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import TranslationContext from "@/context/TranslationContext";
import Translations from "@/context/Translations.json";



export const Chat = () => {
  const { preferredLanguage } = useContext(TranslationContext);
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState("");
  const [askedQuestion, setAskedQuestion] = useState();
  const [asked, setAsked] = useState(false);
  const [answerAi, setAnswerAi] = useState();
  const [loading, setLoading] = useState(false);
  const [questionId, setQuestionId] = useState();
  const [showHumanIntervention, setShowHumanIntervention] = useState(false);
  const [askedTo, setAskedTo] = useState();
  const [disableSent, setDisableSent] = useState(true);

  useEffect(() => {
    if(!show) {
      // reset every state
      setQuestion("");
      setAskedQuestion("");
      setAsked(false);
      setAnswerAi("");
      setLoading(false);
      setQuestionId("");
      setShowHumanIntervention(false);
      setAskedTo(null);
    }
  }, [show])

  const handleQuestion = (e) => {
    setQuestion(e.target.value);
    if(e && e.target && e.target.value && e.target.value.length > 20) {
      setDisableSent(false);
    } else {
      setDisableSent(true)
    }
  };

  const handleSend = async () => {
    console.log({ question });
    if (!question || question === "") return;
    setAskedQuestion(question);
    setQuestion("");
    setLoading(true);
    setAsked(true);
    try {
      const response = await createQuestion({ question });
      console.log({ response });
      if (!response.data.err) {
        setQuestionId(response.data.question._id);
        let aiAnswer = response.data.question.answers
          ? response.data.question.answers.filter(
              (answer) => answer.answeredByAi
            )[0]
          : { text: "I am not sure about that!", answeredByAi: true };
        setAnswerAi(aiAnswer);
      }
    } catch (error) {
      console.log({ error });
    }
    setLoading(false);
  };

  const handleHumanIntervention = async () => {
    try {
      const response = await humanIntervention(questionId);
      console.log({ response });
      if (!response.data.err) {
        setAskedTo(response.data.question.askedToData);
        setShowHumanIntervention(true);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <button
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-clr-foreground m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 "
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        data-state="closed"
        onClick={() => setShow(!show)}
      >
        {show ? <IoMdClose color="white" size={30} /> : <IoChatbubblesOutline color="white" size={30} />}
      </button>

      {show && (
        <div className="px-4">
          <div
            style={{
              boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
            }}
            className="fixed bottom-[calc(4rem+1.5rem)] right-0 bg-white p-4 rounded-lg border border-[#e5e7eb] w-[80%] lg:w-1/2 lg:h-[500px] md:h-[500px] h-[30rem]"
          >
            <div className="flex flex-col space-y-1.5 pb-6">
              <h2 className="font-semibold text-lg tracking-tight">
                {Translations["Ask_Shaila"][preferredLanguage]}
              </h2>
              <p className="text-sm text-[#6b7280] leading-3">
                Powered by Team SSID
              </p>
            </div>

            <div className="pr-4 flex flex-col min-w-full max-h-80 min-h-80 overflow-y-scroll">
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
                  <span className="block font-bold text-gray-700">{Translations["Shaila"][preferredLanguage]}</span>
                  {Translations["Hi, how can I help you today?"][preferredLanguage]} 
                </p>
              </div>

              {asked && (
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
                    <span className="block font-bold text-gray-700">{Translations["You"][preferredLanguage]}</span>
                    {askedQuestion}
                  </p>
                </div>
              )}

              {asked && (
                <>
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
                      {loading ? `${Translations['Thinking'][preferredLanguage]}...` : answerAi?.text}
                    </p>
                  </div>
                  {answerAi?.answeredByAi && !showHumanIntervention && (
                    <div className="flex justify-between mt-4 flex-col">
                      <span className="block font-bold text-gray-700 text-sm">
                      {Translations["Was this answer helpful? I'm happy to connect you with your student's teacher."][preferredLanguage]}
                        
                      </span>
                      <div className="flex space-x-2 my-2">
                      <button
                          className="bg-green-100 text-clr-secondary px-4 py-2 rounded-md"
                          onClick={() => setShow(false)}
                        >
                          {Translations['Yes'][preferredLanguage]}
                        </button>
                        <button
                          className="bg-red-100 text-clr-secondary px-4 py-2 rounded-md"
                          onClick={handleHumanIntervention}
                        >
                         {Translations['No'][preferredLanguage]}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
              {showHumanIntervention &&
              askedTo && (
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
                    {`${Translations["I have asked"][preferredLanguage]} ${askedTo.name} ${Translations["to help you, once they respond you will be notified."][preferredLanguage]}`}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center pt-4">
              <div className="flex items-center justify-center w-full space-x-2">
                <input
                  className="flex h-10 w-3/4 rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                  placeholder={Translations["Ask your question"][preferredLanguage]}
                  onChange={handleQuestion}
                  name="question"
                  value={question}
                />
                <button
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2 w-1/4"
                  onClick={handleSend}
                  disabled={loading || disableSent}
                >
                  {Translations["Send"][preferredLanguage]}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
