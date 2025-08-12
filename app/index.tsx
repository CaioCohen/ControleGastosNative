import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { CategoriaModal } from './components/CategoriaModal';
import { Categoria } from './models/Categoria';
import { Dado } from './models/Dado';
import { styles } from './styles';


import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'controle_gastos_dados';

export default function Index() {
  const [motivo, setMotivo] = useState('');
  const [valor, setValor] = useState('');
  const [dados, setDados] = useState<Dado[]>([]);
  const [dadosSalvos, setDadosSalvos] = useState<string | null>(null);
  const [mostraAcoes, setMostraAcoes] = useState(false);
  const [itemSelecionadoIndex, setItemSelecionadoIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    carregarDadosSalvos();
    carregarCategoriasSalvas(); // novo
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

  const carregarCategoriasSalvas = async () => {
    const json = await AsyncStorage.getItem('categorias');
    if (json) {
      const lista = JSON.parse(json);
      setCategorias(lista);
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

  const abrirModalCategoria = (index: number) => {
    setItemSelecionadoIndex(index);
    setModalVisible(true);
  };

  const onDeleteCategoria = async (categoriaId: string) => {
    const novasCategorias = categorias.filter(cat => cat.id !== categoriaId);
    setCategorias(novasCategorias);
    await AsyncStorage.setItem('categorias', JSON.stringify(novasCategorias));

    const atualizados = dados.map(item =>
      item.categoriaId === categoriaId ? { ...item, categoriaId: undefined } : item
    );
    setDados(atualizados);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
  };

  const aplicarCategoria = (categoriaId: string | null) => {
    if (itemSelecionadoIndex !== null) {
      const novos = [...dados];
      if (categoriaId) {
        novos[itemSelecionadoIndex].categoriaId = categoriaId;
      } else {
        delete novos[itemSelecionadoIndex].categoriaId;
      }
      setDados(novos);
      salvarNoDispositivo(novos);
      setModalVisible(false);
      setItemSelecionadoIndex(null);
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
            renderItem={({ item, index }) => {
              const categoria = categorias.find(cat => cat.id === item.categoriaId);

              return (
                <View style={styles.row}>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => excluirItem(index)}
                  >
                    <Text style={styles.deleteButtonText}>X</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.cell, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
                    onPress={() => abrirModalCategoria(index)}
                  >
                    {categoria && (
                      <View
                        style={[
                          styles.bolinha,
                          { backgroundColor: categoria.cor },
                        ]}
                      />
                    )}
                    <Text>{item.motivo}</Text>
                  </Pressable>

                  <Text style={styles.cell}>R$ {item.valor}</Text>
                </View>
              );
            }}

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

      <CategoriaModal
        visible={modalVisible}
        categorias={categorias}
        onClose={() => setModalVisible(false)}
        onSelect={aplicarCategoria}
        onAddCategoria={novaCategoria => {
          const nova = { ...novaCategoria, id: Date.now().toString() };
          const atualizadas = [...categorias, nova];
          setCategorias(atualizadas);
          AsyncStorage.setItem('categorias', JSON.stringify(atualizadas));
        }}
        onDeleteCategoria={onDeleteCategoria}
      />
    </SafeAreaView>
  );
}
