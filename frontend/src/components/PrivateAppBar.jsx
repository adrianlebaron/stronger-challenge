import { useState } from 'react';
import { ThemeProvider } from '@emotion/react';
// Local components
import theme from '../theme/theme'
import { authStore } from "../stores/auth_store/Store";
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
import Person3Icon from '@mui/icons-material/Person3';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import TableChartIcon from '@mui/icons-material/TableChart';

function PrivateAppBar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const { setToken, setUser } = authStore(store => store)
    const { user } = authStore((state) => state.user);

    const handleSignOut = () => {
        setToken(""),
            setUser("")
    };
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const adminLinks = () => {
        if (user) {
            if (user?.profile?.roles === "ADMIN") {
                return (
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            variant="link"
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white' }}
                            href='/admin'
                            endIcon={<TableChartIcon />}
                        >
                            admin
                        </Button>
                    </Box>
                );
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="customColor">
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
                                    <Button href="/feed" variant='link'>
                                        Feed
                                    </Button>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Button href="/score" variant='link'>
                                        Score
                                    </Button>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Button href='/admin' variant='link'>
                                        Admin
                                    </Button>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Button href='/profile' variant='link'>
                                        Profile
                                    </Button>
                                </MenuItem>
                            </Menu>
                        </Box>
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
                                href='/score'
                                endIcon={<ScoreboardIcon />}
                            >
                                score
                            </Button>
                        </Box>
                        {adminLinks()}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                variant="link"
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white' }}
                                href='/profile'
                                endIcon={<Person3Icon />}
                            >
                                profile
                            </Button>
                        </Box>
                        <Button
                            onClick={handleSignOut}
                            variant='outlined'
                            sx={{ my: 2, color: 'white' }}
                            style={{ borderColor: 'white' }}
                        >
                            logout
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
}
export default PrivateAppBar;