import { Link } from "react-router-dom";
import getImage from "../../getImage";
import "./GameMiniature.css";

const GameMiniature = ({ game }) => {
  return (
    <div className="game">
      <Link to={`/${game}`}>
        <img src={getImage(game)} alt={game} />
        <p>{game.toUpperCase()}</p>
      </Link>
    </div>
  );
};

export default GameMiniature;
