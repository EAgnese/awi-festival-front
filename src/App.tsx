import './App.css'
import NavBar from './components/NavBar'

import { Outlet, Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
function App() {
  return (
    <div>
      <nav><NavBar /></nav>
      <div>
        <Link to={`zone/`}>Zone</Link>
        <br></br>
        <Link to={`benevole/`}>Benevoles</Link>
      </div>
      <h1>App</h1>
      <Outlet />
      <h1>App fin</h1>
    </div>
  )
}

export default App
