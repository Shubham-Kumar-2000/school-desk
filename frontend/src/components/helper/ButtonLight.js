import React from "react";
import { cn } from "@/lib/utils";

export const ButtonLight = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "comfortaa-family bg-white px-4 py-2 shadow-sm rounded-lg cursor-pointer hover:shadow-md transition-all ease-in-out",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
