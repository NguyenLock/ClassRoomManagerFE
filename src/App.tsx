import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { SetupAccount } from "./pages/SetupAccount";
import { PrivateRoute } from "./routes/PrivateRoute";
import { InstructorDashboard } from "./pages/instructor/Dashboard";
import { StudentDashboard } from "./pages/student/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account-setup/:verificationToken" element={<SetupAccount />} />

        <Route element={<PrivateRoute userType="instructor" />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        </Route>

        <Route element={<PrivateRoute userType="student" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
