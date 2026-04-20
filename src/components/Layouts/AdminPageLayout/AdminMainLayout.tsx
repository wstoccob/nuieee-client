import { Outlet } from 'react-router-dom';
import AdminHeader from "../../../components/Layouts/AdminPageLayout/AdminHeader.tsx";
import {AdminHeroSection}  from "../../../components/Layouts/AdminPageLayout/AdminHeroSection.tsx";

const AdminMainPage = () => {
    return (
        <div className="min-h-screen bg-black">
            <AdminHeader />
                <AdminHeroSection/>
            <Outlet />
        </div>
    );
};

export default AdminMainPage;

