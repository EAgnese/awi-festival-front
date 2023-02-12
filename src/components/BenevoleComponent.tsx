import React, { useState, useEffect } from 'react';
import Benevole from '../models/Benevole';

export default function BenevoleComponent() {

    const [benevoles,setBenevole] = useState([])

    let url = "http://localhost:3000/"

    useEffect(() => {  
        fetch(url + "benevoles/", {
            method: "GET"
        }).then((rep) =>{
            rep.json().then((data)=>{
                setBenevole(data);
            })
        })
    },[]); 

    return (
        <div>
            <h1>Listes benevoles</h1>
            <ul>
                {benevoles.map((item : Benevole) => 
                    <li key={item.idBenevole.toString()}>
                        {item.idBenevole + ' : ' + item.nom + ',' + item.prenom + ',' + item.email}
                    </li>
                )}
            </ul>
        </div>
    )
}

