import isAuth from "@/context/isAuth";
import React from "react";
import {Questions as QuestionsComp} from "@/components/custom/Questions";

const Questions = () => {
  return <div><QuestionsComp /></div>
};

export default isAuth(Questions);
