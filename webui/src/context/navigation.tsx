import { createContext, useState, useEffect } from "react";

interface IContext {
  currentPath: string;
  navigate: (to: string) => void;
}

interface IProps {
  children: React.ReactNode;
}

const NavigationContext = createContext<IContext>({
  currentPath: "/",
  navigate: () => null
});

function NavigationProvider({ children }: IProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handler);

    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setCurrentPath(to.split("?")[0]);
  };

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export { NavigationProvider };
export default NavigationContext;
