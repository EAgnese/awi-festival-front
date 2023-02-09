import '../assets/TypeJeu.css';
import React, { useState, useEffect } from 'react';
import TypeJeu from '../models/typeJeu'

export default function TypeJeuComponent() {

    const [typesJeu,setTypeJeu] = useState([])

    let url = "http://localhost:3000/"

    useEffect(() => {  
        console.log("console log à la con")
        fetch(url + "typesJeux/", {
            method: "GET"
        }).then( (rep) =>{
            rep.json().then((data)=>{
                setTypeJeu(data);
            })
        })
    },[]); 

    return (
        <div>
            <h1>prout</h1>
            <ul id="test">
                {typesJeu.map((item : TypeJeu) => 
                    <li key={item.idType.toString()}>{item.idType + ' : ' + item.nom}</li>
                )}
            </ul>
        </div>
    )
}

