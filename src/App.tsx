import './App.css'
import NavBar from './components/NavBar'
import {ToastContainer} from 'react-toastify';

import { Outlet} from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
export default function App() {
  return (
    <div>
      <ToastContainer limit={3}/>
      <nav><NavBar /></nav>
      <div>
        <Outlet />
      </div>
    </div>
  )
}