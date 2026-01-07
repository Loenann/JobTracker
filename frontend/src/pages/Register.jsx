import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register(){
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () =>{
        await api.post("/register", {email, password});
        navigate("/login");
    };

    return(
        <div>
            <h1>Register</h1>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)}/><br></br>
            <input 
                type="password" 
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            /><br></br>
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}