import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/layouts";
import { Unauthorized } from "./pages/403";
import { SignIn, SignUp } from "./pages/auth";
import { NotFound } from "./pages/404";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/not-found" element={<NotFound />} />

      {/* catch all */}
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
