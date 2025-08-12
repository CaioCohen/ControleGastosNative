import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, ScrollView, Text } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Categoria } from './models/Categoria';
import { Dado } from './models/Dado';

const screenWidth = Dimensions.get('window').width;

export default function Planilha() {
  const navigation = useNavigation();
  const [dados, setDados] = useState<Dado[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Dashboard',
    });
  }, [navigation]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const dadosSalvos = await AsyncStorage.getItem('controle_gastos_dados');
    const categoriasSalvas = await AsyncStorage.getItem('categorias');

    if (dadosSalvos) setDados(JSON.parse(dadosSalvos));
    if (categoriasSalvas) setCategorias(JSON.parse(categoriasSalvas));
  };

  const agruparPorCategoria = () => {
  const agrupado: Record<string, number> = {};

  dados.forEach((item) => {
    const categoriaId = item.categoriaId || 'outros';
    const valor = parseFloat(item.valor || '0');
    agrupado[categoriaId] = (agrupado[categoriaId] || 0) + valor;
  });

  const total = Object.values(agrupado).reduce((sum, val) => sum + val, 0);

  const pizza = Object.entries(agrupado).map(([categoriaId, valor]) => {
    const categoria = categoriaId === 'outros'
      ? { descricao: 'Outros', cor: '#cccccc' }
      : categorias.find((c) => c.id === categoriaId);

    return {
      name: categoria?.descricao || 'Desconhecida',
      population: valor,
      color: categoria?.cor || '#ccc',
      legendFontColor: '#333',
      legendFontSize: 14,
    };
  });

  const barras = {
  labels: [...pizza.map((p) => p.name), ''], // rótulo extra vazio
  datasets: [
    {
      data: [...pizza.map((p) => p.population), 0], // força eixo Y iniciar em 0
    },
  ],
};

  return { pizza, barras };
};

  const { pizza, barras } = agruparPorCategoria();

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Gastos por Categoria
      </Text>

      {pizza.length > 0 ? (
        <>
          <PieChart
            data={pizza}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              color: () => '#000',
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute={false}
          />

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 32, marginBottom: 12 }}>
            Valores por Categoria
          </Text>

          <BarChart
            data={barras}
            width={screenWidth - 32}
            height={280}
            yAxisLabel="R$ "
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.6,
            }}
            verticalLabelRotation={20}
            style={{ borderRadius: 12, marginBottom: 32 }}
          />
        </>
      ) : (
        <Text style={{ color: '#666' }}>Nenhum dado disponível</Text>
      )}
    </ScrollView>
  );
}
