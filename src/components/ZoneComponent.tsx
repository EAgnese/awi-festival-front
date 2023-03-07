import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";
import Zone from '../models/Zone';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getToken, getIdUtilisateur, isAdmin, isConnected } from '../middleware/token';
import { notify } from "../middleware/notification";
import { green, blue, yellow, grey,orange } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import PublicIcon from '@mui/icons-material/Public';
import '../assets/zone.css';

export default function ZoneComponent(){
    const [zones,setZones] = useState([])

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
            url: "http://localhost:3000/zones/",
            method: "GET",
        };
        
        axios(reqOptions).then(function (response) {
            setZones(response.data);
        }).catch(error => {
            //verif connexion reseau
            if(error.response != null){
                notify(error.response.data.msg, "error")
            }else{
                notify(error.message, "error")
            }
        });
    },[]); 

    const handleAddAttrib = (event:  React.MouseEvent<HTMLElement>) => {
        const id = event.currentTarget.getAttribute("value")
        console.log(id)
        console.log(getIdUtilisateur())
    };

    return(
        <div>
            <h1>Liste Zones</h1>
            <div id="div-zone">
                {zones?.map((item : Zone) => (
                    <div className="gradient-cards">
                        <div>
                            <div className={listeCouleur[Math.floor(Math.random() * (max - min)) + min]}>
                                <PublicIcon sx={{ width: 70,height: 70, color: listeCouleurLogo[Math.floor(Math.random() * (max - min)) + min] }}/>
                                <p key={"p-idZone"+item.idZone} className="card-title">{"Zone n°" +item.idZone}</p>
                                <Link to={`/zone/`+item.idZone} key={"p-nom"+item.idZone} className='linkZone'> {"Nom: "+item.nom}</Link>
                                {isConnected() ?
                                    <div>
                                        <Link to={`attribution_zone/`+item.idZone}>
                                            <Button
                                                key={"attrib"}
                                                className = {"add-attrib"}
                                                value={item.idZone.toString()}
                                                >
                                                    <AddCircleOutlineIcon sx={{color: blue[800] }}/>
                                            </Button>
                                        </Link>
                                        <Link to={`attribution_Jeu/`+item.idZone}>
                                            <Button
                                                key={"attribuerJeu"}
                                            >  
                                                Ajouter un jeu à la zone
                                            </Button>
                                        </Link>
                                    </div>
                                :null}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}