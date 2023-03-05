import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";
import Zone from '../models/Zone';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getToken, getIdUtilisateur, isAdmin, isConnected } from '../middleware/token';
import { notify } from "../middleware/notification";
import { orange } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import '../assets/zone.css';

export default function ZoneComponent(){
    const [zones,setZones] = useState([])

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
            <ul>
                {zones.map((item : Zone) => 
                    <li className="listeZone" key={item.idZone.toString()}>
                        <Link to={`/zone/`+item.idZone} className='link'> {item.nom}</Link>
                        {isConnected() ?
                        <div>
                            <Button
                                key={"attrib"}
                                className = {"add-attrib"}
                                value={item.idZone.toString()}
                                >
                                <Link to={`attribution_zone/`+item.idZone}><AddCircleOutlineIcon/></Link>
                            </Button>
                            <Button
                                key={"attribuerJeu"}
                            >  
                                <Link to={`attribution_Jeu/`+item.idZone}><AddIcon sx={{ color: orange[800] }}/></Link>
                            </Button>
                        </div>
                        :null}
                    </li>
                )}
            </ul>  
        </div>
    )
}