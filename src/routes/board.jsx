import { TextField } from "@mui/material";
import * as React from "react";
import { MdDelete, MdEdit, MdSave } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { SiConvertio } from "react-icons/si";
import { MenuContext, LangContext } from "../components/barHeather";
import { lang } from "../language";
import { addEntryToIndexedDB, deleteKeyFromIndexedDB, getDictFromIndexedDB, saveDictToIndexedDB } from "../database";

function generateRandom(x){
  const n = '1234567890';
  let ret = '';
  for(let i = 0; i < x; i++){
    ret += n[Math.floor(Math.random()*n.length)];
  }
  return ret;
}

function exporter (data){
  let ret = ""
  for(let key in data){
    if(key == "id")continue;

    ret += "PMID- " + generateRandom(8) + "\n";
    ret += "OWN - NLM\nSTAT- MEDLINE\n";
    ret += "DCOM- " + generateRandom(8) + "\n";
    ret += "LR  - " + generateRandom(8) + "\n";
    ret += "IS  - " + generateRandom(4) + "-" + generateRandom(4) + " (Electronic)\n";

    ret += "TI  - " + data[key].title + "\n";
    ret += "AB  - " + data[key].resumen + "\n";
    
    let autor = ""
    for(let i = 0; i < data[key].autors.length; i++){
      autor = data[key].autors[i];
      ret += "FAU - " + autor.name + "\n";
      ret += "AU  - " + autor.name + "\n";
      ret += "AD  - " + autor.institution + "\n";
    }

    ret += "LA  - eng\nPT  - Journal Article\nPT  - Review\n";
    ret += "TA  - " + data[key].res_journal + "\n";
    ret += "JT  - " + data[key].journal + "\n";

    
    let kws = data[key].keywords.replace(/,/g, ';').replace(/ {2}/g, ' ').replace(/; /g, ';').replace(/ ;/g, ';').split(";");
    for(let i = 0; i < kws.length; i++){
      ret += "MH  - " + kws[i] + "\n";
    }


    ret += "\n"; 
  }

  const blob = new Blob([ret], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "DataBase.txt";
  a.click();
  URL.revokeObjectURL(url);
}

export const model = {
  "id": {
    alias: "",
    title: "",
    autors: [],
    resumen: "",
    keywords: "",
    res_journal: "",
    journal: "",
  },
};

export default function Board() {
  const language = React.useContext(LangContext);

  const [data, setData] = React.useState(model);
  const [actual, setActual] = React.useState("id");
  const [alias, setAlias] = React.useState([]);

  const [autors, setAutors] = React.useState(data[actual]["autors"]);
  const [actualAuth, setActualAuth] = React.useState("");
  const [actualInst, setActualInst] = React.useState("");

  const identifier = React.useRef(null);
  const title = React.useRef(null);
  const resume = React.useRef(null);
  const keys = React.useRef(null);
  const journal = React.useRef(null);
  const res_journal = React.useRef(null);

  const autor = React.useRef(null);
  const instit = React.useRef(null);

  React.useEffect(() => {
    autor.current.value = actualAuth;
    instit.current.value = actualInst;
  }, [actualAuth]);

  const handleDeleteAuthor = async (name) => {
    const r = await window.confirm(lang[language].board.del_autor);
    if (!r) return;
    let na = autors.filter((item) => item["name"] !== name);
    setAutors(na);
  };

  const handleSave = () => {
    const file = JSON.stringify(data);
    const blob = new Blob([file], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dictionary.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteEntry = async (id) => {
    const r = await window.confirm(lang[language].board.del_entry);
    if (!r) return;
    delete data[id];
    deleteKeyFromIndexedDB(id);

    let t = [];
    for (let i in data) {
      if (i === "id") continue;
      t.push({ id: i, alias: data[i]["alias"] });
    }
    setAlias(t);
    setActual("id");

  };

  const handelSaveEntry = () => {
    let t_actual = actual;
    if (actual == "id") {
      t_actual = identifier.current.value; //generar
    }

    let t = data;
    let content = {
      alias: identifier.current.value,
      title: title.current.value,
      autors: autors,
      resumen: resume.current.value,
      keywords: keys.current.value,
      journal: journal.current.value,
      res_journal: res_journal.current.value
    }
    
    t[identifier.current.value] = content;
    setData(t);
    addEntryToIndexedDB(identifier.current.value, content);

    let t2 = [];
    for (let i in data) {
      if (i === "id") continue;
      t2.push({ id: i, alias: data[i]["alias"] });
    }
    setAlias(t2);
  };

  const handleSaveAuthor = () => {
    let na = autors.filter(
      (item) => item["name"] !== actualAuth
    );
    na.push({ name: autor.current.value, institution: instit.current.value });
    setAutors(na);
    autor.current.value = "";
    instit.current.value = "";
    //resetAutors
  };

  React.useEffect(() => {
    let t = [];
    for (let i in data) {
      if (i === "id" || i === "") continue;
      t.push({ id: i, alias: data[i]["alias"] });
    }
    setAlias(t);
  }, [data]);

  const reformatActual = ()=>{
    identifier.current.value = data[actual]["alias"];
    title.current.value = data[actual]["title"];
    resume.current.value = data[actual]["resumen"];
    keys.current.value = data[actual]["keywords"];
    journal.current.value = data[actual]["journal"];
    res_journal.current.value = data[actual]["res_journal"];
    autor.current.value = "";
    instit.current.value = "";

    setAutors(data[actual]["autors"]);
  }
  
  React.useEffect(() => {
    reformatActual();
  }, [actual]);

  const isMenu = React.useContext(MenuContext);

  React.useEffect(() => {
      getDictFromIndexedDB().then((r)=>{
        setData(r);
      })
    }, []);

  const MenuLateral = () => {
    //if(!isMenu && height<500) return null;
    return (
      <div className="h-full w-52 bg-blue-500 shadow-sm flex flex-col">
        <div className="flex flex-row justify-evenly w-full text-xl mt-3 text-white">
          <FaPlus
            className="hover:cursor-pointer"
            onClick={() => {
              setActual("id");
              reformatActual();
            }}
          />
          <MdSave
            className="hover:cursor-pointer"
            onClick={() => {
              handleSave();
            }}
          />
          <SiConvertio className="hover:cursor-pointer" onClick={()=>{exporter(data)}}/>
        </div>
        <div className="text-white px-4 pt-4 h-full scrollbar-thin overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-blue-800 scrollbar-track-blue-300">
          {alias.map((item) => {
            return (
              <div className="flex flex-row justify-between items-center hover:bg-blue-400 rounded-full">
                <p
                  className="hover:cursor-pointer w-full"
                  onClick={() => {
                    setActual(item.id);
                  }}
                >
                  {item.alias}
                </p>
                <MdDelete
                  className="hover:cursor-pointer"
                  onClick={() => {
                    handleDeleteEntry(item.id);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  //{data?<pre>{JSON.stringify(data, null, 2)}</pre>:null}
  return (
    <div className="w-full h-[91vh] flex flex-row">   

      <div className="hidden md:flex">
          <MenuLateral />
      </div>
      {isMenu||(window.innerHeight<564)?<div className="flex md:hidden"><MenuLateral /></div>:null}

      <div className="w-full flex flex-col space-y-3 m-6 mr-4 items-start overflow-x-hidden overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-300 scrollbar-track-white">
        <TextField
          label={lang[language].board.id}
          className="w-full"
          defaultValue={data[actual]["alias"]}
          placeholder="Exp. 3(2)e321"
          inputRef={identifier}
          disabled={actual!=="id"}
        />
        <TextField
          label={lang[language].board.title}
          className="w-full"
          defaultValue={data[actual]["title"]}
          inputRef={title}
        />
        <TextField
          label={lang[language].board.resumen}
          multiline
          rows={5}
          className="w-full"
          defaultValue={data[actual]["resumen"]}
          inputRef={resume}
        />
        <TextField
          label={lang[language].board.keywords}
          className="w-full"
          defaultValue={data[actual]["keywords"]}
          inputRef={keys}
        />
        <div className="flex flex-row space-x-3 w-full">
          <TextField
            label={lang[language].board.revista}
            className="w-full"
            defaultValue={data[actual]["journal"]}
            inputRef={journal}
          />
          <TextField
            label={lang[language].board.short_revista}
            className="w-full"
            defaultValue={data[actual]["res_journal"]}
            inputRef={res_journal}
          />
        </div>
        {autors.length !== 0
          ? autors.map((item) => {
              return (
                <div className="flex flex-row space-x-4 w-full">
                  <div className="flex flex-row space-x-3 w-full ml-3 items-center">
                    <MdDelete
                      className="text-red-500 hover:cursor-pointer"
                      onClick={() => {
                        handleDeleteAuthor(item["name"]);
                      }}
                    />
                    <MdEdit
                      className="text-green-600 hover:cursor-pointer"
                      onClick={() => {
                        setActualInst(item["institution"]);
                        setActualAuth(item["name"]);
                      }}
                    />
                    <p className="w-full font-bold">{item["name"]}</p>
                  </div>
                  <p className="w-full">{item["institution"]}</p>
                </div>
              );
            })
          : null}
        <div className="flex flex-row w-full items-center space-x-4">
          <MdSave
            className="text-blue-700 text-xl hover:cursor-pointer"
            onClick={() => {
              handleSaveAuthor();
            }}
          />
          <div className="flex flex-row space-x-4 w-full">
            <TextField label={lang[language].board.autor} className="w-full" inputRef={autor}/>
            <TextField
              label={lang[language].board.instit}
              className="w-full"
              inputRef={instit}
            />
          </div>
        </div>
        <div className="flex flex-row m-4 justify-end w-full">
          <button
            className="bg-red-400 h-8 w-20 mt-5 rounded-xl mr-6"
            onClick={() => handelSaveEntry()}
          >
            {lang[language].board.guardar}
          </button>
        </div>
      </div>
    </div>
  );
}
