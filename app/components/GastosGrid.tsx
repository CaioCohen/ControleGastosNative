import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Categoria } from '../models/Categoria';
import { Dado } from '../models/Dado';
import { styles } from '../styles';

type SortKey = 'motivo' | 'valor' | 'data' | null;
type SortDir = 'asc' | 'desc' | null;

type GastosGridProps = {
  dados: Dado[];
  categorias: Categoria[];
  sortKey: SortKey;
  sortDir: SortDir;
  onExcluir: (index: number) => void;
  onExcluirTodos: () => void;
  onAbrirModalCategoria: (index: number) => void;
  onHeaderPress: (key: Exclude<SortKey, null>) => void;
};

export const GastosGrid = ({
  dados,
  categorias,
  sortKey,
  sortDir,
  onExcluir,
  onExcluirTodos,
  onAbrirModalCategoria,
  onHeaderPress
}: GastosGridProps) => {

  const formatarData = (iso: string | undefined) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const arrowFor = (key: Exclude<SortKey, null>) => {
    if (sortKey !== key || !sortDir) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <FlatList
      style={styles.grid}
      data={dados}
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.header}>
          {/* Coluna do ❌ (não clicável) */}
          <View style={[styles.cell, { flex: 0.5, alignItems: 'center' }]}>
            {dados.length > 0 && (
              <Pressable onPress={onExcluirTodos}>
                <Text style={{ color: 'red', fontSize: 16 }}>❌</Text>
              </Pressable>
            )}
          </View>

          {/* Motivo (clicável) */}
          <Pressable style={styles.headerText} onPress={() => onHeaderPress('motivo')}>
            <Text style={styles.headerText}>Motivo{arrowFor('motivo')}</Text>
          </Pressable>

          {/* Valor (clicável) */}
          <Pressable style={styles.headerText} onPress={() => onHeaderPress('valor')}>
            <Text style={styles.headerText}>Valor{arrowFor('valor')}</Text>
          </Pressable>

          {/* Data (clicável) */}
          <Pressable style={styles.headerText} onPress={() => onHeaderPress('data')}>
            <Text style={styles.headerText}>Data{arrowFor('data')}</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item, index }) => {
        const categoria = categorias.find(cat => cat.id === item.categoriaId);

        return (
          <View style={styles.row}>
            <Pressable style={styles.deleteButton} onPress={() => onExcluir(index)}>
              <Text style={styles.deleteButtonText}>❌</Text>
            </Pressable>

            <Pressable
              style={[styles.cell, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
              onPress={() => onAbrirModalCategoria(index)}
            >
              {categoria && <View style={[styles.bolinha, { backgroundColor: categoria.cor }]} />}
              <Text>{item.motivo}</Text>
            </Pressable>

            <Text style={styles.cell}>R$ {item.valor}</Text>
            <Text style={styles.cell}>{formatarData(item.data)}</Text>
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
            <Text style={[styles.cell, { fontWeight: 'bold' }]}></Text>
          </View>
        ) : null
      }
    />
  );
};
