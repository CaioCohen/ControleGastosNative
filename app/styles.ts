import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({

safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  grid: {
    flex: 1,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    padding: 8,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center', // Alinha verticalmente todos os itens
    height: 40,            // Altura fixa para evitar diferenças
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  inputGroup: {
    paddingVertical: 16,
    paddingBottom: 40, // deixa espaço extra para o botão não colar na borda
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    width: '100%',
    alignItems: 'stretch',
    minWidth: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: '100%'
  },
  deleteButton: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButtonText: {
    color: 'red',
    fontSize: 18,
  },
  acoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  salvar: { backgroundColor: 'green', flex: 1, marginRight: 8 },
  refazer: { backgroundColor: 'orange', flex: 1, marginLeft: 8 },
  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: 250,
    alignItems: 'flex-start',
    maxHeight: '80%',
  },
 modalOption: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  paddingHorizontal: 12,
  borderRadius: 8,
  marginBottom: 8,
  backgroundColor: '#f5f5f5',
},
});