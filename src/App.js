import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Cliente from "./pages/Cliente";
import Compra from "./pages/Compra";
import Empleado from "./pages/Empleado";
import Inventario from "./pages/Inventario";
import Producto from "./pages/Producto";
import Proveedor from "./pages/Proveedor";
import Venta from "./pages/Venta";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import Categoria from "./pages/Categoria";

import PrivateRoute from "./supabaseConnect/privateRoute";
import AdminRoute from "./supabaseConnect/AdminRoutes";
import Empresa from "./pages/Empresa";
import LogSistema from "./pages/Logs";

function App() {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex flex-col h-screen">
                <Header onToggleMenu={() => setMenuOpen(true)} isOpen={menuOpen} />
                <div className="flex flex-1 md:overflow-hidden">
                  <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
                  <main className="flex-1 overflow-auto bg-gray-100 p-4">
                    <Routes>
                      <Route path="/cliente" element={<Cliente />} />
                      <Route path="/compra" element={<Compra />} />
                      <Route path="/empleado" element={<Empleado />} />
                      <Route path="/inventario" element={<Inventario />} />
                      <Route path="/producto" element={<Producto />} />
                      <Route path="/proveedor" element={<Proveedor />} />
                      <Route path="/venta" element={<Venta />} />
                      <Route path="/categoria" element={<Categoria />} />
                      <Route path="/empresa" element={<Empresa />} />
                      <Route
                        path="/logs"
                        element={
                          <AdminRoute>
                            <LogSistema />
                          </AdminRoute>
                        }
                      />
                      <Route path="/" element={<Dashboard />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
