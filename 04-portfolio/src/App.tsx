import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Footer, Header } from "@/components/Header";
import { HomePage } from "@/pages/HomePage";
import { EmployerPage } from "@/pages/EmployerPage";
import { WorkPage } from "@/pages/WorkPage";
import { WorkCasePage } from "@/pages/WorkCasePage";
import { DemosPage } from "@/pages/DemosPage";
import { DemoPage } from "@/pages/DemoPage";
import { ContactPage } from "@/pages/ContactPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="page-shell">
      <Header />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/employer" element={<EmployerPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkCasePage />} />
          <Route path="/demos" element={<DemosPage />} />
          <Route path="/demos/:slug" element={<DemoPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
