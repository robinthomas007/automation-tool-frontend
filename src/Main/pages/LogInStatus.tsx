import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCookie } from "../../Lib/auth";
import { useAuth } from "../../Context/authContext";

export default function LogInStatus(){
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const {login} = useAuth()
    useEffect(()=>{
        const token=searchParams.get("token")??''
        if (token!=""){
            setCookie('token',token)
            login()
            navigate("/project")
        }
    },[searchParams])
    return (
        <div>Login Failed</div>
    )
}