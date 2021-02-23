import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import GameMiniature from './components/GameMiniature/GameMiniature';
import RoomList from './components/RoomList/RoomList';
import { Helmet } from 'react-helmet';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState, useEffect } from 'react';
import Charades from './components/Game/Charades/Charades';

function App() {
    return (
        <Router>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content="Free Web tutorials" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Deckbay</title>
            </Helmet>
            <Navbar />
            <Switch>
                <Route exact path="/">
                    <div className="game_list">
                        <GameMiniature game="chess" />
                        <GameMiniature game="checkers" />
                        <GameMiniature game="charades" />
                    </div>
                </Route>
                <Route exact path="/chess">
                    <RoomList game="chess" />
                </Route>
                <Route exact path="/chess/:id"></Route>
                <Route exact path="/charades">
                    <RoomList game="charades" />
                </Route>
                <Route exact path="/charades/:id">
                    <Charades />
                </Route>
            </Switch>
            <Footer />
        </Router>
    );
}

export default App;
