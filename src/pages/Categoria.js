import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import AlertMessage from '../components/AlertMessage';
import CategoriaTableConfig from '../tableConfig/CategoriaTableConfig'
import CategoriaFormConfig from "../formConfig/CategoriaFormConfig";
import Loader from "../components/Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const Categoria = () => {
    const [categorias, setCategorias] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState(null)
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });


    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                setCargando(true)
                const response = await axios.get(`${apiUrl}/api/categorias`);
                setCategorias(response.data);
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

        fetchCategorias();
    }, [showForm]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedCategoria) {

                await axios.put(`${apiUrl}/api/categorias/${selectedCategoria.id_categoria}`, formData);

                const updateCanales = categorias.map((categoria) =>
                    categoria.id_categoria === selectedCategoria.id_categoria ? { ...categoria, ...formData } : categoria
                );
                setCategorias(updateCanales);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Categoria actualizada correctamente',
                });
            } else {
                const response = await axios.post(`${apiUrl}/api/categorias`, formData);


                setCategorias([...categorias, { ...formData, id_categoria: response.data.id_categoria }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Categoria creada correctamente',
                });
            }


            setSelectedCategoria(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar la categoria:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar la categoria',
            });

        }
        finally {
            setCargando(false)
        }
    };

    const handleEditar = (usuario) => {
        setSelectedCategoria(usuario);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/categorias/${selectedCategoria.id_categoria}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Filtrar los usuarios eliminados de la lista
                const updateCategorias = categorias.filter(categoria => categoria.id_categoria !== selectedCategoria.id_categoria);
                setCategorias(updateCategorias); // Actualizar el estado de users
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Categoria eliminada con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar la categoria',
                });
            }
            setSelectedCategoria(null);
        } catch (error) {
            console.error("Error al eliminar categoria:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar la categoria',
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
                    fields={CategoriaFormConfig}
                    initialValues={selectedCategoria || {}}
                    selectedItem={selectedCategoria}
                    onSubmit={handleCreate}
                    title={"Categoria"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedCategoria(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Categorias"
                    columns={CategoriaTableConfig}
                    data={categorias}
                    onNew={() => {
                        setSelectedCategoria(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Categoria;
