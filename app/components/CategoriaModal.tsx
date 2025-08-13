// app/components/CategoriaModal.tsx

import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Categoria } from '../models/Categoria';
import { styles } from '../styles';

type CategoriaModalProps = {
  visible: boolean;
  categorias: Categoria[];
  motivoSelecionado?: string;
  onClose: () => void;
  onSelect: (categoriaId: string | null) => void;
  onAddCategoria: (nova: Omit<Categoria, 'id'>) => void;
  onDeleteCategoria: (categoriaId: string) => void;
};

export const CategoriaModal = ({
  visible,
  categorias,
  motivoSelecionado,
  onClose,
  onSelect,
  onAddCategoria,
  onDeleteCategoria,
}: CategoriaModalProps) => {
  const [descricao, setDescricao] = useState('');
  const [cor, setCor] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    if (!visible) {
      setModoEdicao(false);
    }
  }, [visible]);

  const adicionar = () => {
    if (!descricao.trim() || !cor.trim()) return;

    onAddCategoria({
      descricao: descricao.trim(),
      cor: cor.trim().toLowerCase(),
    });

    setDescricao('');
    setCor('');
  };

  const handleChange = (text: string) => {
    const limpo = text.trim().toLowerCase();
    setCor(limpo);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>

                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
                  {motivoSelecionado}
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

                    {modoEdicao && (
                      <Pressable onPress={() => onDeleteCategoria(cat.id)}>
                        <Text style={{ color: 'red', fontSize: 16 }}>❌</Text>
                      </Pressable>
                    )}
                  </View>
                ))}

                <Pressable onPress={() => onSelect(null)}>
                  <Text style={{ color: 'gray', fontSize: 16, marginTop: 12 }}>
                    Remover categoria
                  </Text>
                </Pressable>

                {!modoEdicao && (
                  <Pressable onPress={() => setModoEdicao(true)}>
                    <Text style={{ color: '#007AFF', fontSize: 16, marginTop: 12 }}>
                      Editar
                    </Text>
                  </Pressable>
                )}

                {modoEdicao && (
                  <View style={{ marginTop: 24 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Nova categoria</Text>

                    {/* Label Descrição */}
                    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Descrição</Text>
                    <TextInput
                      placeholder="Descrição"
                      value={descricao}
                      onChangeText={setDescricao}
                      style={[styles.input, { marginBottom: 8, width: '100%' }]}
                    />

                    {/* Label Cor */}
                    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Cor(Ex: red, green...)</Text>
                    <TextInput
                      placeholder="Cor (ex: red, green)"
                      value={cor}
                      onChangeText={setCor}
                      style={[styles.input, { marginBottom: 8, width: '100%' }]}
                    />

                    <Pressable style={[styles.button, { width: '100%' }]} onPress={adicionar}>
                      <Text style={styles.buttonText}>Adicionar</Text>
                    </Pressable>
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
