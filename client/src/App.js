import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GameMiniature from './components/GameMiniature'
import './App.css'

function App() {
    return (
    <Router>
        <Navbar />
        <Switch>
            <Route exact path='/'>
                <div className="game_list">
                    <GameMiniature game="chess"/>
                    <GameMiniature game="checkers"/>
                    <GameMiniature game="charades"/>
                </div>
            </Route>
        </Switch>
        <Footer />
    </Router>
    );
}

export default App;