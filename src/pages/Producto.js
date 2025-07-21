import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import productoTableConfig from "../tableConfig/ProductoTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import productoFormConfig from "../formConfig/ProductoFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";
import { enviarLog } from "../utils/logger";

const apiUrl = process.env.REACT_APP_API_URL;

const Producto = () => {
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([])
    const [categorias, setCategorias] = useState([])
    const [showForm, setShowForm] = useState(false);
    const [selectedProducto, setSelectedProdcuto] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol');

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setCargando(true)
                const response = await axios.get(`${apiUrl}/api/productos`)
                setProductos(response.data);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar los productos',
                });
            }
            finally {
                setCargando(false)
            }
        };


        enviarLog({
            usuario,
            rol,
            accion: "Consulta Productos",
            detalle: "Ingresa a consultar Productos"
        });

        fetchProveedores();
        fetchCategorias();
        fetchProductos();
    }, [showForm, rol, usuario]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedProducto) {
                // Si estamos editando, hacemos una solicitud PUT
                await axios.put(`${apiUrl}/api/productos/${selectedProducto.id_producto}`, formData);

                const updateProductos = productos.map((producto) =>
                    producto.id_producto === selectedProducto.id_producto ? { ...producto, ...formData } : producto
                );
                setProductos(updateProductos);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Producto actualizado correctamente',
                });

                enviarLog({
                    usuario,
                    rol,
                    accion: "Crea un Producto",
                    detalle: "producto creado exitosamente",
                });
            } else {


                await axios.post(`${apiUrl}/api/productos`, formData, {
                    headers: { "Content-Type": "application/json" }
                });
                setProductos([...productos, { ...formData }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Producto creado correctamente',
                });
                enviarLog({
                    usuario,
                    rol,
                    accion: "Crea un Producto",
                    detalle: "producto creado exitosamente",
                });
            }


            setSelectedProdcuto(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar el producto',
            });
            enviarLog({
                usuario,
                rol,
                accion: "Error",
                detalle: "Error al crear Producto"
            });
        } finally {
            setCargando(false)
        }
    };

    const handleEditar = (usuario) => {
        setSelectedProdcuto(usuario);
        setShowForm(true);

    };
    const fetchProveedores = async () => {
        try {
            setCargando(true)
            const response = await axios.get(`${apiUrl}/api/proveedores`);
            setProveedores(response.data);
        } catch (error) {
            console.error("Error al cargar los proveedores:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar los proveedores',
            });
        }
        finally {
            setCargando(false)
        }
    };


    const fetchCategorias = async () => {
        try {
            setCargando(true)
            const response = await axios.get(`${apiUrl}/api/categorias`);
            setCategorias(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Error al cargar las categorias:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar las categorias',
            });
        }
        finally {
            setCargando(false)
        }
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/productos/${selectedProducto.id_producto}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateProductos = productos.filter(producto => producto.id_producto !== selectedProducto.id_producto);
                setProductos(updateProductos);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Producto eliminado con éxito',
                });
                enviarLog({
                    usuario,
                    rol,
                    accion: "Producto Eliminado",
                    detalle: `Producto ${selectedProducto} eliminado correctamente`
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar el producto',
                });
                enviarLog({
                    usuario,
                    rol,
                    accion: "Error",
                    detalle: `Error al eliminar el Producto ${selectedProducto} `
                });
            }
            setSelectedProdcuto(null);
        } catch (error) {
            console.error("Error al eliminar el producto:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar el producto',
            });
        } finally {
            setCargando(false)
        }
    };

    return (
        <div className="p-4 relative">
            {cargando && <Loader />}
            <AlertMessage
                open={alert.open}
                severity={alert.severity}
                message={alert.message}
                onClose={() => setAlert({ ...alert, open: false })}
            />
            {showForm ? (
                <DynamicForm
                    fields={productoFormConfig(proveedores, categorias)}
                    selectedItem={selectedProducto}
                    initialValues={selectedProducto || {}}
                    onSubmit={handleCreate}
                    title={"Producto"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedProdcuto(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Productos"
                    columns={productoTableConfig}
                    data={productos}
                    onNew={() => {
                        setSelectedProdcuto(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Producto;
