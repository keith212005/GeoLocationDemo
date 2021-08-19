import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    marginVertical: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  repoLink: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0000CC',
    textDecorationLine: 'underline',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  detailBox: {
    padding: 15,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  valueTitle: {
    fontFamily: 'Futura',
    fontSize: 12,
  },
  detail: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  largeDetail: {
    fontSize: 20,
  },
  json: {
    fontSize: 12,
    fontFamily: 'Courier',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  full: {
    width: '100%',
  },
  half: {
    width: '50%',
  },
  third: {
    width: '33%',
  },
});
