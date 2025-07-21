import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import AlertMessage from '../components/AlertMessage';
import ClienteTableConfig from '../tableConfig/ClienteTableConfig'
import ClienteFormConfig from "../formConfig/ClienteFormConfig";
import Loader from "../components/Loader";
import { enviarLog } from "../utils/logger";

const apiUrl = process.env.REACT_APP_API_URL;

const Cliente = () => {
    const [clientes, setClientes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null)
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol');

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                setCargando(true)
                const response = await axios.get(`${apiUrl}/api/clientes`);
                setClientes(response.data);
                enviarLog({
                    usuario,
                    rol,
                    accion: "Ingresa a Clientes",
                    detalle: `Usuario ${usuario} ingresa a clientes`
                });
            } catch (error) {
                console.error("Error al cargar los clientes:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar los clientes',
                });
                enviarLog({
                    usuario,
                    rol,
                    accion: "Error en Clientes",
                    detalle: `Error al cargar clientes`
                });
            }
            finally {
                setCargando(false)
            }
        };

        fetchClientes();
    }, [showForm, rol, usuario]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedCliente) {

                await axios.put(`${apiUrl}/api/clientes/${selectedCliente.id_cliente}`, formData);

                const updateCanales = clientes.map((cliente) =>
                    cliente.id_persona === selectedCliente.id_cliente ? { ...cliente, ...formData } : cliente
                );
                setClientes(updateCanales);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Cliente actualizado correctamente',
                });
                enviarLog({
                    usuario,
                    rol,
                    accion: "Actualizacion de Clientes",
                    detalle: `Cliente ${selectedCliente} actualizado correctamente`
                });
            } else {
                const response = await axios.post(`${apiUrl}/api/clientes`, formData);


                setClientes([...clientes, { ...formData, id_cliente: response.data.id_cliente }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Cliente creado correctamente',
                });
                enviarLog({
                    usuario,
                    rol,
                    accion: "Creacion de Clientes",
                    detalle: `Cliente creado correctamente`
                });
            }


            setSelectedCliente(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar el cliente:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar el cliente',
            });
            enviarLog({
                usuario,
                rol,
                accion: "Error en Clientes",
                detalle: `Error al crear cliente`
            });

        }
        finally {
            setCargando(false)
        }
    };

    const handleEditar = (usuario) => {
        setSelectedCliente(usuario);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/clientes/${selectedCliente.id_cliente}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Filtrar los usuarios eliminados de la lista
                const updateClientes = clientes.filter(cliente => cliente.id_cliente !== selectedCliente.id_cliente);
                setClientes(updateClientes); // Actualizar el estado de users
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Cliente eliminado con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar el cliente',
                });
            }
            setSelectedCliente(null);
        } catch (error) {
            console.error("Error al eliminar cliente:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar el cliente',
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
                    fields={ClienteFormConfig}
                    initialValues={selectedCliente || {}}
                    selectedItem={selectedCliente}
                    onSubmit={handleCreate}
                    title={"Cliente"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedCliente(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Clientes"
                    columns={ClienteTableConfig}
                    data={clientes}
                    onNew={() => {
                        setSelectedCliente(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Cliente;
