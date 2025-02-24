import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoginContext from "@/context/LoginContext";
import TranslationContext from "@/context/TranslationContext";
import { fetchUserData, updateSettings } from "@/requests/ApiServices";
import {
  clearStudentId,
  getStudentId,
  setStudentId,
} from "@/utils/CookieManager";
import { CircularProgress, Dialog, Slide } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useState } from "react";
import Translations from "@/context/Translations.json";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Profile = () => {
  const {
    userData: user,
    currentStudent,
    setCurrentStudent,
    setUserData,
  } = useContext(LoginContext);
  const { handleLanguageChange, preferredLanguage } =
    useContext(TranslationContext);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [language, setLanguage] = useState("");
  const [sms, setSms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getStudentId()) {
      setShowProfileSelector(true);
    }
    if (user) {
      setLanguage(user.preferredLanguage);
      setSms(user.notificationSettings.sms);
      handleLanguageChange(user.preferredLanguage);
    } else {

    }
  }, [user]);

  const setLanguageValue = (value) => {
    setLanguage(value);
  };

  const handleChange = (event) => {
    setSms(event.target.checked);
  };

  const handleClose = () => {
    setShowProfileSelector(false);
  };

  const handleListItemClick = (data) => {
    if (getStudentId()) {
      clearStudentId();
    }
    setStudentId(data._id);
    setCurrentStudent(data);
    setShowProfileSelector(false);
  };

  const handleSave = async () => {
    setLoading(true);
    const body = {
      preferredLanguage: language,
      notificationSettings: {
        sms,
      },
    };

    try {
      const response = await updateSettings(body);
      if (response) {
        if (!response.data.err) {
          const userData = await fetchUserData();
          if (userData && !userData.data.err) {
            setUserData(userData.data.user);
            handleLanguageChange(language);
          }
          setLoading(false);
        }
      }
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  };

  return (
    <>
      {showProfileSelector && (
        <Dialog
          maxWidth="1024px"
          open={showProfileSelector}
          onClose={handleClose}
          TransitionComponent={Transition}
          className="bg-transparent w-full"
          disableEscapeKeyDown
          disableBackdropClick
        >
          <div className="p-4">
            <p className="text-lg text-clr-foreground font-semibold">
              {Translations["Select_Student"][preferredLanguage]}
            </p>
            <div className="flex flex-wrap">
              {user.students.map((data) => (
                <div key={data._id}>
                  <div
                    onClick={() => handleListItemClick(data)}
                    className="flex items-center justify-center flex-col gap-4 p-4 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="lg:w-10 w-8 cursor-pointer rounded-md shadow-sm">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${data.name}&randomizeIds=true&backgroundType=solid`}
                        alt="avatar"
                        className="rounded-full shadow-md"
                      />
                    </div>
                    <p className="text-clr-secondary text-center">
                      {data.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Dialog>
      )}
      <div className="lg:p-8 md:p-8 px-4 py-8 lg:text-base md:text-base text-sm text-clr-secondary ">
        <div className="lg:w-3/4 md:w-3/4 w-full mx-auto shadow-sm relative gap-4 flex items-start justify-between lg:flex-row md:flex-col flex-col bg-slate-100">
          <div className="flex lg:items-center md:items-start items-start justify-between lg:flex-row md:flex-col flex-col px-8 py-4 rounded-md ">
            <div className="flex items-start gap-4">
              <div className="lg:flex items-start gap-4 hidden">
                <div className="lg:w-10 w-8 cursor-pointer rounded-md shadow-sm">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&randomizeIds=true&backgroundType=solid`}
                    alt="avatar"
                    className="rounded-full shadow-md"
                  />
                </div>
              </div>
              <div>
                <p className="text-lg text-clr-accent mb-4">
                  {Translations["Guardian's_details"][preferredLanguage]}
                </p>
                <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
                {user.email && (
                  <p className="mb-2">
                    <strong>{Translations["Email"][preferredLanguage]}:</strong>{" "}
                    {user.email}
                  </p>
                )}
                <p className="mb-2">
                  <strong>{Translations["Phone"][preferredLanguage]}</strong>{" "}
                  {user.phone}
                </p>
                <p className="mb-2">
                  <strong>
                    {Translations["Date_of_Birth"][preferredLanguage]}:
                  </strong>{" "}
                  {new Date(user.dob).toLocaleDateString()}
                </p>
                <p className="mb-2">
                  <strong>{Translations["Address"][preferredLanguage]}:</strong>
                  {user.address.address}, {user.address.city},{" "}
                  {user.address.state}, {user.address.pincode},{" "}
                  {user.address.country}
                </p>

                <p className="mb-2">
                  <strong>
                    {Translations["Identity Type"][preferredLanguage]}:
                  </strong>{" "}
                  {user.identityType}
                </p>
                <p className="mb-2">
                  <strong>
                    {Translations["Identity Number"][preferredLanguage]}:
                  </strong>{" "}
                  {user.identityNumber}
                </p>
              </div>
            </div>
          </div>
          <div className="px-8 py-4 rounded-md ">
            <p className="text-lg text-clr-accent mb-4 lg:text-right">
              {Translations["Settings"][preferredLanguage]}
            </p>
            <div>
              <Label>
                {Translations["Preferred_Language"][preferredLanguage]}
              </Label>
              <Select
                value={language}
                onValueChange={setLanguageValue}
                className="bg-clr-background"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="cursor-pointer">
                  <SelectItem value="Sanskrit" className="cursor-pointer">
                    Sanskrit
                  </SelectItem>
                  <SelectItem value="Odia" className="cursor-pointer">
                    Odia
                  </SelectItem>
                  <SelectItem value="Kashmiri" className="cursor-pointer">
                    Kashmiri
                  </SelectItem>
                  <SelectItem value="Dogri" className="cursor-pointer">
                    Dogri
                  </SelectItem>
                  <SelectItem value="Gujarati" className="cursor-pointer">
                    Gujarati
                  </SelectItem>
                  <SelectItem value="Kannada" className="cursor-pointer">
                    Kannada
                  </SelectItem>
                  <SelectItem value="Urdu" className="cursor-pointer">
                    Urdu
                  </SelectItem>
                  <SelectItem value="Hindi" className="cursor-pointer">
                    Hindi
                  </SelectItem>
                  <SelectItem value="Nepali" className="cursor-pointer">
                    Nepali
                  </SelectItem>
                  <SelectItem value="Sindhi" className="cursor-pointer">
                    Sindhi
                  </SelectItem>
                  <SelectItem value="Tamil" className="cursor-pointer">
                    Tamil
                  </SelectItem>
                  <SelectItem value="Telugu" className="cursor-pointer">
                    Telugu
                  </SelectItem>
                  <SelectItem value="Konkani" className="cursor-pointer">
                    Konkani
                  </SelectItem>
                  <SelectItem value="Punjabi" className="cursor-pointer">
                    Punjabi
                  </SelectItem>
                  <SelectItem value="Bodo" className="cursor-pointer">
                    Bodo
                  </SelectItem>
                  <SelectItem value="Bengali" className="cursor-pointer">
                    Bengali
                  </SelectItem>
                  <SelectItem value="Marathi" className="cursor-pointer">
                    Marathi
                  </SelectItem>
                  <SelectItem value="Maithili" className="cursor-pointer">
                    Maithili
                  </SelectItem>
                  <SelectItem value="English" className="cursor-pointer">
                    English
                  </SelectItem>
                  <SelectItem value="Malayalam" className="cursor-pointer">
                    Malayalam
                  </SelectItem>
                  <SelectItem value="Assamese" className="cursor-pointer">
                    Assamese
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center my-2">
              <Switch
                checked={sms}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
              <Label htmlFor="airplane-mode">
                {Translations["Enable_SMS_notification"][preferredLanguage]}
              </Label>
            </div>

            <div className="flex lg:flex-row-reverse w-full">
              <Button
                className="w-1/2 bg-clr-foreground rounded-md hover:bg-clr-foreground"
                onClick={handleSave}
                disabled={loading}
              >
                <span className="flex items-center justify-center gap-4 w-full">
                  {loading && (
                    <CircularProgress size={20} disableShrink color="inherit" />
                  )}
                  {Translations["Save"][preferredLanguage]}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {currentStudent && (
        <div className="lg:p-8 md:p-8 px-4 py-8 lg:text-base md:text-base text-sm text-clr-secondary">
          <div className="lg:w-3/4 md:w-3/4 w-full bg-slate-100 mx-auto px-8 py-4 rounded-md shadow-sm my-4">
            <div>
              <p className="text-lg text-clr-accent">
                {Translations["Student's_profiles"][preferredLanguage]}
              </p>
              <div className="flex items-start flex-col">
                <div className="flex items-start justify-center flex-row gap-4 p-4 cursor-pointer hover:bg-gray-100">
                  <div className="lg:w-10 w-8 cursor-pointer rounded-md shadow-sm">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentStudent.name}&randomizeIds=true&backgroundType=solid`}
                      alt="avatar"
                      className="rounded-full shadow-md"
                    />
                  </div>
                  <p className="text-2xl text-center text-clr-secondary">
                    {currentStudent.name}
                  </p>
                </div>
                <div>
                  <p className="mb-2">
                    <strong>
                      {Translations["Roll_number"][preferredLanguage]}:
                    </strong>{" "}
                    {currentStudent.rollNo}
                  </p>
                  <p className="mb-2">
                    <strong>
                      {Translations["Current_class"][preferredLanguage]}:
                    </strong>{" "}
                    {currentStudent.currentClassData.name}
                  </p>
                  <p className="mb-2">
                    <strong>
                      {Translations["Date_of_Birth"][preferredLanguage]}:
                    </strong>{" "}
                    {new Date(currentStudent.dob).toLocaleDateString()}
                  </p>
                  {currentStudent.gender && (
                    <p className="mb-2">
                      <strong>
                        {Translations["Gender"][preferredLanguage]}:
                      </strong>{" "}
                      {currentStudent.gender === "MALE" ? "Male" : "Female"}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <p className="text-lg text-clr-accent">
              {Translations["Other_profiles"][preferredLanguage]}
            </p>
            <div className="flex flex-wrap">
              {user.students.map((data) => (
                <div
                  key={data._id}
                  className={`${
                    currentStudent._id === data._id ? "hidden" : ""
                  }`}
                >
                  <div
                    onClick={() => handleListItemClick(data)}
                    className="flex items-center justify-center flex-col gap-4 p-4 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="lg:w-7 w-6 cursor-pointer rounded-md shadow-sm">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${data.name}&randomizeIds=true&backgroundType=solid`}
                        alt="avatar"
                        className="rounded-full shadow-md"
                      />
                    </div>
                    <p className="text-xs text-center text-clr-accent">
                      {data.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
