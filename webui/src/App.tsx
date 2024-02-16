import Route from "./navigation/Route";
import { NavigationProvider } from "./context/navigation";

import PreviewPage from "./pages/PreviewPage";
import CallPage from "./pages/CallPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFound";

function App() {
  return (
    <NavigationProvider>
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          <Route path="/">
            <HomePage />
          </Route>
          <Route path="/preview">
            <PreviewPage />
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
