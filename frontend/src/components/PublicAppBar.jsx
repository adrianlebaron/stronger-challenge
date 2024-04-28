import {useState} from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from '../theme/theme'
import koslogo from '../assets/koslogo.svg'
// MUI components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
// MUI icons
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import FitnessCenter from '@mui/icons-material/FitnessCenter';

function PublicAppBar() {
    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <AppBar position='static' color="customColor">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* MOBILE NAVBAR */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="huge"
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
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Button href="/" variant='link'>
                                        Home
                                    </Button>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Button href="/shop" variant='link'>
                                        Shop
                                    </Button>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Button href="/signup" variant='link'>
                                        sign up
                                    </Button>
                                </MenuItem>
                            </Menu>
                        </Box>
                        <FitnessCenter sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
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
                            <img src={koslogo} width={100}></img>
                        </Typography>

                        {/* DESKTOP NAVBAR */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                variant="link"
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', }}
                                href='/'
                                endIcon={<HomeIcon />}
                            >
                                HOME
                            </Button>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                variant="link"
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white' }}
                                href="/shop"
                                endIcon={<ShoppingBagIcon />}
                            >
                                shop
                            </Button>
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                variant="link"
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white' }}
                                href="/signup"
                                endIcon={<AppRegistrationIcon />}
                            >
                                sign up
                            </Button>
                        </Box>
                        <Button
                            href='/login'
                            variant='outlined'
                            sx={{ my: 2, color: 'white' }}
                            style={{borderColor: 'white'}}
                        >
                            login
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
}
export default PublicAppBar;