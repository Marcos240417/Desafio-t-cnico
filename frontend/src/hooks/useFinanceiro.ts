import { useState, useEffect, useCallback } from 'react';
import { financeiroService } from '../services/financeiroService';
import type { Pessoa, Transacao, Relatorio } from '../services/financeiroService'; 

export function useFinanceiro() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega todas as informações das tabelas em paralelo com Promise.all 
  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const [listaP, listaT, rel] = await Promise.all([
        financeiroService.listarPessoas(),
        financeiroService.listarTransacoes(),
        financeiroService.obterRelatorio()
      ]);
      setPessoas(listaP);
      setTransacoes(listaT);
      setRelatorio(rel);
    } catch (err: any) {
      // Captura o erro customizado gerado pelo ExceptionHandlingMiddleware do .NET (Problem Details)
      setErro(err.response?.data?.detail || "Ocorreu um erro ao buscar dados no servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  const cadastrarPessoa = async (nome: string, idade: number) => {
    setErro(null);
    try {
      await financeiroService.cadastrarPessoa(nome, idade);
      await carregarDados();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Falha ao cadastrar pessoa.";
      setErro(msg);
      throw new Error(msg);
    }
  };

  const deletarPessoa = async (id: string) => {
    setErro(null);
    try {
      await financeiroService.deletarPessoa(id);
      await carregarDados();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Falha ao deletar pessoa.";
      setErro(msg);
      throw new Error(msg);
    }
  };

  const cadastrarTransacao = async (descricao: string, valor: number, tipo: number, pessoaId: string) => {
    setErro(null);
    try {
      await financeiroService.cadastrarTransacao(descricao, valor, tipo, pessoaId);
      await carregarDados();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Falha ao salvar transação.";
      setErro(msg);
      throw new Error(msg);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  return {
    pessoas,
    transacoes,
    relatorio,
    loading,
    erro,
    setErro,
    cadastrarPessoa,
    deletarPessoa,
    cadastrarTransacao,
    recarregar: carregarDados
  };
}