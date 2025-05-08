import { Card } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useEffect } from "react";
import { initSocket } from "./utils/socket";
import Dashboard from "./pages/Dashboard";

function App() {
  useEffect(() => {
    initSocket();
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
