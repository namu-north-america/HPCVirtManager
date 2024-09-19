import { HashRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import Forbidden from "./pages/Forbidden";
import Login from "./pages/Login";
import { ConfirmDialog } from "primereact/confirmdialog";

function App() {
  return (
    <div className="App">
      <ConfirmDialog />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forget-password" element={<Login />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/403" element={<Forbidden />} />
        </Routes>
        <ProtectedRoutes />
      </HashRouter>
    </div>
  );
}

export default App;
