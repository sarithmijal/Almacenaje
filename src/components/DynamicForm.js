import { useState, useEffect } from "react";
import { TextField, MenuItem, Button, IconButton, Checkbox, FormControlLabel, Autocomplete } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


const DynamicForm = ({ fields, onSubmit, onCancel, onDelete, title, initialValues = {}, selectedItem }) => {

    const [formData, setFormData] = useState(initialValues);
    const rol = localStorage.getItem("rol")
    useEffect(() => {
        setFormData(initialValues || {});
    }, [initialValues]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        const isValid = fields.every(field => {
            if (field.required) {
                return formData[field.name];
            }
            return true;
        });

        if (!isValid) return;

        onSubmit(formData);
    };


    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md relative">

            {/* Botón de cerrar */}
            <IconButton
                onClick={onCancel}
                className="text-red-600 hover:text-red-800"
            >
                <CloseIcon />
            </IconButton>



            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Registro {title}</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {fields.map((field) => (
                    <div key={field.name}>
                        {field.type === 'select' ? (
                            <TextField
                                select
                                fullWidth
                                label={field.label}
                                value={formData[field.name] || ''}
                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                variant="outlined"
                                required={field.required}
                            >
                                {field.options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        ) : field.type === "autocomplete" ? (
                            <Autocomplete
                                options={field.options || []}
                                getOptionLabel={(option) => {
                                    if (typeof option === 'string') return option;
                                    return field.getOptionLabel(option);
                                }}
                                value={
                                    field.options?.find(
                                        opt => field.getOptionValue(opt) === formData[field.name]
                                    ) || null
                                }
                                onChange={(e, newValue) => {
                                    setFormData({
                                        ...formData,
                                        [field.name]: newValue ? field.getOptionValue(newValue) : null,
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={field.label}
                                        required={field.required}
                                        fullWidth
                                        margin="normal"
                                        error={field.options?.length === 0}
                                        helperText={
                                            field.options?.length === 0
                                                ? "Error al cargar los datos"
                                                : ""
                                        }
                                    />
                                )}
                            />
                        ) :

                            field.type === 'checkbox' ? (
                                <FormControlLabel
                                    label={field.label}
                                    control={
                                        <Checkbox
                                            checked={formData[field.name] || false}
                                            onChange={(e) => handleChange(field.name, e.target.checked)}
                                            name={field.name}
                                            sx={{
                                                color: '#4B9EFA',
                                                '&.Mui-checked': {
                                                    color: '#1D72B8',
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 30,
                                                },
                                            }}
                                        />
                                    }
                                    labelPlacement="end"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '15px',
                                        color: '#333',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                    }}
                                />
                            ) : field.type === 'date' ? (
                                <TextField
                                    fullWidth
                                    label={field.label}
                                    type="date"
                                    value={(formData[field.name] && formData[field.name].substring(0, 10)) || ''}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required={field.required}
                                />
                            ) :
                                (
                                    <TextField
                                        fullWidth
                                        label={field.label}
                                        type={field.type || 'text'}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        variant="outlined"
                                        required={field.required}
                                        rows={field.rows || 1}
                                        multiline={field.multiline || false}
                                    />
                                )}
                    </div>
                ))}
                {/* Botones de acción */}
                <div className="flex justify-end mt-6 space-x-3">
                    <Button type="submit" variant="contained" color="primary">
                        Guardar
                    </Button>
                    {selectedItem && rol === "admin" && (
                        <Button
                            type="button"
                            onClick={onDelete}
                            variant="contained"
                            className="!bg-red-600 hover:!bg-red-700 text-white"
                        >
                            Eliminar
                        </Button>
                    )}

                </div>

            </form>

        </div>
    );
};

export default DynamicForm;
