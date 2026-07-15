import { api } from './api';

// Interfaces TypeScript para garantir tipagem estrita (Sênior)
export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: string;
  pessoaId: string;
  nomePessoa: string;
}

export interface PessoaRelatorio {
  id: string;
  nome: string;
  idade: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface Relatorio {
  pessoas: PessoaRelatorio[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquidoGeral: number;
}

export const financeiroService = {
  async listarPessoas(): Promise<Pessoa[]> {
    const response = await api.get<Pessoa[]>('/pessoas');
    return response.data;
  },

  async cadastrarPessoa(nome: string, idade: number): Promise<Pessoa> {
    const response = await api.post<Pessoa>('/pessoas', { nome, idade });
    return response.data;
  },

  async deletarPessoa(id: string): Promise<void> {
    await api.delete(`/pessoas/${id}`);
  },

  async listarTransacoes(): Promise<Transacao[]> {
    const response = await api.get<Transacao[]>('/transacoes');
    return response.data;
  },

  async cadastrarTransacao(descricao: string, valor: number, tipo: number, pessoaId: string): Promise<Transacao> {
    const response = await api.post<Transacao>('/transacoes', { 
      descricao, 
      valor, 
      tipo, // O back-end mapeará o número (0 ou 1) para o Enum correspondente
      pessoaId 
    });
    return response.data;
  },

  async obterRelatorio(): Promise<Relatorio> {
    const response = await api.get<Relatorio>('/pessoas/totais');
    return response.data;
  }
};