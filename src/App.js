import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Gallary from "./components/Gallary";
import Courses from "./components/Courses";
import Popups from "./components/Popups";
import Placements from "./components/Placements";
import Contact from "./components/Contact";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/gallary" element={<Gallary />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/popups" element={<Popups />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
