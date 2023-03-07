export default interface Attribution {
    zone : {
        id: number
        nom: string
    }
    creneau : {
        id : number
        dateDebut : Date
        dateFin : Date
    }
    benevole : {
        id : number
        nom : string
        prénom : string
    }
}