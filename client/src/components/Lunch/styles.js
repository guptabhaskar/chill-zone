import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    minWidth: 275,
    minHeight: 275,
    fontWeight: "bold",
  },
  heading: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    align: "center",
    marginBottom: 50
  },
  card: {
    display: 'flex',
    justifyContent: 'center'
  },
  pos: {
    marginTop: 90,
    marginBottom: 12,
    fontWeight: 400,
    fontSize: 30
  },
  chatInput: {
    marginLeft: 10,
    width: '40%'
  }
}));