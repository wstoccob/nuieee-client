import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/auth/LoginPage.tsx'
import SuperAdminPage from '../pages/superadmin/SuperAdminPage.tsx'

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <HomePage />} />
                <Route path="/auth/login" element={ <LoginPage />} />
                <Route path="/superadmin" element={ <SuperAdminPage />} />
            </Routes>
        </BrowserRouter>
    )
}