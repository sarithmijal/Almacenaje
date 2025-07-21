const LogSistemaFormConfig = () => [
    { name: "usuario", label: "Usuario", type: "text", required: true },
    { name: "rol", label: "Rol", type: "text", required: true },
    { name: "accion", label: "Acción", type: "text", required: true },
    { name: "detalle", label: "Detalle", type: "textarea", required: false },
    { name: "ip", label: "IP", type: "text", required: false },
    { name: "fecha", label: "Fecha", type: "datetime-local", required: true },
];

export default LogSistemaFormConfig;
