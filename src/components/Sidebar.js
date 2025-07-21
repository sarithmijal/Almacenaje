import { Link, useLocation } from "react-router-dom";
import menuItems from "../data/sideBarMenu";

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    return (
        <div className={`
                fixed z-40 top-0 left-0 h-full w-64 bg-white text-black p-4
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
   
      md:relative md:h-auto md:w-64 md:top-auto md:left-auto md:shadow
      md:transition-none
      md:${isOpen ? 'block' : 'hidden'}
                `}>
            <div className="flex justify-end">
                <button onClick={onClose} className="text-gray-700 text-xl">
                    ✕
                </button>
            </div>
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index} className="mb-2">
                        <Link
                            to={item.path}
                            className={`block p-2 rounded hover:bg-gray-100 transition 
            ${location.pathname === item.path ? 'text-red-600 font-semibold' : ''}`}
                        >
                            {item.title}
                        </Link>
                        {item.children && (
                            <ul className="ml-4">
                                {item.children.map((child, i) => (
                                    <li key={i}>
                                        <Link
                                            to={child.path}
                                            className={`block p-2 rounded text-sm hover:bg-gray-100 transition 
                    ${location.pathname === child.path ? 'text-red-600 font-semibold' : ''}`}
                                        >
                                            {child.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default Sidebar;
