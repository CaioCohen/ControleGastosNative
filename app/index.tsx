import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Categoria } from './models/Categoria';
import { Dado } from './models/Dado';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, TouchableWithoutFeedback, View } from 'react-native';
import { CategoriaModal } from './components/CategoriaModal';
import { GastosForm } from './components/GastosForm';
import { GastosGrid } from './components/GastosGrid';
import { styles } from './styles';

const STORAGE_KEY = 'controle_gastos_dados';

type SortKey = 'motivo' | 'valor' | 'data' | null;
type SortDir = 'asc' | 'desc' | null;

export default function Index() {
  const [motivo, setMotivo] = useState('');
  const [valor, setValor] = useState('');
  const [dados, setDados] = useState<Dado[]>([]);
  const [dadosSalvos, setDadosSalvos] = useState<string | null>(null);
  const [mostraAcoes, setMostraAcoes] = useState(false);
  const [itemSelecionadoIndex, setItemSelecionadoIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const router = useRouter();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Controle de Gastos',
      headerRight: () => (
        <Pressable onPress={() => router.push('/planilha')} style={{ marginRight: 16 }}>
          <Ionicons name="document-text-outline" size={24} color="black" />
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    carregarDadosSalvos();
    carregarCategoriasSalvas();
  }, []);

  const carregarDadosSalvos = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json !== null) {
        const salvos = JSON.parse(json);
        setDados(ordenarPorData(salvos));
        setDadosSalvos(json);
      }
    } catch (e) {
      console.error('Erro ao carregar dados salvos:', e);
    }
  };

  const applySort = (list: Dado[]) => {
    if (!sortKey || !sortDir) return list;

    const sorted = [...list].sort((a, b) => {
      let av: number | string = '';
      let bv: number | string = '';

      switch (sortKey) {
        case 'valor':
          av = parseFloat(a.valor || '0');
          bv = parseFloat(b.valor || '0');
          break;
        case 'data':
          av = new Date(a.data || 0).getTime();
          bv = new Date(b.data || 0).getTime();
          break;
        case 'motivo':
        default:
          av = (a.motivo || '').toLowerCase();
          bv = (b.motivo || '').toLowerCase();
          break;
      }

      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const onHeaderPress = (key: Exclude<SortKey, null>) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else if (sortDir === 'desc') {
      setSortKey(null);
      setSortDir(null);
    } else {
      setSortDir('asc');
    }
  };

  const dadosExibidos = applySort(dados);

  const getCategoriasIniciais = (): Categoria[] => {
    return [
      { id: '1', descricao: 'Contas', cor: 'red' },
      { id: '2', descricao: 'Alimentação', cor: 'green' },
      { id: '3', descricao: 'Transporte', cor: 'blue' },
      { id: '4', descricao: 'Saúde', cor: 'orange' },
      { id: '5', descricao: 'Lazer', cor: 'purple' }
    ];
  };

  const carregarCategoriasSalvas = async () => {
    const json = await AsyncStorage.getItem('categorias');

    if (json) {
      const lista = JSON.parse(json);
      if (lista.length === 0) {
        await AsyncStorage.setItem('categorias', JSON.stringify(getCategoriasIniciais()));
        setCategorias(getCategoriasIniciais());
        return;
      }
      setCategorias(lista);
    } else {
      await AsyncStorage.setItem('categorias', JSON.stringify(getCategoriasIniciais()));
      setCategorias(getCategoriasIniciais());
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

    const novaData = new Date().toISOString();
    const novos = ordenarPorData([...dados, { motivo, valor, data: novaData }]);
    setDados(novos);
    salvarNoDispositivo(novos);
    setMotivo('');
    setValor('');
  };

  const excluirItem = (index: number) => {
    const novos = dados.filter((_, i) => i !== index);
    setDados(novos);
    setMostraAcoes(true);
  };

  const excluirTodos = () => {
    setDados([]);
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

  const ordenarPorData = (lista: Dado[]) => {
    return [...lista].sort((a, b) => {
      const dataA = new Date(a.data ?? 0).getTime();
      const dataB = new Date(b.data ?? 0).getTime();
      return dataB - dataA;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <View style={{ flex: mostraAcoes ? 5 : 6 }}>
            <GastosGrid
              dados={dadosExibidos}
              categorias={categorias}
              onExcluirTodos={excluirTodos}
              onExcluir={excluirItem}
              onAbrirModalCategoria={abrirModalCategoria}
              onHeaderPress={onHeaderPress}
              sortKey={sortKey}
              sortDir={sortDir}
            />
          </View>

          <View style={{ flex: mostraAcoes ? 5 : 4 }}>
            <GastosForm
              motivo={motivo}
              valor={valor}
              setMotivo={setMotivo}
              setValor={setValor}
              onAdicionar={adicionarItem}
              mostraAcoes={mostraAcoes}
              onSalvar={() => salvarNoDispositivo(dados)}
              onRefazer={refazerAlteracoes}
            />
          </View>

          <CategoriaModal
            visible={modalVisible}
            categorias={categorias}
            onClose={() => setModalVisible(false)}
            onSelect={aplicarCategoria}
            onAddCategoria={(novaCategoria) => {
              const nova = { ...novaCategoria, id: Date.now().toString() };
              const atualizadas = [...categorias, nova];
              setCategorias(atualizadas);
              AsyncStorage.setItem('categorias', JSON.stringify(atualizadas));
            }}
            onDeleteCategoria={onDeleteCategoria}
            motivoSelecionado={itemSelecionadoIndex !== null ? dados[itemSelecionadoIndex]?.motivo : ''}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
