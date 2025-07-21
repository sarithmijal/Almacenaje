import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import LogSistemaTableConfig from "../tableConfig/LogSistemaTableConfig";
import axios from "axios";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const LogSistema = () => {
    const [logs, setLogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const fetchLogs = async () => {
        setCargando(true)
        try {
            const response = await axios.get(`${apiUrl}/api/logs`);
            setLogs(response.data);
        } catch (error) {
            console.error("Error al cargar los logs:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar los logs',
            });
        } finally {
            setCargando(false)

        }
    };

    useEffect(() => {
        fetchLogs();
    }, [showForm]);


    const handleCreate = async (formData) => {
        try {
            setCargando(true);
            if (selectedLog) {
                await axios.put(`${apiUrl}/api/logs/${selectedLog._id}`, formData);
                const updatedLogs = logs.map((log) =>
                    log._id === selectedLog._id ? { ...log, ...formData } : log
                );
                setLogs(updatedLogs);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Log actualizado correctamente',
                });
            } else {
                const response = await axios.post(`${apiUrl}/api/logs`, formData);
                setLogs([...logs, response.data]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Log creado correctamente',
                });
            }
            setSelectedLog(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar el log:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar el log',
            });
        } finally {
            setCargando(false);
        }
    };


    const handleEditar = (log) => {
        setSelectedLog(log);
        setShowForm(true);
    };


    const handleDelete = async () => {
        try {
            setCargando(true);
            await axios.delete(`${apiUrl}/api/logs/${selectedLog._id}`);
            const updatedLogs = logs.filter(log => log._id !== selectedLog._id);
            setLogs(updatedLogs);
            setAlert({
                open: true,
                severity: 'success',
                message: 'Log eliminado con éxito',
            });
            setShowForm(false);
            setSelectedLog(null);
        } catch (error) {
            console.error("Error al eliminar el log:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar el log',
            });
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


            <DynamicTable
                title="Logs del Sistema"
                columns={LogSistemaTableConfig}
                data={logs}
                onNew={false}
                onEdit={handleEditar}
            />

        </div>
    );
};

export default LogSistema;
