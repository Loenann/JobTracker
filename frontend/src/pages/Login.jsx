import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () =>{
        try{
            const res = await api.post("/login", {identifier, password});
            localStorage.setItem("token", res.data.token);
            navigate("/");
        } catch {
            setError("Invalid Credentials");
        }
    };

    const noAccount = async () =>{
        navigate("/register")
    }

    return(
        <div>
            <h1>Login</h1>
            {error && <p>{error}</p>}
            <input placeholder="Email / Username" onChange={(e) => setIdentifier(e.target.value)}/><br></br>
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            /><br></br>
            <button onClick={handleLogin}>Login</button>
            <p>Don't have an account?</p> <button onClick={noAccount}>Register</button>
        </div>
    );
}