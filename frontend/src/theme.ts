import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#35383d',
      dark: '#0f1217',
      contrastText: '#ffffff',
    },
    contrastThreshold: 3,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1700,
    },
  },
});

export default theme;
