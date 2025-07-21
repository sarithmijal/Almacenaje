import { useState } from "react";

const DynamicTable = ({
    columns,
    data,
    title = "Listado",
    enableSearch = true,
    rowsPerPage = 15,
    onNew = null,
    onEdit = null,
}) => {
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rol = localStorage.getItem("rol")

    const filteredData = data.filter((row) =>
        columns.some((col) =>
            String(row[col.field]).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };


    return (
        <div className="p-4 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <h1 className="text-2xl font-semibold">Rol: {rol}</h1>
                <div className="space-x-2">
                    {onNew && rol !== "viewer" && (
                        <button
                            onClick={onNew}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Nuevo
                        </button>
                    )}
                </div>
            </div>

            {enableSearch && (
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
            )}


            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.field} className="hover:bg-gray-100 cursor-pointer">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-100 cursor-pointer"

                                    onClick={rol !== "viewer" ? () => onEdit(row) : undefined}

                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.field}
                                            className="p-2 border truncate max-w-xs whitespace-nowrap overflow-hidden text-center"
                                        >
                                            {typeof row[col.field] === "boolean"
                                                ? row[col.field]
                                                    ? "Sí"
                                                    : "No"
                                                : typeof row[col.field] === "object" && row[col.field] !== null
                                                    ? row[col.field]?.nombre || row[col.field]?.label || row[col.field]?.id || JSON.stringify(row[col.field])
                                                    : col.type === 'date' && row[col.field]
                                                        ? formatDate(row[col.field])
                                                        : row[col.field]}

                                        </td>
                                    ))}


                                </tr>

                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + (onEdit ? 1 : 0)}
                                    className="text-center p-4 text-gray-500"
                                >
                                    No hay resultados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {currentData.length > 0 &&
                (
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <span>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </button>
                    </div>
                )
            }
        </div>

    );
};

export default DynamicTable;
