// app/components/CategoriaModal.tsx

import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Categoria } from '../models/Dado';
import { styles } from '../styles';

type CategoriaModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (categoria: Categoria | null) => void;
};

export const CategoriaModal = ({ visible, onClose, onSelect }: CategoriaModalProps) => {
  const opcoes = [
    { cor: 'red', label: 'Contas', valor: 'contas' },
    { cor: 'green', label: 'Supermercado', valor: 'mercado' },
    { cor: 'blue', label: 'Transporte', valor: 'transporte' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {opcoes.map(({ cor, label, valor }) => (
            <Pressable
              key={valor}
              style={styles.modalOption}
              onPress={() => onSelect(valor as Categoria)}
            >
              <View style={[styles.bolinha, { backgroundColor: cor }]} />
              <Text>{label}</Text>
            </Pressable>
          ))}

          <Pressable onPress={() => onSelect(null)}>
            <Text style={{ color: 'gray', fontSize: 16, marginTop: 16 }}>Remover categoria</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
