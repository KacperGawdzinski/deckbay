import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import GameMiniature from './components/GameMiniature/GameMiniature'
import RoomList from './components/RoomList/RoomList'
import './App.css'

function App() {
    return (
    <Router>
        <Navbar/>
        <Switch>
            <Route exact path='/'>
                <div className="game_list">
                    <GameMiniature game="chess"/>
                    <GameMiniature game="checkers"/>
                    <GameMiniature game="charades"/>
                </div>
            </Route>
            <Route exact path='/chess'>
                <RoomList game='chess'/>
            </Route>
        </Switch>
        <Footer/>
    </Router>
)}

export default App;