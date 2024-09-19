import { User } from "@privy-io/react-auth";
import React, { createContext, useContext, useState } from "react";

interface UserContextType {
    user: User;
    setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if(!context) {
        throw new Error("useUserContext must be used inside a UserContextProvider");
    }
    return context;
}

//@ts-ignore
export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    const value = {
        user,
        setUser
    } as UserContextType;

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}