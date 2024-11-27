import { Routes, Route, Navigate } from "react-router-dom";
import routes from "@/routes";

export function Auth() {
  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        {routes.map(
          ({ pages }) =>
            pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))
        )}

        {/* Route fallback */}
        {/* <Route path="*" element={<Navigate to="/auth/sign-in" replace />} /> */}
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
