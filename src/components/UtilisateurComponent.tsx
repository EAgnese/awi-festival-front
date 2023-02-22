import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";
import Utilisateur from '../models/Utilisateur';
import ClearIcon from '@mui/icons-material/Clear';

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

    const handleDelete = (event:  React.MouseEvent<HTMLElement>) => {
        const id = event.currentTarget.getAttribute("value")
        if(Number(localStorage.getItem("isAdmin"))==1){
            let reqOptions = {
                url: "http://localhost:3000/utilisateurs/delete",
                method: "delete",
                data: {idUtilisateur: Number(id)},
            }
            axios(reqOptions).then(function (response) {
                //filtrer pour enlever l'utilisateur supprimé
                const utilisateurFiltre = utilisateurs.filter((item : Utilisateur) => item.idUtilisateur != Number(id))
                
                setUtilisateur(utilisateurFiltre)
                localStorage.removeItem("email")
                localStorage.removeItem("idUtilisateur")
                localStorage.removeItem("isAdmin")
            });
        } 
    };

    return (
        <div>
            <h1>Listes Bénévoles</h1>
            <ul>
                {utilisateurs.map((item : Utilisateur) => 
                    <li key={item.idUtilisateur.toString()}>
                        {item.idUtilisateur + ' : ' + item.nom + ',' + item.prenom + ','}
                        {Number(localStorage.getItem("isAdmin"))==1 ?
                        <Button
                            key={"delete"}
                            value={item.idUtilisateur.toString()}
                            onClick={handleDelete}
                            >
                            <ClearIcon />
                        </Button>
                        :null}
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
            {Number(localStorage.getItem("isAdmin"))==1 ?
                <Button
                    variant="contained"
                >
                    <Link to={`create/`} className='link'>Créer bénévole</Link>
                </Button>
                :null
            }
        </div>
    )
}

