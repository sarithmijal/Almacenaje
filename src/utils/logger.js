import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const obtenerIPPublica = async () => {
    try {
        const response = await axios.get("https://api.ipify.org?format=json");
        return response.data.ip;
    } catch (error) {
        console.error("Error obteniendo IP pública:", error);
        return "IP desconocida";
    }
};

export const enviarLog = async ({ usuario, rol, accion, detalle }) => {
    const ip = await obtenerIPPublica();

    try {
        await axios.post(`${apiUrl}/api/logs`, {
            usuario,
            rol,
            accion,
            detalle,
            ip,
            fecha: new Date(),
        });
        console.log("Log enviado al backend.");
    } catch (error) {
        console.error("Error al enviar log:", error);
    }
};

