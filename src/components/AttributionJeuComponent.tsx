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
import { green, blue, yellow, grey,orange } from '@mui/material/colors';
import '../assets/attributionJeu.css';



import '../assets/jeu.css';
import { createTheme } from '@mui/material/styles';
import Jeu from "../models/Jeu";

export default function AttributionJeuComponent() {

    const navigation = useNavigate(); // redirection
    const [jeux,setJeux] = useState([])
    //jeu sélectionné
    const [jeuNom, setJeuNom] = useState<string[]>([]);
    let params = useParams(); //recupere les parametre de l'url

    //couleur select
    const theme = createTheme({
    palette: {
        primary: {
        main: '#0971f1',
        },
    },
    });
    let min=0; 
    let max=4;  
    let listeCouleur = ["container-card bg-blue-box","container-card bg-green-box","container-card bg-white-box","container-card bg-yellow-box"]
    let listeCouleurLogo = [blue[800],green[800],grey[50],yellow[800]]

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
            url: "http://localhost:3000/attributionsJeux/jeu/zone/"+params.idZone,
            method: "GET",
        }
        axios(reqOptions)
        .then(function (response) {
            if(response.data.length == 0){
                navigation("../zone/")
                notify("Tous les jeux sont déjà affectés à la zone sélectionnée", "info")
            }
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //verification zone existante
        let reqOptions = {
            url: "http://localhost:3000/zones/"+params.idZone,
            method: "GET",
        }
        axios(reqOptions)
        .then(function (response) {
            if(response.data.length == 0){
                notify("La zone n'existe pas", "error")
            }else{
                jeux?.map((objet : Jeu) => {
                    jeuNom?.map((nom : string) => {
                        if(objet.nom === nom){                                
                            //verifier si les attributions existent déjà avant l'ajout
                            let reqOptions2 = {
                                url: "http://localhost:3000/attributionsJeux/zone",
                                method: "GET",
                                data: {idZone:params.idZone ,idJeu: objet.idJeu}
                            }
                            axios(reqOptions2)
                            .then(function (response) {
                                if(response.data.length == 0){
                                    //attribution du jeu à la zone
                                    let reqOptions3 = {
                                        url: "http://localhost:3000/attributionsJeux/create/",
                                        method: "POST",
                                        data : {idZone:params.idZone ,idJeu: objet.idJeu},
                                        headers: headersList
                                    }
                                    axios(reqOptions3)
                                    .then(function (response) {
                                        notify('Le jeu : "'+nom+' a été ajouté', "success")
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

    const handleChange = (event: SelectChangeEvent<typeof jeuNom>) => {
      const {
        target: { value },
      } = event;
      setJeuNom(
        // auto remplissement -> stringify value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };

    return (
    <div>
        {jeux.length == 0 ? null
        :
        <div>
            <h1>Liste des jeux disponibles</h1>
            <div id="div-utilisateur">
                {jeux?.map((item : Jeu) => (
                    <div className="gradient-cards">
                        <div>
                            <div className={listeCouleur[Math.floor(Math.random() * (max - min)) + min]}>
                                <p key={"p-idJeu"+item.idJeu} className="card-title">{"Jeu n°" +item.idJeu}</p>
                                <p key={"p-idType"+item.idJeu} className="card-description">{"idType : "+item.idType}</p>
                                <p key={"p-nom"+item.idJeu} className="card-description">{"nom : "+item.nom}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <h2 id="multiple-checkbox-label">Choix des jeux à ajouter</h2>
            <form id="formSelect" onSubmit={handleSubmit}>
                <Select
                multiple
                value={jeuNom}
                id="select-type-jeu"
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
                {jeux?.map((objet : Jeu) => (
                    <MenuItem key={objet.nom} value={objet.nom}>
                        <Checkbox checked={jeuNom.indexOf(objet.nom) > -1} />
                        <ListItemText primary={objet.nom} />
                    </MenuItem>
                ))}
                </Select>
                <input id="bouton-submit" type="submit"/>
            </form>
        </div>
        }
    </div>
    )
}
