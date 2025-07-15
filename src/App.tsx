import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SetupAccount } from "./pages/SetupAccount";
import { PrivateRoute } from "./routes/PrivateRoute";
import { InstructorDashboard } from "./pages/instructor/Dashboard";
import { StudentDashboard } from "./pages/student/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useEffect } from "react";
import { auth } from "./utils/auth";
import { showToast, ToastComponent } from "./components/UI/modal/Toast";

function App() {
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (auth.isAuthenticated()) {
        const token = auth.getToken();
        if (token) {
          try {
            const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
            const expirationTime = decodedToken.exp * 1000;

            if (Date.now() >= expirationTime) {
              auth.removeToken();
              showToast.warning("Session expired. Please login again.");
            }
          } catch (error) {
            auth.removeToken();
          }
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <ToastComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/account-setup/:verificationToken"
          element={<SetupAccount />}
        />

        <Route element={<PrivateRoute userType="instructor" />}>
          <Route
            path="/instructor/dashboard"
            element={<InstructorDashboard />}
          />
        </Route>

        <Route element={<PrivateRoute userType="student" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
