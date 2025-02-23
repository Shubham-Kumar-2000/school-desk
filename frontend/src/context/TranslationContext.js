import { createContext, useContext, useEffect, useState } from "react";
import LoginContext from "./LoginContext";

const TranslationContext = createContext();
export default TranslationContext;


export const TranslationProvider = ({ children }) => {
    const [preferredLanguage, setPreferredLanguage] = useState("");
    const {userData} = useContext(LoginContext);



    const handleLanguageChange = (language) => {
        setPreferredLanguage(language);
    };

    useEffect(() => {
        console.log("Language changed to", preferredLanguage);
    }, [preferredLanguage]);

    useEffect(() => {
        if(userData){
            setPreferredLanguage(userData.preferredLanguage);
        }
    }, [userData])

    return (
        <TranslationContext.Provider
            value={{
                preferredLanguage,
                handleLanguageChange,
            }}
        >
            {children}
        </TranslationContext.Provider>
    );
};
