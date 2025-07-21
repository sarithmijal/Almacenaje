const InventarioFormConfig = (productos, empresas) => [

    { name: "ID Inventario", label: "ID Inventario", type: "text", required: true },
    {
        name: "ID Producto",
        label: "idProducto",
        required: true,
        type: "autocomplete",
        options: productos,
        getOptionLabel: (option) => `${option.nombre}`,
        getOptionValue: (option) => option.id_producto,

    },
    { name: "fechaRegisto", label: "Fecha Registro", type: "date", required: true },
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

export default InventarioFormConfig;
