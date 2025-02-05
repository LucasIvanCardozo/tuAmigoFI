import { createContext, useContext } from 'react';

interface TypeAsideContext {
  stateAside: {
    viewAside: boolean;
    setViewAside: (state: boolean) => void;
  };
}

export const AsideContext = createContext<TypeAsideContext>({
  stateAside: {
    viewAside: false,
    setViewAside: () => {},
  },
});

export const useAsideContext = () => useContext(AsideContext);
