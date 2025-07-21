import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const rol = localStorage.getItem("rol");

    if (rol !== "admin") {
        // Si no es admin, redirige al dashboard o donde quieras
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
