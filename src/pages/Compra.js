import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import CompraTableConfig from "../tableConfig/CompraTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import CompraFormConfig from "../formConfig/CompraFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const Compra = () => {
    const [compras, setCompras] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [cargando, setCargando] = useState(false);

    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const fetchCompras = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/compras`);
            setCompras(response.data);
        } catch (error) {
            console.error("Error al cargar las compras:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar las compras',
            });
        }
    };
    const fetchProveedores = async () => {
        try {
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
    };
    const fetchEmpresas = async () => {
        try {
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
    };

    useEffect(() => {
        fetchCompras();
        fetchProveedores();
        fetchEmpresas();
    }, [showForm]);

    const handleCreate = async (formData) => {
        console.log("handleCreate llamado", formData);
        try {
            setCargando(true)
            if (selectedCompra) {

                await axios.put(`${apiUrl}/api/compras/${selectedCompra.idCompra}`, formData);

                const updateCompra = compras.map((claveP) =>
                    claveP.idCompra === selectedCompra.idCompra ? { ...claveP, ...formData } : claveP
                );
                setCompras(updateCompra);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Compra actualizada correctamente',
                });
            } else {
                console.log("AQUI")
                const response = await axios.post(`${apiUrl}/api/compras`, formData);
                console.log("Respuesta del backend:", response.data);

                setCompras([...compras, { ...formData, idCompra: response.data.idCompra }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Compra creada correctamente',
                });
            }


            setSelectedCompra(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar la compra:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar la compra',
            });

        } finally {
            setCargando(false)
        }
    };

    const handleEditar = (cp) => {
        setSelectedCompra(cp);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/compras/${selectedCompra.idCompra}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateCompra = compras.filter(cp => cp.idCompra !== selectedCompra.idCompra);
                setSelectedCompra(updateCompra);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Compra eliminada con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar la compra',
                });
            }
            setSelectedCompra(null);
        } catch (error) {
            console.error("Error al eliminar compra:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar la compra',
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
                    fields={CompraFormConfig(proveedores, empresas)}
                    selectedItem={selectedCompra}
                    initialValues={selectedCompra || {}}
                    onSubmit={handleCreate}
                    title={"Compra"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedCompra(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Compras"
                    columns={CompraTableConfig}
                    data={compras}
                    onNew={() => {
                        setSelectedCompra(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Compra;
