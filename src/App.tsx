import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { SetupAccount } from "./pages/SetupAccount";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account-setup/:verificationToken" element={<SetupAccount />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
