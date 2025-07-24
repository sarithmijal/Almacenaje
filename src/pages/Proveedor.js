import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import AlertMessage from '../components/AlertMessage';
import ProveedorTableConfig from '../tableConfig/ProveedorTableConfig'
import ProveedorFormConfig from "../formConfig/ProveedorFormConfig";
import Loader from "../components/Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const Proveedor = () => {
    const [proveedores, setProveedores] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedEC, setSelectedEC] = useState(null)
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });


    useEffect(() => {
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
                    message: 'Hubo un error al cargar proveedores',
                });
            }
            finally {
                setCargando(false)
            }
        };

        fetchProveedores();
    }, [showForm]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedEC) {

                await axios.put(`${apiUrl}/api/estado-consentimientos/${selectedEC.id_estado_consentimiento}`, formData);

                const updateEstadoC = proveedores.map((proveedor) =>
                    proveedor.id_persona === selectedEC.id_estado_consentimiento ? { ...proveedores, ...formData } : proveedores
                );
                setProveedores(updateEstadoC);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Proveedor actualizado correctamente',
                });
            } else {

                const response = await axios.post(`${apiUrl}/api/proveedores`, formData);


                setProveedores([...proveedores, { ...formData, id_proveedor: response.data.id_proveedor }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Proveedor creado correctamente',
                });
            }


            setSelectedEC(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar el Proveedor:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar el Proveedor',
            });

        }
        finally {
            setCargando(false)
        }
    };

    const handleEditar = (usuario) => {
        setSelectedEC(usuario);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/proveedores/?id_proveedor=${selectedEC.id_proveedor}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Filtrar los usuarios eliminados de la lista
                const updateEstadoC = proveedores.filter(proveedor => proveedor.id_proveedor !== selectedEC.id_proveedor);
                setProveedores(updateEstadoC);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Proveedores eliminado con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar el Proveedor',
                });
            }
            setSelectedEC(null);
        } catch (error) {
            console.error("Error al eliminar Proveedor:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar Proveedor',
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
                    fields={ProveedorFormConfig}
                    selectedItem={selectedEC}
                    initialValues={selectedEC || {}}
                    onSubmit={handleCreate}
                    title={"Proveedor"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedEC(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Proveedores"
                    columns={ProveedorTableConfig}
                    data={proveedores}
                    onNew={() => {
                        setSelectedEC(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Proveedor;
