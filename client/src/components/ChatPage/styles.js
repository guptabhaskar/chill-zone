import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  chatInput: {
    marginLeft: 10,
    width: '38%'
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '80px',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  message: {
    marginLeft: '40%'
  }
}));