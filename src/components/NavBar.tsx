import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from "react-router-dom";
import '../assets/navBar.css';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import { isConnected, deconnexion, getIdUtilisateur } from '../middleware/token';


export default function MenuAppBar() {
  const navigation = useNavigate(); // redirection
  const [auth, setAuth] = React.useState(isConnected());
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  };

  const handleDeconnexion = () => {
    deconnexion()
    setAnchorElUser(null)
    setAuth(false)
    navigation("../benevole/")
    window.location.reload()
    
  };


  return (
    <AppBar position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                    >
                    LOGO
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                        >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                        >
                        <Box sx={{textAlign:"center",display : 'flex', flexDirection:'column'}}>
                            <Button
                                key="zone"
                                onClick={handleCloseNavMenu}
                                >
                                <Link to={`zone/`} className='link'>Zones</Link>
                            </Button>
                            <Button
                                key="benevole"
                                onClick={handleCloseNavMenu}
                                >
                                <Link to={`benevole/`} className='link'>Benevoles</Link>
                            </Button>
                            <Button
                                key="jeu"
                                onClick={handleCloseNavMenu}
                                >
                                <Link to={`jeu/`} className='link'>Jeux</Link>
                            </Button>
                            <Button
                                key="typeJeu"
                                onClick={handleCloseNavMenu}
                                >
                                <Link to={`type_jeu/`} className='link'>Types Jeu</Link>
                            </Button>
                            <Button
                                key="creneau"
                                onClick={handleCloseNavMenu}
                                >
                                <Link to={`creneau/`} className='link'>Créneaux</Link>
                            </Button>
                            {auth && (
                                <Button
                                    key="admin"
                                    onClick={handleCloseNavMenu}
                                    >
                                    <Link to={`/`} className='link'> Admin</Link>
                                </Button>
                            )}
                        </Box>
                    </Menu>
                </Box>
                <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href=""
                    sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                    >
                    LOGO
                </Typography>
                <Box sx={{flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Button
                        key="zone"
                        onClick={handleCloseNavMenu}

                        >
                        <Link to='zone/' className='link'> Zones</Link>
                    </Button>
                    <Button
                        key="benevole"
                        onClick={handleCloseNavMenu}
                        >
                        <Link to={`benevole/`} className='link'>Benevoles</Link>
                    </Button>
                    <Button
                        key="typeJeu"
                        onClick={handleCloseNavMenu}
                        >
                        <Link to={`type_jeu/`} className='link'>Types Jeu</Link>
                    </Button>
                    <Button
                        key="jeu"
                        onClick={handleCloseNavMenu}
                        >
                        <Link to={`jeu/`} className='link'>Jeux</Link>
                    </Button>
                    <Button
                        key="creneau"
                        onClick={handleCloseNavMenu}
                        >
                        <Link to={`creneau/`} className='link'>Créneaux</Link>
                    </Button>
                    {auth && (
                        <Button
                            key="admin"
                            onClick={handleCloseNavMenu}
                            >
                            <Link to={`/`} className='link'> Admin</Link>
                        </Button>
                    )}
                </Box>
                {!auth && (
                    <Link to='connexion/' className='link'>
                        <IconButton aria-label="account of current user">
                            <AccountCircle />
                        </IconButton>
                    </Link>
                )}
                <Box sx={{ flexGrow: 0 }}>
                    {auth && (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenUserMenu}
                                color="inherit"
                            >
                            <AccountCircle />
                            </IconButton>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                >
                               <Button
                                    key="profil"
                                    onClick={handleCloseUserMenu}
                                    >
                                    <Link to={`benevole/profil/`+getIdUtilisateur()} className='link'> Profil</Link>
                                </Button>
                                <Button
                                    key="deconnexion"
                                    onClick={handleDeconnexion}
                                    >
                                    Déconnexion
                                </Button>
                            </Menu>
                        </div>
                    )}
                </Box>
            </Toolbar>
        </Container>
    </AppBar>
    );
}
