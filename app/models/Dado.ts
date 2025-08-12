// app/models/Dado.ts

export type Categoria = 'contas' | 'mercado' | 'transporte';

export type Dado = {
  motivo: string;
  valor: string;
  categoria?: Categoria;
};
