import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "./theme";
import GameCard from "./components/GameCard/GameCard";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid } from "@material-ui/core";
import { GAME_LIST } from "./config";

export default function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="description" content="Free online board games" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Deckbay</title>
        </Helmet>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Container className={classes.cardGrid} maxWidth="lg">
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                spacing={3}
              >
                {GAME_LIST.map((game) => (
                  <Grid item key={game} xs={10} md={4} sm={5}>
                    <GameCard
                      className={classes.card}
                      game={game.toUpperCase()}
                    />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Route>
          {/* <Route exact path="/chess">
            <RoomList game="chess" />
          </Route>
          <Route exact path="/chess/:id"></Route>
          <Route exact path="/charades">
            <RoomList game="charades" />
          </Route>
          <Route exact path="/charades/:id">
            <Charades />
          </Route> */}
        </Switch>
        {/* <Footer /> */}
      </Router>
    </ThemeProvider>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },

  heroButtons: {
    marginTop: theme.spacing(4),
  },

  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    [theme.breakpoints.down("xs")]: {
      paddingTop: theme.spacing(2),
    },
  },

  card: {
    height: "100%",
    width: "25px",
    display: "flex",
    flexDirection: "column",
  },

  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },

  cardContent: {
    flexGrow: 1,
  },

  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));
