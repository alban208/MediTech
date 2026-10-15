import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({children, requiredRoles}) => {
    const { userRole, isLoggedIn } = useAuth();
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    if (requiredRoles.includes(userRole)) {
        return children;
    }
    return <Navigate to="/forbidden" replace />;
} 

export default ProtectedRoute;