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
import Jeu from "../models/Jeu";

export default function AttributionJeuComponent() {

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
  //chargement jeux
  useEffect(() => {
        let reqOptions = {
            url: "http://localhost:3000/jeux/",
            method: "GET",
        };
        axios(reqOptions)
        .then(function (response) {
            setJeux(response.data);
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
        console.log("submit")
        console.log("JEU SELECT")
        console.log(jeuNom)
        console.log("JEUX")
        console.log(jeux)
        jeux?.map((objet : Jeu) => {
            jeuNom?.map((nom : string) => {
                console.log("DANS LE BOUCLE")
                console.log(objet)
                console.log(nom)
                if(objet.nom === nom){
                    console.log("DEBUT VERIF BD")
                    console.log(objet.idJeu)

                    console.log("ID ZONE")
                    console.log(params.idZone)
                    
                    //verifier si les attributions existent déjà avant l'ajout
                    let reqOptions = {
                        url: "http://localhost:3000/attributionsJeux/zone/"+params.idZone,
                        method: "GET",
                    }
                    console.log(reqOptions.url)
                    axios(reqOptions)
                    .then(function (response) {
                        console.log("response")
                        console.log(response.data)
                       if(response.data.length == 0){
                            console.log("AUCUNE ATTRIBUTION")
                            //attribution du jeu à la zone
                            let reqOptions2 = {
                                url: "http://localhost:3000/attributionsJeux/create/",
                                method: "POST",
                                data : {idZone:params.idZone ,idJeu: objet.idJeu},
                                headers: headersList
                            }
                            axios(reqOptions2)
                            .then(function (response) {
                                notify('Le jeu : "'+nom+' a été ajouté', "success")
                            })
                            .catch(error2 => {
                                console.log("EORRER")
                                //verif connexion reseau
                                if(error2.response != null){
                                    notify(error2.response.data.msg, "error")
                                }else{
                                    notify(error2.message, "error")
                                }
                            })
                       }            
                    })
                    .catch(error => {
                        console.log("JEUFHEUFHE")
                        console.log(error)
                        //verif connexion reseau
                        if(error.response != null){
                            notify(error.response.data.msg, "error")
                        }else{
                            notify(error.message, "error")
                        }
                    })
                }
            })
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
        <h1>Attribution des Jeux à la zone</h1>
        <h2>Liste des jeux</h2>
        <ul>
            {jeux.map((item : Jeu) => 
                <li className="listeJeu" key={item.idJeu.toString()}>
                    {item.idJeu + ' : ' + item.idType + ',' + item.nom + ','}
                </li>
            )}
        </ul>
        <form onSubmit={handleSubmit}>
            <InputLabel id="multiple-checkbox-label">Listes jeux disponibles dans la zone</InputLabel>
            <Select
            labelId="multiple-checkbox-label"
            multiple
            value={jeuNom}
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
            <input type="submit"/>
        </form>
    </div>
  )
}
