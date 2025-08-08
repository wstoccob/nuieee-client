import { Outlet } from 'react-router-dom';
import AdminHeader from "../../components/Layouts/AdminPageLayout/AdminHeader.tsx";

const AdminMainPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <AdminHeader />
            <main className="flex-grow flex justify-center items-center p-10">
                <h1 className="text-4xl lg:text-6xl font-extrabold text-red-600 text-center max-w-4xl">
                    ADMIN PAGE (Be careful when entering!!!)
                </h1>
            </main>
            <Outlet />
        </div>
    );
};

export default AdminMainPage;
