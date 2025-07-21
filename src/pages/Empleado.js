import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import EmpleadoTableConfig from "../tableConfig/EmpleadoTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import EmpleadoFormConfig from "../formConfig/EmpleadoFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const Empleado = () => {
    const [empleados, setEmpleados] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });


    useEffect(() => {
        const fetchEmpleado = async () => {
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
            } finally {
                setCargando(false)
            }
        };
        const fetchempresas = async () => {
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
            } finally {
                setCargando(false)
            }
        };
        fetchempresas();
        fetchEmpleado();
    }, [showForm]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedEmpleado) {

                await axios.put(`${apiUrl}/api/empleados/${selectedEmpleado.id_persona}`, formData);

                const updatedEmpleados = empleados.map((empleado) =>
                    empleado.id_empleado === selectedEmpleado.id_empleado ? { ...empleado, ...formData } : empleado
                );
                setEmpleados(updatedEmpleados);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Empleado actualizado correctamente',
                });
            } else {

                const response = await axios.post(`${apiUrl}/api/empleados`, formData);


                setEmpleados([...empleados, { ...formData, id_empleado: response.data.id_empleado }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Empleado creado correctamente',
                });
            }


            setSelectedEmpleado(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar el empleado:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar el empleado',
            });

        } finally {
            setCargando(false)
        }
    };

    const handleEditar = (usuario) => {
        setSelectedEmpleado(usuario);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/empleados/${selectedEmpleado.id_empleado}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updatedEmpleados = empleados.filter(empleado => empleado.id_empleado !== selectedEmpleado.id_empleado);
                setEmpleados(updatedEmpleados);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Empleado eliminado con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar el empleado',
                });
            }
            setSelectedEmpleado(null);
        } catch (error) {
            console.error("Error al eliminar empleado:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar el empleado',
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
                    fields={EmpleadoFormConfig(empresas)}
                    selectedItem={selectedEmpleado}
                    initialValues={selectedEmpleado || {}}
                    onSubmit={handleCreate}
                    title={"Empleado"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedEmpleado(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Empleados"
                    columns={EmpleadoTableConfig}
                    data={empleados}
                    onNew={() => {
                        setSelectedEmpleado(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Empleado;
