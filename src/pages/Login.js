

import React, { useState } from "react";
import { supabase } from "../supabaseConnect/supabaseClient";
import { enviarLog } from "../utils/logger";

import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert,
} from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError("Credenciales Incorrectas");
        } else {
            const user = data.user
            const { data: profileData, error: profileError } = await supabase
                .from("usuarios")
                .select("nombre, rol")
                .eq("auth_user_id", user.id)
                .single();

            if (profileError) {
                console.error("Error al obtener perfil:", profileError);
                setError("No se pudo obtener el perfil de usuario.");
                return;
            }

            const usuario = profileData.nombre || user.email;
            const rol = profileData.rol || "usuario";

            localStorage.setItem("token", data.session.access_token);
            localStorage.setItem("usuario", usuario);
            localStorage.setItem("rol", rol);


            enviarLog({
                usuario,
                rol,
                accion: "LOGIN",
                detalle: "El usuario inició sesión exitosamente",
            });

            window.location.href = "/";
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
            >
                <Typography variant="h4" gutterBottom>
                    Iniciar Sesión
                </Typography>
                <form onSubmit={handleLogin} style={{ width: "100%" }}>
                    <TextField
                        label="Correo electrónico"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <Alert severity="error" style={{ marginTop: "10px" }}>
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        fullWidth
                        style={{ marginTop: "20px" }}
                    >
                        Iniciar sesión
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
