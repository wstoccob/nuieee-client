import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/auth/LoginPage.tsx'
import SuperAdminPage from '../pages/superadmin/SuperAdminPage.tsx'
import AdminMainPage from "../pages/admin/AdminMainPage.tsx";
import HackathonAdminPage from "../pages/admin/HackathonAdminPage.tsx";
import HackathonRegisterPage from "../pages/hackathon/HackathonRegisterPage.tsx";
import AdminEventsPage from "../pages/admin/AdminEventsPage.tsx";
import AddNewEventPage from "../pages/admin/AddNewEventPage.tsx";
import EventDetailPage from "../pages/event/EventDetailPage.tsx";
import EventsListPage from "../pages/event/EventsListPage.tsx";
import PodcastsPage from "../pages/PodcastsPage.tsx";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <HomePage />} />
                <Route path="/auth/login" element={ <LoginPage />} />
                <Route path="/superadmin" element={ <SuperAdminPage />} />
                <Route path="/admin" element={ <AdminMainPage />} />
                <Route path="/admin/events" element={<AdminEventsPage />} />
                <Route path="/admin/events/addNewEvent" element={<AddNewEventPage />} />
                <Route path="/hackathon/register" element={ <HackathonRegisterPage />} />
                <Route path="/admin/hackathon" element={ <HackathonAdminPage />} />
                <Route path="/events" element={<EventsListPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/podcasts" element={<PodcastsPage />} />
            </Routes>
        </BrowserRouter>
    )
}