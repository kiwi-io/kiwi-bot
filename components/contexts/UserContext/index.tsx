import { User } from "@privy-io/react-auth";
import React from "react";
import { useState, createContext, useContext } from "react";
import { Token, TokenWithBalance } from "../../../utils/types/Token";

interface UserContextType {
    user: User;
    tokenWithBalances: Map<Token, TokenWithBalance>;
    setUser: (user: User) => void;
    setTokenWithBalances: (tokenWithBalances: Map<Token, TokenWithBalance>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}

//@ts-ignore
export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [tokenWithBalances, setTokenWithBalances] = useState<Map<Token, TokenWithBalance>>(new Map<Token, TokenWithBalance>);

    const value = {
        user,
        tokenWithBalances,
        setUser,
        setTokenWithBalances
    } as UserContextType;

    return (
        <UserContext.Provider value = {value}>
            {children}
        </UserContext.Provider>
    )
}