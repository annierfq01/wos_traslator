import * as React from 'react';
import { lang } from "../language";
import { LangContext } from "../components/barHeather";
import Footer from '../components/footer';

export default function About(){
    const language = React.useContext(LangContext);

    return(
        <div className='w-full h-full'>
            <div className=" w-full bg-[url('waveSup.svg')] h-40 mt-[-2rem]"/>
            <div className='w-full h-full mx-6 my-4 text-justify'>
                {lang[language].about.map(item=>{
                    return(
                        <div className='mb-8'>
                            <h2 className='mb-2 font-semibold'>{item.title}</h2>
                            <p className='max-w-full text-clip mr-12'>{item.content}</p>
                        </div>
                    )
                })}
            </div>
            <Footer/>
        </div>
    )
}