import {useState, useEffect} from "react";
import axios from "axios";
import { notify } from "../middleware/notification";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate, useParams } from "react-router-dom";
import { getIdUtilisateur, getToken} from "../middleware/token";


import '../assets/jeu.css';
import { createTheme } from '@mui/material/styles';
import Creneau from "../models/Creneau";

export default function AttributionJeuComponent() {

    const navigation = useNavigate(); // redirection
    const [creneaux,setCreneaux] = useState([])
    //creneau sélectionné
    const [creneauSelected, setCreneauSelected] = useState<string[]>([]);
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
            url: "http://localhost:3000/attributionsZone/zone-benevole/" + params.idZone +'/' + getIdUtilisateur(),
            method: "GET",
        }
        axios(reqOptions)
        .then(function (response) {
            if(response.data.length == 0){
                navigation("../zone/")
                notify("Tous les jeux sont déjà affectés à la zone sélectionnée", "info")
            }
            const temp = response.data.map((item : Creneau) => {
                const tempDebut = new Date(item.dateDebut)
                const tempFin = new Date(item.dateDebut)
                return {
                    idCreneau: item.idCreneau,
                    dateDebut : tempDebut,
                    dateFin : tempFin
                }
            } )
            setCreneaux(temp)
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //verification zone existante
        
        const tempID = creneauSelected.map(item => {
            return item.split(' ')[1]
        })

        let reqOptions = {
            url: "http://localhost:3000/zones/"+params.idZone,
            method: "GET",
        }
        axios(reqOptions)
        .then(function (response) {
            if(response.data.length == 0){
                notify("La zone n'existe pas", "error")
            }else{
                creneaux?.map((objet : Creneau) => {
                    tempID?.map((id : string) => {
                        if(String(objet.idCreneau) === id){                                
                            //verifier si les attributions existent déjà avant l'ajout
                            let reqOptions2 = {
                                url: "http://localhost:3000/attributionsZone/all",
                                method: "GET",
                                data: {idZone:Number(params.idZone) ,idUtilisateur: getIdUtilisateur(), idCreneau : objet.idCreneau}
                            }
                            axios(reqOptions2)
                            .then(function (response) {
                                if(response.data.length == 0){
                                    //attribution du jeu à la zone
                                    let reqOptions3 = {
                                        url: "http://localhost:3000/attributionsZone/create/",
                                        method: "POST",
                                        data : {idZone:Number(params.idZone)  ,idUtilisateur: getIdUtilisateur(), idCreneau : objet.idCreneau},
                                        headers: headersList
                                    }
                                    axios(reqOptions3)
                                    .then(function (response) {
                                        notify('Le créneau : "'+id+' a été ajouté', "success")
                                        navigation("../zone/")
                                    })
                                    .catch(error2 => {
                                        if(error2.response != null){
                                            if(error2.response.data.msg != null){
                                                notify(error2.response.data.msg, "error")
                                            }else{
                                                notify(error2.response.data, "error")
                                            }
                                        }else{
                                            notify(error2.message, "error")
                                        }
                                    })
                                }            
                            })
                            .catch(error => {
                                if(error.response != null){
                                    if(error.response.data.msg != null){
                                        notify(error.response.data.msg, "error")
                                    }else{
                                        notify(error.response.data, "error")
                                    }
                                }else{
                                    notify(error.message, "error")
                                }
                            })
                        }
                    })
                })
            }
            
        })
        .catch(error2 => {
            //verif connexion reseau
            if(error2.response != null){
                if(error2.response.data.msg != null){
                    notify(error2.response.data.msg, "error")
                }else{
                    notify(error2.response.data, "error")
                }
            }else{
                notify(error2.message, "error")
            }
        })
    }

    const handleChange = (event: SelectChangeEvent<typeof creneauSelected>) => {
      const {
        target: { value },
      } = event;

      

      setCreneauSelected(
        // auto remplissement -> stringify value.
        typeof value === 'string' ? value.split(',') : value
      );
    };

    return (
    <div>
        {creneaux.length == 0 ? null
        :
        <div>
            <h1>Attribution d'un Bénévole à la zone</h1>
            <h2>Liste des Créneaux</h2>
            <ul>
                {creneaux?.map((item : Creneau) => 
                    <li className="listeJeu" key={item.idCreneau.toString()}>
                        {
                            'Créneau ' + item.idCreneau + ' : ' + 
                            item.dateDebut.getDate() + '/' + item.dateDebut.getMonth() + ' ' + item.dateDebut.getHours() + ':' + item.dateDebut.getMinutes() + ', ' +
                            item.dateFin.getDate() + '/' + item.dateFin.getMonth() + ' ' + item.dateFin.getHours() + ':' + item.dateFin.getMinutes()  
                        }
                    </li>
                )}
                
            </ul>
            <form onSubmit={handleSubmit}>
                <InputLabel id="multiple-checkbox-label">Listes jeux disponibles dans la zone</InputLabel>
                <Select
                labelId="multiple-checkbox-label"
                multiple
                value={creneauSelected}
                onChange={handleChange}
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
                    <MenuItem key={objet.idCreneau} value={'Creneau ' + objet.idCreneau}>
                        <Checkbox checked={creneauSelected.indexOf('Creneau ' + objet.idCreneau) > -1} />
                        <ListItemText primary={'Creneau ' + objet.idCreneau} />
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
