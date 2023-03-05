import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import "../assets/JeuList.css"
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";
import Zone from '../models/Zone';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getToken, getIdUtilisateur, isAdmin, isConnected } from '../middleware/token';

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
                    <li key={item.idZone.toString()}>
                        {item.nom }
                        {isConnected() ?
                        <Button
                            key={"attrib"}
                            className = {"add-attrib"}
                            value={item.idZone.toString()}
                            onClick={handleAddAttrib}
                            >
                            <AddCircleOutlineIcon />
                        </Button>
                        
                        :null}
                    </li>
                )}
            </ul>  
        </div>
    )
}