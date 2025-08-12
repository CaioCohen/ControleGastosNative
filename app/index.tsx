import React, { useEffect, useState } from 'react';
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

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'controle_gastos_dados';

export default function Index() {
  const [motivo, setMotivo] = useState('');
  const [valor, setValor] = useState('');
  const [dados, setDados] = useState<{ motivo: string; valor: string }[]>([]);
  const [dadosSalvos, setDadosSalvos] = useState<string | null>(null);
  const [mostraAcoes, setMostraAcoes] = useState(false);

  useEffect(() => {
    carregarDadosSalvos();
  }, []);

  const carregarDadosSalvos = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json !== null) {
        const salvos = JSON.parse(json);
        setDados(salvos);
        setDadosSalvos(json);
      }
    } catch (e) {
      console.error('Erro ao carregar dados salvos:', e);
    }
  };

  const salvarNoDispositivo = async (dadosParaSalvar: any) => {
    try {
      const json = JSON.stringify(dadosParaSalvar);
      await AsyncStorage.setItem(STORAGE_KEY, json);
      setDadosSalvos(json);
      setMostraAcoes(false);
    } catch (e) {
      console.error('Erro ao salvar:', e);
    }
  };

  const adicionarItem = () => {
    if (!motivo.trim() || !valor.trim()) return;

    const novos = [...dados, { motivo, valor }];
    setDados(novos);
    salvarNoDispositivo(novos); // salva direto após adicionar
    setMotivo('');
    setValor('');
  };

  const excluirItem = (index: number) => {
    const novos = dados.filter((_, i) => i !== index);
    setDados(novos);
    setMostraAcoes(true); // mostra os botões de salvar/refazer
  };

  const refazerAlteracoes = () => {
    if (dadosSalvos !== null) {
      const antigos = JSON.parse(dadosSalvos);
      setDados(antigos);
      setMostraAcoes(false);
    }
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
                  onPress={() => excluirItem(index)}
                >
                  <Text style={styles.deleteButtonText}>X</Text>
                </Pressable>
                <Text style={styles.cell}>{item.motivo}</Text>
                <Text style={styles.cell}>R$ {item.valor}</Text>
              </View>
            )}
            ListFooterComponent={
              dados.length >= 2 ? (
                <View style={[styles.row, { backgroundColor: '#f0f0f0' }]}>
                  <View style={[styles.cell, { flex: 0.5 }]} />
                  <Text style={[styles.cell, { fontWeight: 'bold' }]}>Soma</Text>
                  <Text style={[styles.cell, { fontWeight: 'bold' }]}>
                    R$ {dados.reduce((total, item) => total + parseFloat(item.valor || '0'), 0).toFixed(2)}
                  </Text>
                </View>
              ) : null
            }
          />

          {mostraAcoes && (
            <View style={styles.acoesContainer}>
              <Pressable style={[styles.button, styles.salvar]} onPress={() => salvarNoDispositivo(dados)}>
                <Text style={styles.buttonText}>Salvar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.refazer]} onPress={refazerAlteracoes}>
                <Text style={styles.buttonText}>Refazer</Text>
              </Pressable>
            </View>
          )}

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
  acoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  salvar: { backgroundColor: 'green', flex: 1, marginRight: 8 },
  refazer: { backgroundColor: 'orange', flex: 1, marginLeft: 8 },
});
