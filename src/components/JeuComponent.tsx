import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";
import Jeu from '../models/Jeu';
import TypeJeu from '../models/TypeJeu';
import ClearIcon from '@mui/icons-material/Clear';
import { getToken, isAdmin, isConnected } from '../middleware/token';
import { notify } from "../middleware/notification";
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { green, blue, yellow, grey,orange } from '@mui/material/colors';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import '../assets/jeu.css';
import Zone from '../models/Zone';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

export default function JeuComponent() {
    const [jeux,setJeux] = useState([])
    const [typesJeux,setTypesJeux] = useState([])
    const [zones,setZones] = useState([])
    const [zoneSelect, setZoneSelect] = useState("")
    const [typeSelect, setTypeSelect] = useState("")
    const [donneesJeu, setDonneesJeu] = useState<string[]>([])

    let min=0; 
    let max=4;  
    let listeCouleur = ["container-card bg-blue-box","container-card bg-green-box","container-card bg-white-box","container-card bg-yellow-box"]
    let listeCouleurLogo = [blue[800],green[800],grey[50],yellow[800]]


    const handleChangeType = (event: SelectChangeEvent) => {
        console.log("type")
        console.log(donneesJeu)
        /*
        const jeuxFiltres = jeux.filter((objet : Jeu) => {
            return objet.nom.toLowerCase().includes(event.target.value.toLowerCase())
        })
        setJeux(jeuxFiltres)*/
    };

    const handleChangeZone = (event: SelectChangeEvent) => {
        console.log("change zone")
        console.log(zones)
        /*
        const jeuxFiltres = jeux.filter((objet : Jeu) => {
            return objet.nom.toLowerCase().includes(event.target.value.toLowerCase())
        })
        setJeux(jeuxFiltres)*/
    };

    const handleChangeNom = (event: SelectChangeEvent) => {
        console.log("change nom")
        console.log(donneesJeu)
        /*
        const jeuxFiltres = jeux.filter((objet : Jeu) => {
            return objet.nom.toLowerCase().includes(event.target.value.toLowerCase())
        })
        setJeux(jeuxFiltres)*/
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
            const tabInfoJeu = [] as string[]
            jeux.map((objet : Jeu) => {
                let reqOptions = {
                    url: "http://localhost:3000/jeux/info",
                    method: "GET",
                    data : {idJeu : objet.idJeu}
                };
                axios(reqOptions)
                .then(function (response) {
                    tabInfoJeu.push(response.data)
                })
                .catch(error => {
                    //verif connexion reseau
                    if(error.response != null){
                        notify(error.response.data.msg, "error")
                    }else{
                        notify(error.message, "error")
                    }
                })
            })
            if(tabInfoJeu.length > 0){
                setDonneesJeu(tabInfoJeu)
                console.log("TES")
                console.log(donneesJeu)
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
    },[]) 

    //chargement types
    useEffect(() => {
        let reqOptions = {
            url: "http://localhost:3000/typeJeux/",
            method: "GET",
        };
        axios(reqOptions)
        .then(function (response) {
            setTypesJeux(response.data);
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

    //chargement zones
    useEffect(() => {
        let reqOptions = {
            url: "http://localhost:3000/zones/",
            method: "GET",
        };
        axios(reqOptions)
        .then(function (response) {
            setZones(response.data);
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

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(1),
          width: 'auto',
        },
      }));
      
      const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }));
      
      const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
              width: '20ch',
            },
          },
        },
      }));
      

    const handleDelete = (event:  React.MouseEvent<HTMLElement>) => {
        const id = event.currentTarget.getAttribute("value")
        if(isAdmin()){
            let reqOptions = {
                url: "http://localhost:3000/jeux/delete",
                method: "DELETE",
                data: {idJeu: Number(id)},
                headers: headersList
            }
            axios(reqOptions).then(function (response) {
                //filtrer pour enlever le jeu supprimé
                const jeuFiltre = jeux.filter((item : Jeu) => item.idJeu != Number(id))
                setJeux(jeuFiltre)
                notify("jeu supprimé", "success")
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
            <br />
            <div>
                <div id="barre-recherche">
                    <Search>
                        <SearchIconWrapper>
                        <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Rechercher..."
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </div>
                <br />
                <div>
                    <div>
                        <div id="input-type">
                            <FormControl fullWidth>
                                <InputLabel id="input-type-label">Rechercher par type</InputLabel>
                                <Select
                                    labelId="input-type-label"
                                    id="select-type"
                                    value={typeSelect}
                                    //label="Age"
                                    onChange={handleChangeType}
                                    >
                                        {typesJeux?.map((objet : TypeJeu) => (
                                        <MenuItem
                                            key={objet.nom}
                                            value={objet.nom}
                                        >
                                        {objet.nom}
                                        </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div id="input-Zone">
                            <FormControl fullWidth>
                                <InputLabel id="input-zone-label">Rechercher par zone</InputLabel>
                                <Select
                                    labelId="input-zone-label"
                                    id="select-zone"
                                    value={zoneSelect}
                                    //label="Age"
                                    onChange={handleChangeZone}
                                    >
                                        {zones?.map((objet : Zone) => (
                                        <MenuItem
                                            key={objet.nom}
                                            value={objet.nom}
                                        >
                                        {objet.nom}
                                        </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
            </div>
            <h1>Listes Jeux</h1>
            <div id="div-jeu">
                {jeux?.map((item : Jeu) => (
                    <div className="gradient-cards">
                        <div>
                            <div className={listeCouleur[Math.floor(Math.random() * (max - min)) + min]}>
                                <SportsEsportsIcon sx={{ width: 70,height: 70, color: listeCouleurLogo[Math.floor(Math.random() * (max - min)) + min] }}/>
                                <p key={"p-idJeu"+item.idJeu} className="card-title">{"Jeu n°" +item.idJeu}</p>
                                <p key={"p-idType"+item.idJeu} className="card-description">{"idType : "+item.idType}</p>
                                <p key={"p-nom"+item.idJeu} className="card-description">{"Nom du jeu : "+item.nom}</p>
                                {isAdmin() ?
                                    <div key={"div-"+item.idJeu}>
                                        <Button
                                            key={"delete"+item.idJeu}
                                            value={item.idJeu.toString()}
                                            onClick={handleDelete}
                                        >
                                            <ClearIcon sx={{color: blue[800] }}/>
                                        </Button>
                                        
                                        <Link to={`update/`+item.idJeu} className='link'>
                                            <Button
                                                key={"update"+item.idJeu}
                                            >  
                                               <EditIcon sx={{color: orange[800] }}/>
                                            </Button>
                                        </Link>
                                    </div>
                                :null}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div id="div-creation-jeu">
                {isAdmin() ?
                    <Link to={`create/`} className='link'>
                        <Button
                            variant="contained"
                            id="button-create"

                        >
                            Créer jeu
                        </Button>
                    </Link>
                    :null
                }
            </div>       
        </div>
    )
}

