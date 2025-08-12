import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Categoria } from '../models/Categoria';
import { Dado } from '../models/Dado';
import { styles } from '../styles';

type GastosGridProps = {
  dados: Dado[];
  categorias: Categoria[];
  onExcluir: (index: number) => void;
  onExcluirTodos: () => void;
  onAbrirModalCategoria: (index: number) => void;
};

export const GastosGrid = ({
  dados,
  categorias,
  onExcluir,
  onExcluirTodos,
  onAbrirModalCategoria,
}: GastosGridProps) => {

  const formatarData = (iso: string | undefined) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  return (
    <FlatList
      style={styles.grid}
      data={dados}
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={[styles.cell, { flex: 0.5, alignItems: 'center' }]}>
            {dados.length > 0 && (
              <Pressable onPress={onExcluirTodos}>
                <Text style={{ color: 'red', fontSize: 16 }}>❌</Text>
              </Pressable>
            )}
          </View>
          <Text style={styles.headerText}>Motivo</Text>
          <Text style={styles.headerText}>Valor</Text>
          <Text style={styles.headerText}>Data</Text>
        </View>
      }
      renderItem={({ item, index }) => {
        const categoria = categorias.find(cat => cat.id === item.categoriaId);

        return (
          <View style={styles.row}>
            <Pressable
              style={styles.deleteButton}
              onPress={() => onExcluir(index)}
            >
              <Text style={styles.deleteButtonText}>❌</Text>
            </Pressable>

            <Pressable
              style={[
                styles.cell,
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
              ]}
              onPress={() => onAbrirModalCategoria(index)}
            >
              {categoria && (
                <View
                  style={[styles.bolinha, { backgroundColor: categoria.cor }]}
                />
              )}
              <Text>{item.motivo}</Text>
            </Pressable>

            <Text style={styles.cell}>R$ {item.valor}</Text>
            <Text style={styles.cell}>
              {formatarData(item.data)}
            </Text>
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
