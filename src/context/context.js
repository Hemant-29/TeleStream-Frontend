import { createContext } from 'react';

export const loginContext = createContext({
    loggedinState: false,
    setLoggedinState: () => { },
});

export const userContext = createContext({});