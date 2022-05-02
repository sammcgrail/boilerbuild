import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pizza" element={<p>pizza</p>}/>
        <Route path="/" element={<p>haha</p>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;