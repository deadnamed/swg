import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hub from "./Hub";
import App_v4 from "./App_v4";
import Login from "./Login";

export default function Router(){
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/game/:roomId/*" element={<App_v4 />} />
          <Route path="/login/*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
}