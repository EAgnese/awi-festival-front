import "../assets/JeuList.css"
import { useState, useEffect } from 'react'
import Jeu from '../models/Jeu'
import { Link } from "react-router-dom"
import axios from "axios"

export default function JeuListComponent() {

    const [typesJeu,setTypesJeu] = useState([])
    let headersList = {
        Accept: "*/*",
        Autorization: localStorage.getItem("token"),
    };

    useEffect(() => {  
        let reqOptions = {
            url: "http://localhost:3000/jeux/",
            method: "get",
        };
        
        axios(reqOptions).then(function (response) {
            console.log(response.data)
            setTypesJeu(response.data)
        });
    },[]); 

    return (
        <div>
            <h1>Liste des types de jeu</h1>
            <div id="test">
                {typesJeu.map((item : Jeu) => 
                    <Link to={{pathname : String(item.idJeu)}} state = {{item}} className='lien-jeu'>{item.idJeu + ' : ' + item.nom}</Link>
                )}
            </div>
        </div>
    )
}