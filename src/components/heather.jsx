import * as React from "react";

export default function Heather(props) {
  return (
    <div>
      <div className="w-full h-40 bg-blue-500 flex justify-center  content-center">
        <div className="w-1/2 h-full flex flex-row mt-3 shadow-lg rounded-lg">
          <img
            src={props.img}
            alt="logo"
            className=" w-1/3 h-full object-cover object-center rounded-l-3xl"
          />
          <label className="w-2/3 h-full flex items-start justify-start text-white p-10">
            <p>{props.children}</p>
          </label>
        </div>
      </div>
      <div className="w-full bg-[url('waveSup.svg')] h-40 mt-[-2rem]"></div>
    </div>
  );
}
