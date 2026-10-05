import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PageNotFound } from "@/components/PageNotFound";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import EventsListPage from "@/pages/event/EventsListPage";
import EventDetailPage from "@/pages/event/EventDetailPage";
import { ProtectedRoute } from "./ProtectedRoute";

// Admin screens are reachable by a handful of people but would otherwise ship in the
// bundle every public visitor downloads. Same for the two content-heavy static pages.
const AdminMainPage = lazy(() => import("@/pages/admin/AdminMainPage"));
const AdminEventsPage = lazy(() => import("@/pages/admin/AdminEventsPage"));
const AddNewEventPage = lazy(() => import("@/pages/admin/AddNewEventPage"));
const EditEventPage = lazy(() => import("@/pages/admin/EditEventPage"));
const AdminHackathonsPage = lazy(() => import("@/pages/admin/hackathons/AdminHackathonsPage"));
const AdminHackathonNewPage = lazy(() => import("@/pages/admin/hackathons/AdminHackathonNewPage"));
const AdminHackathonDetailPage = lazy(() => import("@/pages/admin/hackathons/AdminHackathonDetailPage"));
const SuperAdminPage = lazy(() => import("@/pages/superadmin/SuperAdminPage"));
const HackathonIndexPage = lazy(() => import("@/pages/hackathon/HackathonIndexPage"));
const HackathonEventPage = lazy(() => import("@/pages/hackathon/HackathonEventPage"));
const TeamRegistrationPage = lazy(() => import("@/pages/hackathon/TeamRegistrationPage"));
const Hackathon2Page = lazy(() => import("@/pages/hackathon/Hackathon2Page"));
const PodcastsPage = lazy(() => import("@/pages/PodcastsPage"));

const RouteFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-ieee-blue" />
  </div>
);

export const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/events" element={<EventsListPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/podcasts" element={<PodcastsPage />} />
        <Route path="/hackathon" element={<HackathonIndexPage />} />
        <Route path="/hackathon/register" element={<Navigate to="/hackathon" replace />} />
        <Route path="/hackathon/:slug" element={<HackathonEventPage />} />
        <Route path="/hackathon/:slug/register" element={<TeamRegistrationPage />} />
        <Route path="/hackathon2" element={<Hackathon2Page />} />

        <Route element={<ProtectedRoute minimumRole="admin" />}>
          <Route path="/admin" element={<AdminMainPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/events/addNewEvent" element={<AddNewEventPage />} />
          <Route path="/admin/events/:id/edit" element={<EditEventPage />} />
          <Route path="/admin/hackathons" element={<AdminHackathonsPage />} />
          <Route path="/admin/hackathons/new" element={<AdminHackathonNewPage />} />
          <Route path="/admin/hackathons/:id" element={<AdminHackathonDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute minimumRole="superadmin" />}>
          <Route path="/superadmin" element={<SuperAdminPage />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
