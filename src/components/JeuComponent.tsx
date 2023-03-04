import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";
import Jeu from '../models/Jeu';
import ClearIcon from '@mui/icons-material/Clear';
import { getToken, isAdmin, isConnected } from '../middleware/token';
import { notify } from "../middleware/notification";
import EditIcon from '@mui/icons-material/Edit';
import { orange } from '@mui/material/colors';
import '../assets/jeu.css';

export default function JeuComponent() {
    const [jeux,setjeu] = useState([])

    //liste options header requete API
    let headersList = {
        Accept: "*/*",
        Autorization: 'Bearer ' +getToken()?.toString()
    };

    useEffect(() => {
        let reqOptions = {
            url: "http://localhost:3000/jeux/",
            method: "GET",
        };
        axios(reqOptions)
        .then(function (response) {
            setjeu(response.data);
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
                url: "http://localhost:3000/jeux/delete",
                method: "DELETE",
                data: {idJeu: Number(id)},
                headers: headersList
            }
            axios(reqOptions).then(function (response) {
                //filtrer pour enlever le jeu supprimé
                const jeuFiltre = jeux.filter((item : Jeu) => item.idJeu != Number(id))
                setjeu(jeuFiltre)
                notify("jeu supprimé", "success")
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
    }
    return (
        <div>
            <h1>Listes Jeux</h1>
            <ul>
                {jeux.map((item : Jeu) => 
                    <li className="listeJeu" key={item.idJeu.toString()}>
                        {item.idJeu + ' : ' + item.idType + ',' + item.nom + ','}
                        {isAdmin() ?
                        <div>
                            <Button
                                key={"delete"}
                                value={item.idJeu.toString()}
                                onClick={handleDelete}
                            >
                                <ClearIcon />
                            </Button>
                            <Button
                                key={"update"}
                            >  
                                <Link to={`update/`+item.idJeu} className='link'><EditIcon sx={{ color: orange[800] }}/></Link>
                            </Button>
                        </div>
                        :null}
                    </li>
                )}
            </ul>        
            {isAdmin() ?
                <Button
                    variant="contained"
                >
                    <Link to={`create/`} className='link'>Créer jeu</Link>
                </Button>
                :null
            }
        </div>
    )
}

