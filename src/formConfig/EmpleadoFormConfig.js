const EmpleadoFormConfig = (empresas) => [

    { name: "idEmpleado", label: "ID Empleado", type: "text", required: false, },
    { name: "nombre", label: "Nombre", type: "text", required: false, },
    { name: "apellido", label: "Apellido", type: "text", required: false, },
    { name: "cargo", label: "Cargo", type: "text", required: true, },
    { name: "salario", label: "Salario", type: "number", required: true, },

    { name: "fechaIngreso", label: "Fecha Ingreso", type: "date", required: false, },

    {
        name: "ID Empresa",
        label: "idEmpresa",
        required: true,
        type: "autocomplete",
        options: empresas,
        getOptionLabel: (option) => `${option.nombre}`,
        getOptionValue: (option) => `${option.idEmpresa}`,

    },

];

export default EmpleadoFormConfig;
