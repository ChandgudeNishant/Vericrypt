//import logo from './logo.svg';
import "./App.css";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Background3D from "./components/Background3D";
//import Verify from './pages/verify';
import Register from "./pages/register";
import Down from "./pages/download";
import Marksheet from "./pages/marksheet";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Background3D />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="register" element={<Register />} />
        <Route path="down" element={<Down />} />
        <Route path="marksheet" element={<Marksheet />} />
      </Routes>
    </Router>
  );
}

export default App;
