const CompraFormConfig = (proveedores, empresas) => [

    {
        name: "idCompra",
        label: "ID Compra",
        type: "text",
        required: true,
    },
    {
        name: "fecha",
        label: "Fecha",
        type: "date",
        required: false,
    },
    {
        name: "idProveedor",
        label: "ID Proveedor",
        required: true,
        type: "autocomplete",
        options: proveedores,
        getOptionLabel: (option) => `${option.nombre}`,
        getOptionValue: (option) => option.id_proveedor,
    },
    { name: "devoluciones", label: "Devoluciones", type: "number", required: true },

    {
        name: "id_empresa",
        label: "ID EMPRESA",
        required: true,
        type: "autocomplete",
        options: empresas,
        getOptionLabel: (option) => `${option.nombre}`,
        getOptionValue: (option) => option.id_empresa,
    },


    { name: "metodoPago", label: "Método de Pago", type: "text", required: true },


];


export default CompraFormConfig;
