const ProductoFormConfig = (proveedores, categorias, isLoadingIdProveedor, isLoadingIdCategoria) => [
    { name: "id_producto", label: "ID Producto", type: "text", required: false, },
    { name: "nombre", label: "Nombre", type: "text", required: false, },
    {
        name: "id_categoria",
        label: "id Categoria",
        required: true,
        type: "autocomplete",
        options: categorias,
        getOptionLabel: (option) => `${option.nombre}`,
        getOptionValue: (option) => option.id_categoria,
        loading: isLoadingIdCategoria
    },

    { name: "precio", label: "Precio", type: "text", required: true },
    { name: "stock", label: "Stock", type: "text", required: true },

    {
        name: "id_proveedor",
        label: "id Proveedor",
        required: true,
        type: "autocomplete",
        options: proveedores,
        getOptionLabel: (option) => `${option.nombre}`,
        getOptionValue: (option) => option.id_proveedor,
        loading: isLoadingIdProveedor
    },

];

export default ProductoFormConfig;
