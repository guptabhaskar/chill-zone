import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  room: {
    flexGrow: '1',
    height: '80vh',
    backgroundColor: '#978ECA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    flexWrap: 'wrap',
    '& video': {
      height: '315px',
      width: '550px',
      objectFit: 'cover',
      padding: '4px',
    }
  },
  loader: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    height: "100vh",
    width: "100vw"
  }
}));