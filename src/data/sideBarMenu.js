const rol = localStorage.getItem("rol");
console.log(rol)
const sidebarMenu = [
    {
        title: "Configuracion",
        icon: "people",
        children: [
            { title: "Productos", path: "/producto" },
            { title: "Clientes", path: "/cliente" },
            { title: "Proveedores", path: "/Proveedor" },
            { title: "Empleados", path: "/empleado" },
            { title: "Inventario", path: "/inventario" },
            { title: "Ventas", path: "/venta" },
            { title: "Compras", path: "/compra" },
            { title: "Categorias", path: "/categoria" },
            { title: "Empresas", path: "/empresa" },
            // Solo mostrar Logs si el usuario es admin
            ...(rol === "admin" ? [{ title: "Logs", path: "/logs" }] : []),
        ],
    },
];

export default sidebarMenu;
