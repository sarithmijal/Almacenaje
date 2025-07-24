const VentaFormConfig = (empleados, clientes, empresas) => [

    {
        name: "fecha",
        label: "Fecha",
        type: "date",
    },
    {
        name: "idEmpleado",
        label: "ID Empleado",
        required: true,
        type: "autocomplete",
        options: empleados,
        getOptionLabel: (option) => `${option.nombre}`,
        getOptionValue: (option) => option.idEmpleado,
    },
    {
        name: "idCliente",
        label: "ID Cliente",
        required: true,
        type: "autocomplete",
        options: clientes,
        getOptionLabel: (option) => `${option.nombre}`,
        getOptionValue: (option) => option.idCliente,
    },

    { name: "montoTotal", label: "Monto Total", type: "text", required: true },

    {
        name: "devoluciones",
        label: "Devolucion",
        type: "text",
        required: true,
    },
    {
        name: "idEmpresa",
        label: "ID Empresa",
        required: true,
        type: "autocomplete",
        options: empresas,
        getOptionLabel: (option) => `${option.nombre}`,
        getOptionValue: (option) => option.idEmpresa,
    },
    {
        name: "metodoPago",
        label: "Método de Pago",
        type: "text",
        required: true,
    },


];


export default VentaFormConfig;
