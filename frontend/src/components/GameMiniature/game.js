import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import getImage from "../../getImage";
import CardMedia from "@material-ui/core/CardMedia";
import theme from "../../theme";

export default function SimpleCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.image}
        component="img"
        image={getImage("chess")}
      >
        {/* <img src={getImage("chess")} alt={"chess"} /> */}
      </CardMedia>
    </Card>
  );
}

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "400px",
    borderRadius: "10%",
  },
  image: {
    width: "70%",
    height: "70%",
    minWidth: "280px",
    maxHeight: "280px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "30px",
    transition: "transform 0.5s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});
