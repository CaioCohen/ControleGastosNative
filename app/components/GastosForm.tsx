import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { styles } from '../styles';

type GastosFormProps = {
    motivo: string;
    valor: string;
    mostraAcoes: boolean;
    setMotivo: (texto: string) => void;
    setValor: (texto: string) => void;
    onAdicionar: () => void;
    onSalvar: () => void; 
    onRefazer: () => void;
};

export const GastosForm = ({
    motivo,
    valor,
    mostraAcoes,
    setMotivo,
    setValor,
    onAdicionar,
    onSalvar,
    onRefazer,
}: GastosFormProps) => {
    return (
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
            <Pressable style={styles.button} onPress={onAdicionar}>
                <Text style={styles.buttonText}>Adicionar</Text>
            </Pressable>
            
            {mostraAcoes && (
                <View style={styles.acoesContainer}>
                    <Pressable style={[styles.button, styles.salvar]} onPress={onSalvar}>
                        <Text style={styles.buttonText}>Salvar</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.refazer]} onPress={onRefazer}>
                        <Text style={styles.buttonText}>Refazer</Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>
    );
};
