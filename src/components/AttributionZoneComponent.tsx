import {useState, useEffect} from "react";
import axios from "axios";
import { getToken } from "../middleware/token";
import { notify } from "../middleware/notification";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate, useParams } from "react-router-dom";


import '../assets/jeu.css';
import { createTheme } from '@mui/material/styles';
import Creneau from "../models/Creneau";

export default function AttributionJeuComponent() {

    const navigation = useNavigate(); // redirection
    const [creneaux,setCreneaux] = useState([])
    //creneau sélectionné
    const [creneau, setCreneau] = useState<string[]>([]);
    let params = useParams(); //recupere les parametre de l'url

    //couleur select
    const theme = createTheme({
    palette: {
        primary: {
        main: '#0971f1',
        },
    },
    });

    //style select
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
    };

    //liste options header requete API
    let headersList = {
        Accept: "*/*",
        Autorization: 'Bearer ' +getToken()?.toString()
    };
    //chargement jeux non affecté à la zone
    useEffect(() => {
        //recherche id jeu affecté
        let reqOptions = {
            url: "http://localhost:3000/creneaux",
            method: "GET",
        }
        axios(reqOptions)
        .then(function (response) {
            if(response.data.length == 0){
                navigation("../zone/")
                notify("Tous les jeux sont déjà affectés à la zone sélectionnée", "info")
            }
            setCreneaux(response.data.map())
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



    return (
    <div>
        {creneaux.length == 0 ? null
        :
        <div>
            <h1>Attribution d'un Bénévole à la zone</h1>
            <h2>Liste des Créneaux</h2>
            <ul>
                {creneaux.map((item : Creneau) => 
                    <li className="listeJeu" key={item.idCreneau.toString()}>
                        {item.idCreneau + ' : ' + item.dateDebut + ',' + item.dateFin}
                    </li>
                )}
            </ul>
            <form /*onSubmit={handleSubmit}*/>
                <InputLabel id="multiple-checkbox-label">Listes jeux disponibles dans la zone</InputLabel>
                <Select
                labelId="multiple-checkbox-label"
                multiple
                value={creneau}
                //onChange={handleChange}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} color="primary"/>
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
                >
                {creneaux?.map((objet : Creneau) => (
                    <MenuItem key={objet.idCreneau} value={objet.idCreneau}>
                        <Checkbox /*checked={creneau.indexOf(objet.idCreneau) > -1} *//>
                        <ListItemText primary={objet.idCreneau} />
                    </MenuItem>
                ))}
                </Select>
                <input type="submit"/>
            </form>
        </div>
        }
    </div>
    )
}
