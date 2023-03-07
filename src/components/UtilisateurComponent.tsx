import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";
import Utilisateur from '../models/Utilisateur';
import ClearIcon from '@mui/icons-material/Clear';
import { getToken, isAdmin, isConnected } from '../middleware/token';
import { notify } from "../middleware/notification";
import EditIcon from '@mui/icons-material/Edit';
import { green, blue, yellow, grey,orange } from '@mui/material/colors';
import '../assets/utilisateur.css';
import Face6Icon from '@mui/icons-material/Face6';


export default function UtilisateurComponent() {
    const [utilisateurs,setUtilisateur] = useState([])

    let min=0; 
    let max=4;  
    let listeCouleur = ["container-card bg-blue-box","container-card bg-green-box","container-card bg-white-box","container-card bg-yellow-box"]
    let listeCouleurLogo = [blue[800],green[800],grey[50],yellow[800]]

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
            <div id="div-utilisateur">
                {utilisateurs?.map((item : Utilisateur) => (
                    <div className="gradient-cards">
                        <div>
                            <div className={listeCouleur[Math.floor(Math.random() * (max - min)) + min]}>
                                <Face6Icon sx={{ width: 70,height: 70, color: listeCouleurLogo[Math.floor(Math.random() * (max - min)) + min] }}/>
                                <p key={"p-idUtilateur"+item.idUtilisateur} className="card-title">{"Utilisateur n°" +item.idUtilisateur}</p>
                                <p key={"p-nom"+item.idUtilisateur} className="card-description">{"Nom : "+item.nom}</p>
                                <p key={"p-prenom"+item.idUtilisateur} className="card-description">{"Prénom : "+item.prenom}</p>
                                {isConnected() ? <p className="card-description">{item.email}</p> : null}
                                {isAdmin() ?
                                    <div key={"div-"+item.idUtilisateur}>
                                        <Button
                                            key={"delete"+item.idUtilisateur}
                                            value={item.idUtilisateur.toString()}
                                            onClick={handleDelete}
                                        >
                                            <ClearIcon />
                                        </Button>
                                        
                                        <Link to={`profil/`+item.idUtilisateur} className='link'>
                                            <Button
                                                key={"update"+item.idUtilisateur}
                                            >  
                                               <EditIcon sx={{color: orange[800] }}/>
                                            </Button>
                                        </Link>
                                    </div>
                                :null}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div id="div-creation-benevole">
                {isConnected() ? null:
                    <Link to={`create/`} className='link'>
                        <Button
                            id="button-devenir"
                            variant="contained"
                        >
                            Devenir bénévole
                        </Button>
                    </Link>
                }
                {isAdmin() ?
                     <Link to={`create/`} className='link'>
                        <Button
                            id="button-create"
                            variant="contained"
                        >
                            Créer bénévole
                        </Button>
                    </Link>
                    :null
                }
            </div>
        </div>
    )
}

