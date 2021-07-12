import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 10px',
  },
  image: {
    marginLeft: '15px',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
  }
}));