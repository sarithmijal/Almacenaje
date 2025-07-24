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
    const [productosDisponibles, setProductosDisponibles] = useState([]);
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
            showAlert('error', 'Hubo un error al cargar las compras');
        }
    };

    const fetchProveedores = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/proveedores`);
            setProveedores(response.data);
        } catch (error) {
            console.error("Error al cargar los proveedores:", error);
            showAlert('error', 'Hubo un error al cargar los proveedores');
        }
    };

    const fetchEmpresas = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/empresas`);
            setEmpresas(response.data);
        } catch (error) {
            console.error("Error al cargar las empresas:", error);
            showAlert('error', 'Hubo un error al cargar las empresas');
        }
    };

    const fetchProductos = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/productos`);
            setProductosDisponibles(response.data);
        } catch (error) {
            console.error("Error al cargar los productos:", error);
            showAlert('error', 'Hubo un error al cargar los productos');
        }
    };

    const showAlert = (severity, message) => {
        setAlert({
            open: true,
            severity,
            message,
        });
    };

    useEffect(() => {
        fetchCompras();
        fetchProveedores();
        fetchEmpresas();
        fetchProductos();
    }, []);

    const handleCreate = async (payload) => {
        try {
            setCargando(true);

            // Reestructurar payload
            const { detalles, ...compraData } = payload;
            const data = {
                compra: compraData,
                detalles: detalles || []
            };

            if (selectedCompra) {
                await axios.put(`${apiUrl}/api/compras/${selectedCompra.idCompra}`, data);
                const updatedCompras = compras.map((c) =>
                    c.idCompra === selectedCompra.idCompra ? { ...c, ...data.compra } : c
                );
                setCompras(updatedCompras);
                showAlert('success', 'Compra actualizada correctamente');
            } else {
                const response = await axios.post(`${apiUrl}/api/compras`, data);
                setCompras([...compras, response.data]);
                showAlert('success', 'Compra creada correctamente');
            }

            setSelectedCompra(null);
            setShowForm(false);
            fetchCompras();
        } catch (error) {
            console.error("Error al guardar la compra:", error);
            showAlert('error', 'Hubo un error al guardar la compra');
        } finally {
            setCargando(false);
        }
    };


    const handleEditar = (cp) => {
        setSelectedCompra(cp);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true);
            const response = await axios.delete(`${apiUrl}/api/compras/${selectedCompra.idCompra}`);

            if (response.status === 200) {
                const updatedCompras = compras.filter(c => c.idCompra !== selectedCompra.idCompra);
                setCompras(updatedCompras);
                showAlert('success', 'Compra eliminada con éxito');
                setShowForm(false);
            } else {
                showAlert('error', 'Error al eliminar la compra');
            }
            setSelectedCompra(null);
        } catch (error) {
            console.error("Error al eliminar compra:", error);
            showAlert('error', 'Error al eliminar la compra');
        } finally {
            setCargando(false);
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
                    productosDisponibles={productosDisponibles}
                    selectedItem={selectedCompra}
                    initialValues={selectedCompra || {}}
                    onSubmit={handleCreate}
                    title={"Compra"}
                    productos={true}
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
