import React, { useState, useEffect } from 'react';
import Jeu from '../models/Jeu'
import { Link } from "react-router-dom";
import axios from "axios";

export default function JeuListComponent() {

    const [typesJeu,setTypeJeu] = useState([])
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
            console.log(response.data);
            setTypeJeu(response.data);
        });
    },[]); 

    return (
        <div>
            <h1>Liste des types de jeu</h1>
            <div id="test">
                {typesJeu.map((item : Jeu) => 
                    <Link to={`${item.idJeu}`} className='link'>{item.idJeu + ' : ' + item.nom}</Link>
                )}
            </div>
        </div>
    )
}

