import React from "react";
import { useState, createContext, useContext } from "react";

interface ActionContextType {
  actionUrl: string;
  updateActionUrl: (actionUrl: string) => void;
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


    const updateActionUrl = (actionUrl: string) => {
        setActionUrl((_) => actionUrl);
    }

  const value = {
    actionUrl,
    updateActionUrl
  } as ActionContextType;

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
};
