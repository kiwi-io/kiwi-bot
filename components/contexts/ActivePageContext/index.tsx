import React from "react";
import { useState, createContext, useContext } from "react";

interface ActivePageContextType {
  activePage: string;
  updateActivePage: (activePage: string) => void;
}

const ActivePageContext = createContext<ActivePageContextType | undefined>(
  undefined,
);

export const useActivePageContext = () => {
  const context = useContext(ActivePageContext);
  if (!context) {
    throw new Error(
      "useActivePageContext must be used within a ActivePageContextProvider",
    );
  }
  return context;
};

//@ts-ignore
export const ActivePageContextProvider = ({ children }) => {
  const [activePage, setActivePage] = useState<string>("/home");

  const updateActivePage = (activePage: string) => {
    setActivePage((_) => activePage);
  };

  const value = {
    activePage,
    updateActivePage
  } as ActivePageContextType;

  return (
    <ActivePageContext.Provider value={value}>
      {children}
    </ActivePageContext.Provider>
  );
};
