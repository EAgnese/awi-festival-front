import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";
import Utilisateur from '../models/Utilisateur';

export default function UtilisateurComponent() {
    const [utilisateurs,setUtilisateur] = useState([])

    let headersList = {
        Accept: "*/*",
        Autorization: localStorage.getItem("token"),
    };

    useEffect(() => {
        let reqOptions = {
            url: "http://localhost:3000/utilisateurs/",
            method: "get",
        };
        
        axios(reqOptions).then(function (response) {
            setUtilisateur(response.data);
        });

    },[]); 

    return (
        <div>
            <h1>Listes Bénévoles</h1>
            <ul>
                {utilisateurs.map((item : Utilisateur) => 
                    <li key={item.idUtilisateur.toString()}>
                        {item.idUtilisateur + ' : ' + item.nom + ',' + item.prenom + ','}
                    </li>
                )}
            </ul>        
            {localStorage.getItem("idUtilisateur")!=null ? null:
                <Button
                    variant="contained"
                >
                    <Link to={`create/`} className='link'>Devenir bénévole</Link>
                </Button>
            }
        </div>
    )
}

