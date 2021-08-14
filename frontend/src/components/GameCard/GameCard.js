import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import getImage from "../../getImage";
import CardMedia from "@material-ui/core/CardMedia";
import theme from "../../theme";
import { Link } from "react-router-dom";

export default function GameCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Link to={`/${props.game.toLowerCase()}`} className={classes.link}>
        <CardMedia
          className={classes.image}
          component="img"
          image={getImage(props.game.toLowerCase())}
        ></CardMedia>
        <CardContent className={classes.gameText}>{props.game}</CardContent>
      </Link>
    </Card>
  );
}

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "400px",
    borderRadius: "10%",
    borderStyle: "solid",
    [theme.breakpoints.only("sm")]: {
      height: "300px",
    },
    [theme.breakpoints.only("xs")]: {
      height: "240px",
    },
  },
  gameText: {
    textAlign: "center",
    fontSize: "40px",
    fontWeight: "bold",
    fontStyle: "italic",
    lineHeight: "1.5",
    color: "black !important",
    [theme.breakpoints.only("sm")]: {
      fontSize: "30px",
    },
    [theme.breakpoints.only("xs")]: {
      fontSize: "25px",
    },
  },
  image: {
    maxWidth: "280px",
    maxHeight: "280px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "30px",
    transition: "transform 0.5s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
    [theme.breakpoints.only("xs")]: {
      maxHeight: "150px",
      maxWidth: "150px",
    },
    [theme.breakpoints.only("sm")]: {
      maxHeight: "200px",
      maxWidth: "200px",
    },
  },
  link: {
    textDecoration: "none !important",
  },
});
