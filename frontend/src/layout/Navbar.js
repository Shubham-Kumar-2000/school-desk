/* eslint-disable @next/next/no-img-element */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginContext from "@/context/LoginContext";
import TranslationContext from "@/context/TranslationContext";
import { logout } from "@/utils/CookieManager";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BiLogOut, BiSolidUserCircle, BiUser } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import Translations from "@/context/Translations.json";
import { FaRegHandPointRight } from "react-icons/fa6";

const menu = [
  { name: "Announcements", url: "/announcements" },
  { name: "My_Questions", url: "/questions" },
];

const Navbar = () => {
  const { loggedIn, userData } = useContext(LoginContext);
  const { preferredLanguage } = useContext(TranslationContext);
  const [navbar, setNavbar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsModalOpen(false);
  }, [loggedIn]);

  const handleLogin = () => {
    setIsModalOpen(true);
  };

  const handleProfileNav = () => {
    router.push("/profile");
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
    window.location.href = "/";
  };

  return (
    userData && (
      <nav className="w-full bg-clr-background border-b shadow sticky top-0 z-[1]">
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div>
            <div className="flex items-center justify-between py-2 md:block">
              <Link href="/" className="">
                <div className="avatar">
                  <div className="w-28 rounded">
                    <img src="/icons/icon-32x32.png" alt="logo" />
                  </div>
                </div>
              </Link>
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                      onClick={() => setNavbar(!navbar)}
                    >
                      {navbar ? (
                        <RxCross1 className=" text-xl" />
                      ) : (
                        <AiOutlineMenu className=" text-xl" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>
                      {Translations["Welcome"][preferredLanguage]}{" "}
                      {userData ? userData.name : ""}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {menu.map(({ name, url }, index) => (
                        <DropdownMenuItem
                          key={index}
                          className="cursor-pointer"
                          onClick={() => router.push(url)}
                        >
                          <FaRegHandPointRight />
                          <span className="ml-2">
                            {Translations[name][preferredLanguage]}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleProfileNav()}
                      >
                        <BiUser />
                        <span className="ml-2">
                          {Translations["Profile"][preferredLanguage]}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleLogout()}
                    >
                      <BiLogOut />
                      <span className="ml-2">
                        {Translations["Logout"][preferredLanguage]}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 hidden`}
            >
              <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                {menu.map(({ name, url }, index) => (
                  <li
                    key={index}
                    className="cursor-pointer"
                    onClick={() => {
                      setNavbar(!navbar);
                      router.push(url);
                    }}
                  >
                    <p>{Translations[name][preferredLanguage]}</p>
                  </li>
                ))}
                {!loggedIn ? (
                  <button
                    className="px-6 py-1 font-semibold hover:bg-red-500 border-red-400 cursor-pointer text-black hover:text-white border-[2px] transition duration-700 rounded-md  shadow transform active:scale-95 hover:transition-transform "
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="cursor-pointer">
                        <div className="w-8 cursor-pointer rounded-md shadow-sm">
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}&randomizeIds=true&backgroundType=solid`}
                            alt="avatar"
                            className="rounded-full shadow-md"
                          />
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>
                        {Translations["Welcome"][preferredLanguage]}{" "}
                        {userData ? userData.name : ""}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleProfileNav()}
                        >
                          <BiUser />
                          <span className="ml-2">
                            {Translations["Profile"][preferredLanguage]}
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleLogout()}
                      >
                        <BiLogOut />
                        <span className="ml-2">
                          {Translations["Logout"][preferredLanguage]}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    )
  );
};

export default Navbar;
