import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import VentaTableConfig from "../tableConfig/VentaTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import VentaFormConfig from "../formConfig/VentaFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const Venta = () => {
    const [ventas, setVentas] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const fetcheVentas = async () => {
        try {
            setCargando(true)
            const response = await axios.get(`${apiUrl}/api/ventas`);

            setVentas(response.data);
        } catch (error) {
            console.error("Error al cargar las ventas:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar las ventas',
            });
        }
        finally {
            setCargando(false)
        }
    };
    const fetchProductosDisponibles = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/inventario/productos`);
            setProductosDisponibles(response.data);
        } catch (error) {
            console.error("Error al cargar los productos del inventario:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar los productos del inventario',
            });
        }
    };

    const fetchEmpleados = async () => {
        try {
            setCargando(true)
            const response = await axios.get(`${apiUrl}/api/empleados`);

            setEmpleados(response.data);
        } catch (error) {
            console.error("Error al cargar los empleados:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar los empleados',
            });
        }
        finally {
            setCargando(false)
        }
    };

    const fetchEmpresas = async () => {
        try {
            setCargando(true)
            const response = await axios.get(`${apiUrl}/api/empresas`);

            setEmpresas(response.data);
        } catch (error) {
            console.error("Error al cargar las empresas:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar las empresas',
            });
        }
        finally {
            setCargando(false)
        }
    };
    const fetchClientes = async () => {
        try {
            setCargando(true)
            const response = await axios.get(`${apiUrl}/api/clientes`);

            setClientes(response.data);
        } catch (error) {
            console.error("Error al cargar las clientes:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar las clientes',
            });
        }
        finally {
            setCargando(false)
        }
    };



    useEffect(() => {
        fetchClientes();
        fetcheVentas();
        fetchEmpleados();
        fetchEmpresas();
        fetchProductosDisponibles();
    }, [showForm]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true);

            // Extraemos detalles y el resto de campos para venta
            const { detalles, ...venta } = formData;

            const payload = {
                venta,
                detalles
            };

            if (selectedVenta) {
                // Actualizar venta (PUT)
                await axios.put(`${apiUrl}/api/ventas/${selectedVenta.id_venta}`, payload);

                const updatedVentas = ventas.map(v =>
                    v.id_venta === selectedVenta.id_venta ? { ...v, ...venta } : v
                );
                setVentas(updatedVentas);

                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Venta actualizada correctamente',
                });
            } else {
                // Crear venta (POST)
                const response = await axios.post(`${apiUrl}/api/ventas`, payload);

                const nuevoId = response.data.idVenta || null;

                setVentas([...ventas, { ...venta, id_venta: nuevoId }]);

                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Venta creada correctamente',
                });
            }

            setSelectedVenta(null);
            setShowForm(false);
            fetcheVentas();

        } catch (error) {
            console.error("Error al guardar la venta:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar la venta',
            });
        } finally {
            setCargando(false);
        }
    };


    const handleEditar = (finalidad) => {
        setSelectedVenta(finalidad);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/ventas/${selectedVenta.idVenta}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateFinalidad = ventas.filter(finalidad => finalidad.id_venta !== selectedVenta.idVenta);
                setVentas(updateFinalidad);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Venta eliminada con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar la venta',
                });
            }
            setSelectedVenta(null);
        } catch (error) {
            console.error("Error al eliminar venta:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar la venta',
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
                    fields={VentaFormConfig(empleados, clientes, empresas)}
                    selectedItem={selectedVenta}
                    initialValues={selectedVenta || {}}
                    onSubmit={handleCreate}
                    title={"Venta"}
                    productos={true}
                    venta={true}
                    productosDisponibles={productosDisponibles}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedVenta(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Venta"
                    columns={VentaTableConfig}
                    data={ventas}
                    onNew={() => {
                        setSelectedVenta(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Venta; 
