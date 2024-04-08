import * as React from "react";
import { IoMenuSharp } from "react-icons/io5";
import { MdDarkMode, MdInfo, MdSettings} from "react-icons/md";
import { SiMicrosoftacademic } from 'react-icons/si'
import {track} from '@vercel/analytics';

import { Outlet, useNavigate } from "react-router-dom";

export const MenuContext = React.createContext(null);
export const LangContext = React.createContext(null);

export default function BarHeather() {
  const [setting, setSetting] = React.useState(false);
  const [isMenu, setIsMenu] = React.useState(false);
  let l = navigator.language.substring(0, 2);
  if (! ["es", "en"].includes(l)){
    l = "en";
  }
  const [language, setLanguage] = React.useState(l);

  const navigate = useNavigate();
  return (
    <LangContext.Provider value={language}>
    <div className="w-full h-full">
      <div className="flex flex-row h-10 w-full items-center justify-between p-5 bg-blue-500 text-white z-50 fixed">
        <IoMenuSharp className="hover:cursor-pointer text-2xl sm:hidden" onClick={()=>{setIsMenu(!isMenu)}}/>
        <div className="flex flex-row space-x-3">
          <SiMicrosoftacademic className="text-2xl" />
          <button onClick={() => navigate("/")}>WoS DB Creator</button>
        </div>
        <div className="flex flex-row space-x-4">
          <MdSettings
            className="hover:cursor-pointer text-2xl"
            onClick={() => setSetting(true)}
          />
          <MdInfo className="hover:cursor-pointer text-2xl" onClick={() => {
            track("About");
            navigate("/about");
            }}/>
          {setting ? (
              <div
                className="w-52 h-52 right-6 backdrop-filter backdrop-blur-md absolute shadow-xl text-black"
                onMouseLeave={() => {
                  setSetting(false);
                }}
              >
                <div className="flex flex-row justify-between mx-3 border-b-2 border-black">
                  <label>Lenguage</label>
                  <MdDarkMode />
                </div>
                <div className="flex flex-col mt-2 text-black">
                  <button onClick={()=>{setLanguage("es")}}>Espanol</button>
                  <button onClick={()=>{setLanguage("en")}}>Ingles</button>
                </div>
              </div>
            ) : null}
        </div>
      </div>
      <div className="h-10 w-full  bg-blue-500 z-50"></div>
      <MenuContext.Provider value={isMenu}>
        <Outlet className="h-full w-full"/>
      </MenuContext.Provider>
      <div className="bg-gray-900 text-white text-sm flex flex-row justify-center">
          <p>Copyright@ Annier J. Fajardo Quesada 2024</p>
      </div>
    </div>
    </LangContext.Provider>
  );
}
