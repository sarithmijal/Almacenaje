import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import InventarioTableConfig from "../tableConfig/InventarioTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import InventarioFormConfig from "../formConfig/InventarioFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const Inventario = () => {
    const [inventarios, setInventarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedInventario, setSelectedInventario] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const fetchInventarios = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/inventario`);
            setInventarios(response.data);
        } catch (error) {
            console.error("Error al cargar los inventarios:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar los inventarios',
            });
        }
    };


    const fetchProductos = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/productos`);
            setProductos(response.data);
        } catch (error) {
            console.error("Error al cargar los productos:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar los productos',
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

        fetchInventarios();
    }, [showForm]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedInventario) {
                await axios.put(`${apiUrl}/api/inventario/${selectedInventario.id_flujo}`, formData);
                const updateFlujos = inventarios.map((inventario) =>
                    inventario.id_inventario === selectedInventario.id_inventario ? { ...inventario, ...formData } : inventario
                );
                setInventarios(updateFlujos);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Flujo actualizado correctamente',
                });
            } else {

                const response = await axios.post(`${apiUrl}/api/inventario`, formData);


                setInventarios([...inventarios, { ...formData, id_inventario: response.data.id_inventario }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Inventario creado correctamente',
                });
            }


            setSelectedInventario(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar el inventario:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar el inventario',
            });

        } finally {
            setCargando(false)
        }
    };

    const handleEditar = (flujo) => {
        setSelectedInventario(flujo);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/inventario/${selectedInventario.id_flujo}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateInventario = inventarios.filter(inventario => inventario.id_inventario !== selectedInventario.id_inventario);
                setInventarios(updateInventario);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Inventario eliminado con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar el inventario',
                });
            }
            setSelectedInventario(null);
        } catch (error) {
            console.error("Error al eliminar inventario:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar el inventario',
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

            <DynamicTable
                title="Inventario"
                columns={InventarioTableConfig}
                data={inventarios}
                onNew={false}
                onEdit={handleEditar}
            />

        </div>
    );
};

export default Inventario;
