import { makeStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
export default makeStyles((theme) => ({
  green: {
    color: '#fff',
    backgroundColor: green[500],
  },
  red: {
    color: '#fff',
    backgroundColor: red[500],
  },
  grey: {
    backgroundColor: '#3C4043'
  },
  footbar: {
    marginTop: '0.5%',
    marginBottom: '0.5%'
  },
  icons: {
    width: '45px',
    height: '45px'
  }
}));