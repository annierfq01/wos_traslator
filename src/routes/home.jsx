import * as React from "react";
import Footer from "../components/footer";
import home from '../images/home.jpg';
import { useNavigate } from "react-router-dom";
import { lang } from "../language";
import { LangContext } from "../components/barHeather";

export default function Home() {
  const navigate = useNavigate()
  const language = React.useContext(LangContext);

  return (
    <div className="w-full flex flex-col justify-between">
      <div className=" w-full bg-[url('waveSup.svg')] h-40 mt-[-2rem]"/>
      <div className="mx-8 my-4 flex flex-col justify-between items-center">
        <img src={home} alt="traslayte from wos" className="min-w-40 min-h-40 w-1/5 h-auto"/>
        <p className="text-md">
          {lang[language].home.principal}
        </p>
        <div className="text-white space-x-5">
          <button className=" bg-red-400 h-8 w-20 mt-5 rounded-xl" onClick={()=>{
            navigate('/board/no');
          }}>{lang[language].home.importar}</button>
          <button className="bg-red-400 dark:bg-blue-300 h-8 w-20 mt-5 rounded-xl" onClick={()=>{
            navigate('/board/new');
          }}>{lang[language].home.nuevo}</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
