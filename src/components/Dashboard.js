import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseConnect/supabaseClient";
import { Typography, CircularProgress, Box } from "@mui/material";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndProfile = async () => {

            const { data: authData, error: authError } = await supabase.auth.getUser();

            if (authError) {
                console.error("Error al obtener usuario autenticado:", authError);
                setLoading(false);
                return;
            }

            const authUser = authData.user;


            const { data: profileData, error: profileError } = await supabase
                .from("usuarios")
                .select("nombre, rol")
                .eq("auth_user_id", authUser.id)
                .single();

            if (profileError) {
                console.error("Error al obtener perfil:", profileError);
            }

            setUser(authUser);
            setProfile(profileData);
            setLoading(false);
        };

        fetchUserAndProfile();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user || !profile) {
        return (

            <Typography variant="h6" color="error" align="center">
                No se pudo cargar la información del usuario.
            </Typography>
        );
    }

    return (
        <Box textAlign="center" mt={10}>
            <Typography variant="h4" gutterBottom>
                Bienvenido, {profile.nombre}
            </Typography>
            <Typography variant="h6" color="textSecondary">
                Tu rol es: <strong>{profile.rol}</strong>
            </Typography>
        </Box>
    );
};

export default Dashboard;
