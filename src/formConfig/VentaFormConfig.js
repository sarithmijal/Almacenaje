const VentaFormConfig = (empleados, clientes, empresas) => [
    {
        name: "idVenta",
        label: "ID Venta",
        require: true
    },
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
        getOptionValue: (option) => option.id_empleado,
    },
    {
        name: "idClientes",
        label: "ID Cliente",
        required: true,
        type: "autocomplete",
        options: clientes,
        getOptionLabel: (option) => `${option.nombre}`,
        getOptionValue: (option) => option.id_cliente,
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
        getOptionValue: (option) => option.id_empresa,
    },
    {
        name: "metodoPago",
        label: "Método de Pago",
        type: "text",
        required: true,
    },


];


export default VentaFormConfig;
