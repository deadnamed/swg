import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Hub from "./Hub";
import App_v4 from "./App_v4";

export default function Router(){
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/game/:roomId/*" element={<App_v4 />} />
        </Routes>
      </BrowserRouter>
    );
}