import { Card } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { initSocket } from "./utils/socket";
import Dashboard from "./pages/Dashboard";

function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const res = initSocket();
    setSocket(res);
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login socket={socket} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
