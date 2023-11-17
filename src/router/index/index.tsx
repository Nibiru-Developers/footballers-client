import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import AboutPage from "../../pages/AboutPage";
import NotFound from "../../pages/NotFound";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/about">
          <Route index element={<AboutPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
