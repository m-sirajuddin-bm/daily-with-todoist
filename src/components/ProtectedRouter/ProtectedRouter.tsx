import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../../hooks";

const ProtectedRoute = () => {
  const { state } = useAppContext();
  const location = useLocation();

  // validate the token, if not valid then route to login page
  if (!state.token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
