import { useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import { authAtom } from "../store/chatAppAtom";

//if user is logged in navigate to dashboard
export function PublicRoute({ children, allowWhenLoggedIn = false }) {
  const auth = useRecoilValue(authAtom)

  // If allowWhenLoggedIn is true (for HomePage), don't redirect
  if (allowWhenLoggedIn) {
    return children;
  }

  // For other public routes (like login), redirect to dashboard if logged in
  return auth.isLoggedIn ? <Navigate to={"/dashboardPage"} replace /> : children
}

//if user is not logged in navigate to login
export default function PrivateRoute({ children }) {
  const auth = useRecoilValue(authAtom)
  

  return auth.isLoggedIn ? children : <Navigate to={"/"} replace />
}

