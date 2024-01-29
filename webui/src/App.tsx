import { BrowserRouter, Routes, Route } from "react-router-dom";

import PreviewPage from "./pages/PreviewPage";
import CallPage from "./pages/CallPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter basename="/">
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/call" element={<CallPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
