import { Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/signup/Signup";
import Home from "./pages/home/Home";
import Login from "./pages/auth/login/Login";
function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
