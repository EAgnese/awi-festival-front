import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//fonction pour notifier l'utilisateur
export function notify(msg : String, typeNotif : String){
    if(typeNotif == "error"){
      toast.error(msg, {
        position: toast.POSITION.TOP_CENTER,
        theme: "dark"
      })
    } else if(typeNotif == "warn"){
      toast.warn(msg, {
        position: toast.POSITION.TOP_CENTER,
        theme: "dark"
      })
    } else if(typeNotif == "info"){
      toast.info(msg, {
        position: toast.POSITION.TOP_CENTER,
        theme: "dark"
      })
    } else if(typeNotif == "success"){
      toast.success(msg, {
        position: toast.POSITION.TOP_CENTER,
        theme: "dark"
      })
    }
}