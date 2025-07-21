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
    }, [showForm]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedVenta) {

                await axios.put(`${apiUrl}/api/ventas/${selectedVenta.id_venta}`, formData);

                const updateVenta = ventas.map((venta) =>
                    venta.id_venta === selectedVenta.id_venta ? { ...venta, ...formData } : venta
                );
                setVentas(updateVenta);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Venta actualizado correctamente',
                });
            } else {

                const response = await axios.post(`${apiUrl}/api/updateVenta`, formData);


                setVentas([...ventas, { ...formData, id_venta: response.data.idVenta }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Venta creada correctamente',
                });
            }


            setSelectedVenta(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar la venta:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar la venta',
            });

        } finally {
            setCargando(false)
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
