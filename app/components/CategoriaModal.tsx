// app/components/CategoriaModal.tsx

import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Categoria } from '../models/Categoria';
import { styles } from '../styles';

type CategoriaModalProps = {
  visible: boolean;
  categorias: Categoria[];
  onClose: () => void;
  onSelect: (categoriaId: string | null) => void;
  onAddCategoria: (nova: Omit<Categoria, 'id'>) => void;
  onDeleteCategoria: (categoriaId: string) => void;
};

export const CategoriaModal = ({
  visible,
  categorias,
  onClose,
  onSelect,
  onAddCategoria,
  onDeleteCategoria,
}: CategoriaModalProps) => {
  const [descricao, setDescricao] = useState('');
  const [cor, setCor] = useState('');

  const adicionar = () => {
    if (!descricao.trim() || !cor.trim()) return;
    onAddCategoria({ descricao, cor });
    setDescricao('');
    setCor('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
            Categorias
          </Text>

          {categorias.map(cat => (
            <View
              key={cat.id}
              style={[
                styles.modalOption,
                { justifyContent: 'space-between' },
              ]}
            >
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                onPress={() => onSelect(cat.id)}
              >
                <View
                  style={[
                    styles.bolinha,
                    { backgroundColor: cat.cor, marginRight: 8 },
                  ]}
                />
                <Text>{cat.descricao}</Text>
              </Pressable>

              <Pressable onPress={() => onDeleteCategoria(cat.id)}>
                <Text style={{ color: 'red', fontSize: 16 }}>❌</Text>
              </Pressable>
            </View>
          ))}

          <Pressable onPress={() => onSelect(null)}>
            <Text style={{ color: 'gray', fontSize: 16, marginTop: 12 }}>
              Remover categoria
            </Text>
          </Pressable>

          <View style={{ marginTop: 24 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Nova categoria</Text>
            <TextInput
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              style={[styles.input, { marginBottom: 8 }]}
            />
            <TextInput
              placeholder="Cor (ex: red, green, #3366ff)"
              value={cor}
              onChangeText={setCor}
              style={[styles.input, { marginBottom: 8 }]}
            />
            <Pressable style={styles.button} onPress={adicionar}>
              <Text style={styles.buttonText}>Adicionar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
