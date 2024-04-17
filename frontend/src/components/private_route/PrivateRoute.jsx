import { Outlet, Navigate } from "react-router-dom";
import { authStore } from "../../store/Store";

const PrivateRoute = () => {
  const token = authStore((state) => state.token);
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;