import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import GameMiniature from "./components/GameMiniature/GameMiniature";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "./theme";
import SimpleCard from "./components/GameMiniature/game";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid } from "@material-ui/core";

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
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} sm={6}>
                  <SimpleCard className={classes.card} />
                </Grid>
                <Grid item xs={12} md={4} sm={6}>
                  <SimpleCard className={classes.card} />
                </Grid>
                <Grid item xs={12} md={4} sm={6}>
                  <SimpleCard className={classes.card} />
                </Grid>
                {/* <div className="game_list">
              <GameMiniature game="chess" />
              <GameMiniature game="checkers" />
              <GameMiniature game="charades" />
            </div> */}
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
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "row",
    width: "50px",
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
