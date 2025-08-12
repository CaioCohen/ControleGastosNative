import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function Index() {
  const [motivo, setMotivo] = useState('');
  const [valor, setValor] = useState('');
  const [dados, setDados] = useState<{ motivo: string; valor: string }[]>([]);

  const adicionarItem = () => {
    if (!motivo.trim() || !valor.trim()) return;

    setDados((prev) => [...prev, { motivo, valor }]);
    setMotivo('');
    setValor('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <FlatList
            style={styles.grid}
            data={dados}
            keyExtractor={(_, index) => index.toString()}
            ListHeaderComponent={
              <View style={styles.header}>
                {/* espaço vazio no cabeçalho da coluna de exclusão */}
                <View style={[styles.cell, { flex: 0.5 }]} />
                <Text style={styles.headerText}>Motivo</Text>
                <Text style={styles.headerText}>Valor</Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <View style={styles.row}>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() =>
                    setDados((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  <Text style={styles.deleteButtonText}>X</Text>
                </Pressable>
                <Text style={styles.cell}>{item.motivo}</Text>
                <Text style={styles.cell}>R$ {item.valor}</Text>
              </View>
            )}
          />

          <ScrollView contentContainerStyle={styles.inputGroup} keyboardShouldPersistTaps="handled">
            <TextInput
              placeholder="Motivo"
              style={styles.input}
              value={motivo}
              onChangeText={setMotivo}
            />
            <TextInput
              placeholder="Valor"
              style={styles.input}
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
            />
            <Pressable style={styles.button} onPress={adicionarItem}>
              <Text style={styles.buttonText}>Adicionar</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
});
