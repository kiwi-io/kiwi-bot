import React from "react";
import { useState, createContext, useContext } from "react";

interface ActionContextType {
  actionUrl: string;
  actionTarget: string;
  actionTargetLogo: string;
  note: string;
  updateActionUrl: (actionUrl: string) => void;
  updateActionTarget: (actionTarget: string) => void; 
  updateActionTargetLogo: (actionTarget: string) => void;
  updateNote: (note: string) => void;
}

const ActionContext = createContext<ActionContextType | undefined>(undefined);

export const useActionContext = () => {
  const context = useContext(ActionContext);
  if (!context) {
    throw new Error(
      "useActionContext must be used within a ActionContextProvider",
    );
  }
  return context;
};

//@ts-ignore
export const ActionContextProvider = ({ children }) => {
    const [actionUrl, setActionUrl] = useState<string>("");
    const [actionTarget, setActionTarget] = useState<string>("");
    const [actionTargetLogo, setActionTargetLogo] = useState<string>("");
    const [note, setNote] = useState<string>("");

    const updateActionUrl = (actionUrl: string) => {
        setActionUrl((_) => actionUrl);
    }
    
    const updateActionTarget = (actionTarget: string) => {
      setActionTarget((_) => actionTarget);
    }

    const updateActionTargetLogo = (actionTargetLogo: string) => {
      setActionTargetLogo((_) => actionTargetLogo);
    }

    const updateNote = (actionUrl: string) => {
      setNote((_) => actionUrl);
  }

  const value = {
    actionUrl,
    actionTarget,
    actionTargetLogo,
    note,
    updateActionUrl,
    updateActionTarget,
    updateActionTargetLogo,
    updateNote
  } as ActionContextType;

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
};
