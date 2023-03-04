import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getToken, isConnected, isAdmin, memeId } from "../middleware/token";
import { notify } from "../middleware/notification";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import TypeJeu from "../models/TypeJeu";
import '../assets/jeu.css';
import { createTheme } from '@mui/material/styles';

//passage parametre entre component
interface PropsJeuForm {
  isUpdate : Boolean
}

export default function JeuFormComponent(props : PropsJeuForm) {

  const [nom, setNom] = useState("");
  const [idType, setIdType] = useState("");
  const navigation = useNavigate(); // redirection
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

  //types jeux chargé de la bd
  const [typeJeux,setTypeJeux] = useState<TypeJeu[]>([])

  //type jeu sélectionné
  const [typeJeuxSelection, setTypeJeuxSelection] = useState("");

  const handleChange = (event : SelectChangeEvent) => {
    setTypeJeuxSelection(event.target.value);
  };

  //liste options header requete API
  let headersList = {
    Accept: "*/*",
    Autorization: 'Bearer ' +getToken()?.toString()
  };

  //chargement données update
  useEffect(() => {
    if(props.isUpdate){
      if(isAdmin()){
        let reqOptions = {
          url: "http://localhost:3000/jeux/"+params.idJeu,
          method: "GET",
          headers: headersList
        };
        axios(reqOptions)
        .then(function (response) {
          setNom(response.data[0].nom)
          setIdType(response.data[0].idType)
        })
        .catch(error => {
          //verif connexion reseau
          if(error.response != null){
            notify(error.response.data.msg, "error")
          }else{
            notify(error.message, "error")
          }
        });
      }else{
        notify("Vous n'avez pas les droits pour accéder à cette page", "error")
        navigation("../")
      }
    }
  },[params.idJeu]); 


  //chargement données type de jeu
  useEffect(() => {
    let reqOptions = {
      url: "http://localhost:3000/typeJeux/",
      method: "GET",
    };
    axios(reqOptions)
    .then(function (response) {
        setTypeJeux(response.data);
    })
    .catch(error => {
      //verif connexion reseau
      if(error.response != null){
        notify(error.response.data.msg, "error")
      }else{
        notify(error.message, "error")
      }
    })
  },[typeJeux])

  //gère le submit update ou create des inputs
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // id TypeJeu selectionné
    const idTypeSelect = JSON.parse(typeJeuxSelection).idType
    event.preventDefault() //evite de reactualiser la page quand on submit
    let data = {}
    let typeRequete = ""
    let method = ""

    //si on est sur la création
    if(!props.isUpdate){
      typeRequete = "create"
      method = "POST"
      data = {idType:idTypeSelect, nom: nom}
      console.log(data)
    }else{ // si on est sur l'update'
      typeRequete = "update"
      method = "PUT"
      data = {idJeu: params.idJeu,idType: idTypeSelect, nom: nom, }
    }

    let reqOptions = {
      url: "http://localhost:3000/jeux/"+typeRequete,
      method: method,
      data: data,
      headers: headersList
    };
    axios(reqOptions).then(function (response) {
      if(props.isUpdate){
        notify("Données modifiées ", "success")
        navigation("../")
      }else{
        notify("jeu créé ", "success")
        navigation("../")
      }
    })
    .catch(error => {
      //verif connexion reseau
      if(error.response != null){
        notify(error.response.data.msg, "error")
      }else{
        notify(error.message, "error")
      }
    })
  }
  return (
    <div>
      {props.isUpdate? <h1>Modification d'un jeu</h1> : <h1>Création d'un jeu</h1>}
      <form onSubmit={handleSubmit}>
        <label>Nom: *
          <input 
            required
            type="text" 
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </label>
        <InputLabel id="select-multiple">Type du jeu</InputLabel>
        <Select
          labelId="select-multiple"
          required
          value={typeJeuxSelection || ""}
          id="select-type-jeu"
          onChange={handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
              
                <Chip key={JSON.parse(selected).idType} label={JSON.parse(selected).nom} color="primary"/>
              
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {typeJeux?.map((objet : TypeJeu) => (
            <MenuItem
              key={objet.idType}
              value={JSON.stringify({
                idType : objet.idType,
                nom : objet.nom
              })}
            >
              {objet.nom}
            </MenuItem>
          ))}
        </Select>
        <input type="submit"/>
      </form>
    </div>
  )
}
