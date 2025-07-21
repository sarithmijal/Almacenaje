import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import AlertMessage from '../components/AlertMessage';
import EmpresaTableConfig from '../tableConfig/EmpresaTableConfig'
import EmpresaFormConfig from "../formConfig/EmpresaFormConfig";
import Loader from "../components/Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const Empresa = () => {
    const [empresas, setEmpresas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null)
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });


    useEffect(() => {
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

        fetchEmpresas();
    }, [showForm]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedEmpresa) {

                await axios.put(`${apiUrl}/api/empresas/${selectedEmpresa.id_empresa}`, formData);

                const updateEmpresa = empresas.map((empresa) =>
                    empresa.id_empresa === selectedEmpresa.id_empresa ? { ...empresa, ...formData } : empresa
                );
                setEmpresas(updateEmpresa);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Empresa actualizada correctamente',
                });
            } else {
                const response = await axios.post(`${apiUrl}/api/empresas`, formData);


                setEmpresas([...empresas, { ...formData, id_empresa: response.data.id_empresa }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Empresa creada correctamente',
                });
            }


            setSelectedEmpresa(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar la empresa:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar la empresa',
            });

        }
        finally {
            setCargando(false)
        }
    };

    const handleEditar = (usuario) => {
        setSelectedEmpresa(usuario);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/empresas/${selectedEmpresa.id_empresa}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Filtrar los usuarios eliminados de la lista
                const updateEmpresa = empresas.filter(empresa => empresa.id_empresa !== selectedEmpresa.id_empresa);
                setEmpresas(updateEmpresa); // Actualizar el estado de users
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Empresa eliminada con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar la empresa',
                });
            }
            setSelectedEmpresa(null);
        } catch (error) {
            console.error("Error al eliminar empresa:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar la empresa',
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
                    fields={EmpresaFormConfig}
                    initialValues={selectedEmpresa || {}}
                    selectedItem={selectedEmpresa}
                    onSubmit={handleCreate}
                    title={"Empresa"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedEmpresa(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Empresas"
                    columns={EmpresaTableConfig}
                    data={empresas}
                    onNew={() => {
                        setSelectedEmpresa(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Empresa;
