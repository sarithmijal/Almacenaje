import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import { supabase } from '../supabaseConnect/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Header = ({ onToggleMenu, isOpen }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('usuario');

        navigate('/login');
    };

    return (
        <header className="bg-red-600 text-white flex items-center justify-between px-4 py-2 shadow">
            <button
                onClick={onToggleMenu}
                className={`hover:bg-red-700 p-2 rounded transition-opacity ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
            >
                <MenuIcon />
            </button>
            <h1 className="text-xl font-semibold">Proyecto base de datos</h1>
            <Button
                onClick={handleLogout}
                variant="outlined"
                color="inherit"
                startIcon={<LogoutIcon />}
                size="small"
            >
                Cerrar sesión
            </Button>
        </header>
    );
};

export default Header;
