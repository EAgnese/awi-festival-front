import jwt_decode from "jwt-decode"

//model token
interface Token{
    idUtilisateur: Number,
    isAdmin: boolean,
}

export function isAdmin(){
    const token = localStorage.getItem("token")
    if(token){
        const decodedToken = jwt_decode(token) as Token
        return decodedToken.isAdmin
    }
    return false
}

export function isConnected(){
    const token = localStorage.getItem("token")
    if(token){
        return true
    }
    return false
}

export function getIdUtilisateur(){
    const token = localStorage.getItem("token")
    if(token){
        const decodedToken = jwt_decode(token) as Token
        return decodedToken.idUtilisateur
    }
    return null
}

export function deconnexion(){
    localStorage.removeItem("token")
}

export function getToken(){
    return localStorage.getItem("token")
}

export function memeId(idUtilisateur: Number){
    return idUtilisateur == getIdUtilisateur()
}