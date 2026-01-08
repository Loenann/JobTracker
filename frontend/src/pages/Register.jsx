import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register(){
    const[email, setEmail] = useState("");
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () =>{
        try{
            await api.post("/register", {email, username, password});
            navigate("/login");
        } catch (err){
            if (err.response && err.response.data?.error){
                setError(err.response.data.error);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return(
        <div>
            <h1>Register</h1>
            {error && <p>{error}</p>}
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)}/><br></br>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)}/><br></br>
            <input 
                type="password" 
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            /><br></br>
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}