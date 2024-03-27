import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function IsAdminPrivateRoute() {
  const { currentUser } = useSelector((store) => store.user);
  return  currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
}

export default IsAdminPrivateRoute;
