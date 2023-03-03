import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";
import Utilisateur from '../models/Utilisateur';
import ClearIcon from '@mui/icons-material/Clear';
import { getToken, isAdmin, isConnected } from '../middleware/token';
import { notify } from "../middleware/notification";


export default function UtilisateurComponent() {
    const [utilisateurs,setUtilisateur] = useState([])

    //liste options header requete API
    let headersList = {
        Accept: "*/*",
        Autorization: 'Bearer ' +getToken()?.toString()
    };

    useEffect(() => {
        let reqOptions = {
            url: "http://localhost:3000/utilisateurs/",
            method: "GET",
        };
        axios(reqOptions)
        .then(function (response) {
            setUtilisateur(response.data);
        })
        .catch(error => {
            //verif connexion reseau
            if(error.response != null){
                notify(error.response.data.msg, "error")
            }else{
                notify(error.message, "error")
            }
        })
    },[]) 

    const handleDelete = (event:  React.MouseEvent<HTMLElement>) => {
        const id = event.currentTarget.getAttribute("value")
        if(isAdmin()){
            let reqOptions = {
                url: "http://localhost:3000/utilisateurs/delete",
                method: "DELETE",
                data: {idUtilisateur: Number(id)},
                headers: headersList
            }
            axios(reqOptions).then(function (response) {
                //filtrer pour enlever l'utilisateur supprimé
                const utilisateurFiltre = utilisateurs.filter((item : Utilisateur) => item.idUtilisateur != Number(id))
                setUtilisateur(utilisateurFiltre)
                notify("Utilisateur supprimé", "success")
            })
            .catch(error => {
                //verif connexion reseau
                if(error.response != null){
                    notify(error.response.data.msg, "error")
                }else{
                    notify(error.message, "error")
                }
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
                        {isAdmin() ?
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
            {isConnected() ? null:
                <Button
                    variant="contained"
                >
                    <Link to={`create/`} className='link'>Devenir bénévole</Link>
                </Button>
            }
            {isAdmin() ?
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

