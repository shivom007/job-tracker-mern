import { Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import Dsa from "./pages/Dsa";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dsa" element={<Dsa />} />
      </Routes>
      <Toaster position="top-right" richColors duration={5000} />
    </>
  );
}

export default App;
