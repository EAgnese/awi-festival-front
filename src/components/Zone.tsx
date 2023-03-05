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
import AddIcon from '@mui/icons-material/Add';
import '../assets/zone.css';

export default function JeuComponent() {
   const zones = [
        '{idZone: 1, nom: "frite"}',
        '{idZone: 2, nom: "pizza"}',
        '{idZone: 3, nom: "boisson"}',
        '{idZone: 4, nom: "dessert"}',
        '{idZone: 5, nom: "sauce"}',
        '{idZone: 6, nom: "pain"}',
        '{idZone: 7, nom: "viande"}',
    ]
    return (
        <div>
           <h1>Listes zones</h1>
            <ul>
                {zones.map((item : string) => 
                    <li className="listeZone" key={item}>
                        {item}
                        {isConnected() ?
                        <div>
                            <Button
                                key={"attribuerJeu"}
                            >  
                                <Link to={`attribution_Jeu/3`} className='link'><AddIcon sx={{ color: orange[800] }}/></Link>
                            </Button>
                        </div>
                        :null}
                    </li>
                )}
            </ul>
        </div>
    )
}

