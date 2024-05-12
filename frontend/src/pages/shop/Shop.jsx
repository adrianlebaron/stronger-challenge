import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Container, Box } from '@mui/material';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import SmallProtein from '../../assets/images/vanilla15servings.jpeg'
import BigProtein from '../../assets/images/vanilla15servings.jpeg'
import Kaoslogo from '../../assets/images/kaoslogo.jpeg'
import '../../../src/index.css'
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function Shop() {
  return (
    <>
      <Container>
        <Box
          my={4}
          display="flex"
          flexDirection='column'
          alignItems="center"
          textAlign='center'
          gap={4}
          p={2}
        >
          <Avatar alt="kaos logo" src={Kaoslogo} sx={{ width: 80, height: 80 }} />
          <h1>Visit KAOS Fitness shop at <Link href='https://kaosfitness.com/'>kaosfitness.com</Link></h1>
          <h2>Plant-based protein</h2>
          <p>KAOS Protein is clean, completely Vegan, Soy-free and filled with Omega 3 Fatty Acids. Designed to energize and fuel your workouts.</p>
        </Box>
        <Box
          my={4}
          display="flex"
          textAlign='center'
          justifyContent='center'
          gap={4}
          p={2}
          className="protein-cards-box"
        >
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="300"
                image={SmallProtein}
                alt="15 serving protein"
              />
              <CardContent href='https://kaosfitness.com/products/vanilla-15-servings'>
                <Typography gutterBottom variant="h5" component="div">
                  Vanilla 15 servings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  One-time purchase | subscription
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" href='https://kaosfitness.com/products/vanilla-15-servings'>
                Visit product page
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="300"
                image={BigProtein}
                alt="30 serving protein"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Vanilla 30 servings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  [Sold out] <br />
                  One-time purchase | subscription
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" href='https://kaosfitness.com/products/vanilla-30-servings'>
                Visit product page
              </Button>
            </CardActions>
          </Card>
        </Box>
        {/* FOOTER */}
      </Container>
      <Paper sx={{ position: 'static', left: 0, p: 2, bgcolor: '#bd2029', color: 'white', textAlign: 'center' }}>
        <Typography><strong>OUR MISSION: </strong>Promote a healthy way of living by providing products with real ingredients to supplement all types of lifestyles.</Typography>
        <Stack direction="row" spacing={2} paddingTop={1} justifyContent='center'>
          <Link href="https://www.instagram.com/kaosfitness__/?hl=en" target='_blank' variant='link' color='inherit' >
            <InstagramIcon />
          </Link>
          <Link href="https://www.facebook.com/people/KAOSfitness/100087039288294/?mibextid=LQQJ4d" target='_blank' variant='link' color='inherit'>
            <FacebookIcon />
          </Link>
        </Stack>
      </Paper>
    </>
  );
}