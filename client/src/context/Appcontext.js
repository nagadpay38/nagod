import { createContext,useState} from "react";

const Contextapi=createContext();

const Appprovider=({children})=>{
        const [activetopbar,setactivetopbar]=useState(false)
       const [activesidebar,setactivesidebar]=useState(false)
    return(
        <Contextapi.Provider
          value={{activetopbar,setactivetopbar,activesidebar,setactivesidebar}}
        >
             {children}
        </Contextapi.Provider>
    )
};

export {Contextapi,Appprovider}