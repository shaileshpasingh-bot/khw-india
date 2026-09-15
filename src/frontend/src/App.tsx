import { AdminLayout } from "@/components/layout/AdminLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import AboutPage from "@/pages/About";
import ContactPage from "@/pages/Contact";
import DonatePage from "@/pages/Donate";
import EventsPage from "@/pages/Events";
import GetInvolvedPage from "@/pages/GetInvolved";
import HomePage from "@/pages/Home";
import NotFoundPage from "@/pages/NotFound";
import PartnersPage from "@/pages/Partners";
import ProgramsPage from "@/pages/Programs";
import StoriesPage from "@/pages/Stories";
import StoryDetailPage from "@/pages/StoryDetail";
import TransparencyPage from "@/pages/Transparency";
import AdminContentPage from "@/pages/admin/AdminContent";
import AdminDashboardPage from "@/pages/admin/AdminDashboard";
import AdminLoginPage from "@/pages/admin/AdminLogin";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:id" element={<StoryDetailPage />} />
          <Route path="/get-involved" element={<GetInvolvedPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/donate" element={<DonatePage />} />
        </Route>

        {/* Admin pages (protected by AdminLayout) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="content" element={<AdminContentPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
