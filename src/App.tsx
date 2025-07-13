import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { SetupAccount } from "./pages/SetupAccount";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account-setup/:verificationToken" element={<SetupAccount />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
