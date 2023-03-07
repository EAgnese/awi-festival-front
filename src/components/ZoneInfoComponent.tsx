import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";
import Jeu from '../models/Jeu';
import ClearIcon from '@mui/icons-material/Clear';
import { getToken, isAdmin, isConnected } from '../middleware/token';
import { notify } from "../middleware/notification";
import { useNavigate, useParams } from "react-router-dom";
import { orange } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import '../assets/zoneInfo.css';

export default function ZoneInfoComponent() {
    const [jeux,setJeux] = useState([])
    let params = useParams(); //recupere les parametre de l'url
    const navigation = useNavigate(); // redirection

    //liste options header requete API
    let headersList = {
        Accept: "*/*",
        Autorization: 'Bearer ' +getToken()?.toString()
    };

    //chargement jeux affecté à la zone
    useEffect(() => {
        let reqOptions = {
            url: "http://localhost:3000/attributionsJeux/zone/"+params.idZone,
            method: "GET",
        }
        axios(reqOptions)
        .then(function (response) {
            setJeux(response.data)
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
                url: "http://localhost:3000/Attributionsjeux/delete",
                method: "DELETE",
                data: {idZone:Number(params.idZone),idJeu: Number(id)},
                headers: headersList
            }
            axios(reqOptions).then(function (response) {
                //filtrer pour enlever le jeu supprimé
                const jeuFiltre = jeux.filter((item : Jeu) => item.idJeu != Number(id))
                setJeux(jeuFiltre)
                notify("Le jeu sélectioné vient d'être retiré de la zone n°"+params.idZone , "success")
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
            <h1>Listes Jeux affecté à la zone</h1>
            <ul>
                {jeux.map((item : Jeu) => 
                    <li className="listeJeu" key={item.idJeu.toString()}>
                        {item.idJeu + ' : ' + item.idType + ',' + item.nom + ','}
                        {isConnected() ?
                        <div>
                            <div>
                                <Button
                                    key={"delete"}
                                    value={item.idJeu.toString()}
                                    onClick={handleDelete}
                                >
                                    <ClearIcon />
                                </Button>
                            </div>
                        </div>
                        :null}
                    </li>
                )}
                <div>
                    <h2>Ajouter un jeu à la zone</h2>   
                    <Button
                        key={"attribuerJeu"}
                    >  
                        <Link to={`/zone/attribution_Jeu/`+params.idZone} className='link'><AddIcon sx={{ color: orange[800] }}/></Link>
                    </Button>
                </div>
            </ul> 
            <div>
                <h1>Listes créneaux & bénévoles</h1>
                <ul>
                    <li>
                    créneau 1
                    <ul>
                        <li>bénévole 1</li>
                        <li>bénévole 2</li>
                        <li>bénévole 3</li>       
                    </ul>
                    </li>
                    <li>créneau 2</li>
                    <ul>
                        <li>bénévole 1</li>
                        <li>bénévole 2</li>
                        <li>bénévole 3</li>       
                    </ul>
                </ul>    
            </div>
            <div id="bouton-attribution">
                <h2>Ajouter un bénévole à la zone & affecter un créneau</h2>  
                <Link to={`/`+params.idZone} className='link'> 
                    <Button
                        key={"attribuerJeu"}
                    >  
                        <AddIcon sx={{ color: orange[800] }}/>
                    </Button>
                </Link>
            </div>  
        </div>
    )
}

