import Route from "./navigation/Route";
import { NavigationProvider } from "./context/navigation";

import HomePage from "./pages/HomePage";
import CallPage from "./pages/CallPage";
import ActiveUsersPage from "./pages/ActiveUsersPage";
import NotFoundPage from "./pages/NotFound";

function App() {
  function onMatchMedia() {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const theme = localStorage.getItem("theme");

    if (theme === "dark" || (!theme && darkQuery.matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  onMatchMedia();

  return (
    <NavigationProvider>
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          <Route path="/">
            <HomePage />
          </Route>
          <Route path="/active">
            <ActiveUsersPage />
          </Route>
          <Route path="/call">
            <CallPage />
          </Route>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </div>
      </div>
    </NavigationProvider>
  );
}

export default App;
