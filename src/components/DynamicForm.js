import { useState, useEffect } from "react";
import { TextField, MenuItem, Button, IconButton, Checkbox, FormControlLabel, Autocomplete, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const DynamicForm = ({
    fields,
    onSubmit,
    onCancel,
    onDelete,
    title,
    initialValues = {},
    selectedItem,
    productosDisponibles = [],
    productos = false,
    venta = false
}) => {
    console.log("INITAIAL", initialValues)
    const [formData, setFormData] = useState(() => initialValues || {});
    const [detalles, setDetalles] = useState(() => initialValues.detalles || []);

    const subtotal = detalles.reduce(
        (acc, detalle) => acc + detalle.precioUnitario * detalle.cantidad,
        0
    );
    const iva = subtotal * 0.12;
    const totalConIva = subtotal + iva;

    const rol = localStorage.getItem("rol");

    // Evita que initialValues vacío provoque uncontrolled inputs
    useEffect(() => {
        setFormData(initialValues || {});
        setDetalles(initialValues.detalles || []);
    }, [initialValues]);

    // Cambios en campos
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value ?? "" }));
    };

    // Agregar producto a detalles
    const agregarDetalle = (nuevoDetalle) => {
        setDetalles(prev => [...prev, nuevoDetalle]);
    };

    // Eliminar producto
    const eliminarDetalle = (index) => {
        setDetalles(prev => prev.filter((_, i) => i !== index));
    };

    // Enviar formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = fields.every(field => {
            if (field.required) {
                const value = formData[field.name];
                return value !== undefined && value !== null && value !== '';
            }
            return true;
        });

        if (!isValid) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
        }

        if (productos && detalles.length === 0) {
            alert("Agrega al menos un producto.");
            return;
        }

        onSubmit({ ...formData, detalles });
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md relative">
            <IconButton onClick={onCancel} style={{ position: "absolute", right: 10, top: 10 }}>
                <CloseIcon />
            </IconButton>

            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Registro {title}</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Campos dinámicos */}
                {fields.map(field => (
                    <div key={field.name}>
                        {field.type === 'select' ? (
                            <TextField
                                select
                                fullWidth
                                label={field.label}
                                value={formData[field.name] ?? ""}
                                onChange={e => handleChange(field.name, e.target.value)}
                                variant="outlined"
                                required={field.required}
                            >
                                {field.options.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        ) : field.type === 'autocomplete' ? (
                            <Autocomplete
                                options={field.options || []}
                                getOptionLabel={option =>
                                    typeof option === 'string' ? option : field.getOptionLabel(option)
                                }
                                value={
                                    field.options?.find(opt => field.getOptionValue(opt) === formData[field.name]) || null
                                }
                                onChange={(e, newValue) =>
                                    handleChange(field.name, newValue ? field.getOptionValue(newValue) : "")
                                }
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label={field.label}
                                        required={field.required}
                                        fullWidth
                                        margin="normal"
                                    />
                                )}
                            />
                        ) : field.type === 'checkbox' ? (
                            <FormControlLabel
                                label={field.label}
                                control={
                                    <Checkbox
                                        checked={formData[field.name] || false}
                                        onChange={e => handleChange(field.name, e.target.checked)}
                                    />
                                }
                            />
                        ) : field.type === 'date' ? (
                            <TextField
                                fullWidth
                                label={field.label}
                                type="date"
                                value={
                                    formData[field.name]
                                        ? new Date(formData[field.name]).toISOString().substring(0, 10)
                                        : ""
                                }
                                onChange={e => handleChange(field.name, e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                required={field.required}
                            />
                        ) : (
                            <TextField
                                fullWidth
                                label={field.label}
                                type={field.type || 'text'}
                                value={formData[field.name] ?? ""}
                                onChange={e => handleChange(field.name, e.target.value)}
                                variant="outlined"
                                required={field.required}
                                rows={field.rows || 1}
                                multiline={field.multiline || false}
                            />
                        )}
                    </div>
                ))}

                {/* Productos */}
                {
                    productos && (
                        <div className="mt-6">
                            <h3 className="text-lg font-bold mb-2">Productos</h3>

                            {venta ?
                                (<ProductSelector2 productosDisponibles={productosDisponibles} onAdd={agregarDetalle} />)
                                :
                                (<ProductSelector productosDisponibles={productosDisponibles} onAdd={agregarDetalle} />)
                            }

                            <ul className="mt-2">
                                {detalles.map((detalle, index) => (
                                    <li key={index} className="flex justify-between items-center border-b py-2">
                                        {detalle.nombreProducto} - {detalle.cantidad} x ${detalle.precioUnitario} = ${detalle.precioUnitario * detalle.cantidad}
                                        <Button size="small" color="error" onClick={() => eliminarDetalle(index)}>Eliminar</Button>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 p-2 border-t">
                                <p>Subtotal: ${subtotal.toFixed(2)}</p>
                                <p>IVA (12%): ${iva.toFixed(2)}</p>
                                <p className="font-bold">Total: ${totalConIva.toFixed(2)}</p>
                            </div>
                        </div>

                    )
                }

                {/* Botones */}
                <div className="flex justify-end space-x-3 mt-6">
                    <Button type="submit" variant="contained" color="primary">Guardar</Button>
                    {selectedItem && rol === "admin" && (
                        <Button type="button" onClick={onDelete} variant="contained" color="error">Eliminar</Button>
                    )}
                </div>
            </form>
        </div>
    );
};

const ProductSelector = ({ productosDisponibles, onAdd }) => {
    const [producto, setProducto] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [precio, setPrecio] = useState(0);
    const handleAdd = () => {
        console.log("Producto seleccionado:", producto);

        if (!producto) {
            console.warn("No hay producto seleccionado");
            return;
        }

        const selected = productosDisponibles.find(p => String(p.idProducto) === producto);
        if (!selected) {
            console.warn("Producto no encontrado en la lista");
            return;
        }


        onAdd({
            idProducto: selected.id_producto,
            nombreProducto: selected.nombre,
            cantidad,
            precioUnitario: precio,
        });

        setProducto("");
        setCantidad(1);
        setPrecio(0);
    };


    return (
        <div className="flex gap-2 mb-4">
            <TextField
                select
                label="Producto"
                value={producto ?? ""}
                onChange={(e) => {
                    const value = e.target.value;
                    setProducto(value);
                    const selected = productosDisponibles.find(p => p.idProducto === value);
                    if (selected) {
                        setPrecio(selected.precioUnitario || 0); // Auto llenar precio
                    }
                }}
                fullWidth
            >
                {productosDisponibles.map(p => (
                    <MenuItem key={p.idProducto} value={String(p.idProducto)}>
                        {p.nombre} (Stock: {p.stock})
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                inputProps={{ min: 1 }}
                onChange={e => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
            />

            <TextField
                label="Precio Unitario"
                type="number"
                value={precio}
                inputProps={{ min: 0 }}
                onChange={e => setPrecio(parseFloat(e.target.value) || 0)}
            />

            <Button
                onClick={handleAdd}
                variant="outlined"
                disabled={!producto || cantidad <= 0 || precio <= 0}
            >
                Agregar
            </Button>
        </div>
    );
};


const ProductSelector2 = ({ productosDisponibles, onAdd }) => {
    const [producto, setProducto] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [precio, setPrecio] = useState(0);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        setSubtotal(cantidad * precio);
    }, [cantidad, precio]);

    const handleAdd = () => {
        const selected = productosDisponibles.find(p => String(p.idProducto) === producto);
        if (!selected) {
            console.warn("Producto no encontrado en la lista");
            return;
        }

        onAdd({
            idProducto: selected.idProducto,
            cantidad,
            precioUnitario: selected.precio,
        });

        // Reiniciar formulario
        setProducto("");
        setCantidad(1);
        setPrecio(0);
    };

    return (
        <div className="flex flex-col gap-2 mb-4">
            <div className="flex gap-2">
                <TextField
                    select
                    label="Producto"
                    value={producto}
                    onChange={(e) => {
                        const value = e.target.value;
                        setProducto(value);
                        const selected = productosDisponibles.find(p => String(p.idProducto) === value);
                        if (selected) {
                            setPrecio(selected.precio || 0);
                        }
                    }}
                    fullWidth
                >
                    {productosDisponibles.map(p => (
                        <MenuItem key={p.idProducto} value={String(p.idProducto)}>
                            {p.nombre} (Stock: {p.stock})
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Cantidad"
                    type="number"
                    value={cantidad}
                    inputProps={{ min: 1 }}
                    onChange={e => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                />

                <Typography variant="subtitle1">
                    Precio: ${precio.toFixed(2)}
                </Typography>


                <Button
                    onClick={handleAdd}
                    variant="outlined"
                    disabled={!producto || cantidad <= 0 || precio <= 0}
                >
                    Agregar
                </Button>
            </div>

            <Typography variant="subtitle1">
                Subtotal: ${subtotal.toFixed(2)}
            </Typography>
        </div>
    );
};

export default DynamicForm;
