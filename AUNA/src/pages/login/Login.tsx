import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './login.css';

import ForgotPassword from '../../components/forgotpassword/ForgotPassword';
import CreateProfile from '../../components/createprofile/CreateProfile';

// Datos que recibe la página desde App
interface LoginProps {
    onLogin: (email: string) => void; // guarda la sesión en el estado global
}

// Página para iniciar sesión (no lleva header ni footer)
function Login({ onLogin }: LoginProps) {

    // Lo que la usuaria escribe en el formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Mensaje de error y campo que tiene el error ("email", "password" o "")
    const [message, setMessage] = useState("");
    const [errorField, setErrorField] = useState("");


    // Si el modal de olvidé mi contraseña está abierto o cerrado
    const [forgotOpen, setForgotOpen] = useState(false);


    // Si el modal de crear cuenta está abierto o cerrado
    const [createOpen, setCreateOpen] = useState(false);

    // Para ir a otra página desde el código
    const navigate = useNavigate();

    // Al escribir se quita el borde rojo y el mensaje
    function clearError() {
        setMessage("");
        setErrorField("");
    }

    // Botón Log in: revisa los campos y entra al inicio
    function handleLogin() {
        const cleanEmail = email.trim();

        if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
            setMessage("Write a valid email address.");
            setErrorField("email");
        } else if (password === "") {
            setMessage("Write your password.");
            setErrorField("password");
        } else {
            // Le pasa el correo a App (estado global) y entra al inicio
            onLogin(cleanEmail);
            navigate("/");
        }
    }

    return (
        <main className="login-page">

            {/* ===== Columna oscura con la bienvenida ===== */}
            <section className="login-intro">

                {/* Logo: círculo con la A y el nombre */}
                <div className="login-logo">
                    <span className="login-logo-circle">A</span>
                    <span className="login-logo-name">AÚNA</span>
                </div>

                <div className="login-intro-text">
                    <h1>A space of your own,<br />safe and just yours.</h1>
                    <p>Share experiences, find verified resources, and ask for help whenever you need it.</p>
                    <span className="login-tag"><span className="dot"></span>A safe, verified community</span>
                </div>

            </section>

            {/* ===== Columna clara con el formulario ===== */}
            <section className="login-form-side">

                {/* preventDefault evita que la página se recargue al enviar */}
                <form className="login-form" noValidate onSubmit={(event) => {
                    event.preventDefault();
                    handleLogin();
                }}>

                    <h2>Welcome back</h2>
                    <p className="login-subtitle">Log in to continue in your own space.</p>

                    <label htmlFor="login-email">Email address</label>
                    <input type="email" id="login-email" placeholder="you@email.com"
                        className={errorField === "email" ? "login-input error" : "login-input"}
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            clearError();
                        }} />

                    <label htmlFor="login-password">Password</label>
                    <input type="password" id="login-password" placeholder="Your password"
                        className={errorField === "password" ? "login-input error" : "login-input"}
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                            clearError();
                        }} />

                    {/* Aquí se conecta forgotpassword de Cami */}
                    <button type="button" className="login-forgot" onClick={() => setForgotOpen(true)}>
                        Forgot your password?
                    </button>

                    {/* Mensaje de error */}
                    <p className="login-message" role="status">{message}</p>

                    <button type="submit" className="login-button">Log in</button>

                    {/* Línea con "or" en el medio */}
                    <div className="login-divider">
                        <span className="login-line"></span>
                        <span>or</span>
                        <span className="login-line"></span>
                    </div>

                    <p className="login-create">
                        {/* {" "} deja un espacio antes del botón */}
                        Don't have an account?{" "}
                        {/* Abre el modal de crear cuenta (componente CreateProfile de Cami) */}
                        <button type="button" className="login-create-button" onClick={() => setCreateOpen(true)}>
                            Create account
                        </button>
                    </p>

                </form>

            </section>

            {/* Modal de Cami: le paso si está abierto y cómo cerrarlo */}
            <ForgotPassword abierto={forgotOpen} onCerrar={() => setForgotOpen(false)} />

            
            {/* onCrear usa onLogin: al crear la cuenta queda la sesión iniciada (estado global) */}
            <CreateProfile abierto={createOpen} onCerrar={() => setCreateOpen(false)} onCrear={onLogin} />

        </main>
    );
}

export default Login;
