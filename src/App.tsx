import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRouter";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import { AppContextProvider } from "./providers/app-context.provider";

function App() {
  return (
    <>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="app" element={<AdminLayout />}>
                <Route index element={<Home />} />
                <Route path="projects" element={<Projects />} />
                <Route path="upcoming" element={<Projects />} />
                <Route path="labels" element={<Projects />} />
              </Route>
            </Route>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </>
  );
}

export default App;
