import React, { useState, useEffect } from 'react';
import Benevole from '../models/Benevole';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";

export default function BenevoleComponent() {

    const [benevoles,setBenevole] = useState([])
    let headersList = {
        Accept: "*/*",
        Autorization: localStorage.getItem("token"),
    };

    useEffect(() => {
        let reqOptions = {
            url: "http://localhost:3000/benevoles/",
            method: "get",
          };
        
        axios(reqOptions).then(function (response) {
            setBenevole(response.data);
        });
    },[]); 

    return (
        <div>
            <h1>Listes benevoles</h1>
            <ul>
                {benevoles.map((item : Benevole) => 
                    <li key={item.idBenevole.toString()}>
                        {item.idBenevole + ' : ' + item.nom + ',' + item.prenom + ',' + item.email + ',' + item.mdp}
                    </li>
                )}
            </ul>
            <Button
                variant="contained"
                >
                <Link to={`create/`} className='link'>Devenir bénévole</Link>
            </Button>
        </div>
    )
}

