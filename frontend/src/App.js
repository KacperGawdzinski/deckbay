import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import GameMiniature from "./components/GameMiniature/GameMiniature";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "./theme";
import SimpleCard from "./components/GameMiniature/game";
import { Container, Grid } from "@material-ui/core";

function App() {
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
            <Container>
              <Grid>
                <SimpleCard />
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

export default App;
