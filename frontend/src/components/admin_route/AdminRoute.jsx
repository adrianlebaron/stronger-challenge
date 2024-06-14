import { Outlet, Navigate } from "react-router-dom";
import { authStore } from "../../stores/auth_store/Store";

const AdminRoute = () => {
  const { token, user } = authStore((state) => state);
  const isAdmin = user?.user?.profile?.roles === "ADMIN";
  return token && isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;