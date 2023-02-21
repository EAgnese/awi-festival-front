import { useState, useEffect } from 'react';
import Jeu from '../models/Jeu'
import TypeJeu from '../models/typeJeu'
import { useParams } from "react-router-dom";
import axios from "axios";

export default function JeuComponent() {

    const {idJeu} = useParams()

    const [jeu,setJeu] = useState<Jeu>({idJeu : 0, idType:0,nom : ''})
    const [typejeu,setTypeJeu] = useState<TypeJeu>({idType:0,nom : ''})
    let headersList = {
        Accept: "*/*",
        Autorization: localStorage.getItem("token"),
    };

    useEffect(() => {  
        let reqOptionsJeu = {
            url: "http://localhost:3000/jeux/" + idJeu ,
            method: "get",
        };
        
        axios(reqOptionsJeu).then((resp) => {

            setJeu(resp.data[0])

            let reqOptionsType = {
                url: "http://localhost:3000/typesJeux/" + resp.data[0].idType,
                method: "get",
            };
            
            axios(reqOptionsType).then((response) =>{
                setTypeJeu(response.data[0]);
            });

        });

        
    },[]); 

    return (
        <div>
            <p>yo</p>
            <p>{jeu.nom}</p>
            <p>{typejeu.nom}</p>
        </div>
    )
}

