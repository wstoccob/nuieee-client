import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import SuperAdminPage from "@/pages/superadmin/SuperAdminPage";
import AdminMainPage from "@/pages/admin/AdminMainPage";
import AdminEventsPage from "@/pages/admin/AdminEventsPage";
import AddNewEventPage from "@/pages/admin/AddNewEventPage";
import HackathonAdminPage from "@/pages/admin/HackathonAdminPage";
import HackathonRegisterPage from "@/pages/hackathon/HackathonRegisterPage";
import Hackathon2Page from "@/pages/hackathon/Hackathon2Page";
import EventDetailPage from "@/pages/event/EventDetailPage";
import EventsListPage from "@/pages/event/EventsListPage";
import PodcastsPage from "@/pages/PodcastsPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/events" element={<EventsListPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/podcasts" element={<PodcastsPage />} />
      <Route path="/hackathon/register" element={<HackathonRegisterPage />} />
      <Route path="/hackathon2" element={<Hackathon2Page />} />

      <Route element={<ProtectedRoute minimumRole="admin" />}>
        <Route path="/admin" element={<AdminMainPage />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/admin/events/addNewEvent" element={<AddNewEventPage />} />
        <Route path="/admin/hackathon" element={<HackathonAdminPage />} />
      </Route>

      <Route element={<ProtectedRoute minimumRole="superadmin" />}>
        <Route path="/superadmin" element={<SuperAdminPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
