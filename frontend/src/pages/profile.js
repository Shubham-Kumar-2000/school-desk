import isAuth from "@/context/isAuth";
import React, { useEffect, useState } from "react";
import { Profile as ProfileComponent } from "@/components/custom/Profile";



const Profile = () => {
  return (
    <>
      <ProfileComponent />;
    </>
  );
};

export default isAuth(Profile);
