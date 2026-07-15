import React, { useState } from 'react';
import { useFinanceiro } from './hooks/useFinanceiro';
import { api } from './services/api'; 

// Definição das interfaces locais
interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: string;
  pessoaId: string;
  nomePessoa: string;
}

interface PessoaRelatorio {
  id: string;
  nome: string;
  idade: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export default function App() {
  // Consumo do hook customizado
  const {
    pessoas,
    transacoes, 
    relatorio,
    erro,
    setErro,
    cadastrarPessoa,
    deletarPessoa,
    cadastrarTransacao
  } = useFinanceiro();

  // Estado local para reatividade instantânea do relatório
  const [relatorioLocal, setRelatorioLocal] = useState<any>(null);

  // Estados dos formulários locais
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<0 | 1>(0); // 0 = Despesa, 1 = Receita
  const [pessoaId, setPessoaId] = useState('');

  // Sincroniza o relatório local assim que o hook carregar o relatório inicial da API
  React.useEffect(() => {
    if (relatorio) {
      setRelatorioLocal(relatorio);
    }
  }, [relatorio]);

  // Força a atualização do relatório buscando direto da rota da API
  const forcarAtualizacaoRelatorio = async () => {
    try {
      const response = await api.get('/pessoas/totais');
      setRelatorioLocal(response.data);
    } catch (err) {
      console.error("Falha ao atualizar relatório em tempo real", err);
    }
  };

  // Handler para envio do formulário de Moradores
  const handlePessoaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !idade) return;
    try {
      await cadastrarPessoa(nome, Number(idade));
      setNome('');
      setIdade('');
      
      // Atualiza o relatório imediatamente sem delays artificiais
      await forcarAtualizacaoRelatorio();
    } catch (err: any) {
      // Erro tratado no hook
    }
  };

  // Handler para envio do formulário de Transações (Controle de Gastos)
  const handleTransacaoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valor || !pessoaId) return;

    // REQUISITO IMPEDITIVO DE DOMÍNIO: Validação preventiva no front-end para menores de idade
    const moradorSelecionado = pessoas.find(p => p.id === pessoaId);
    if (moradorSelecionado && moradorSelecionado.idade < 18 && tipo === 1) {
      setErro(`Regra de Negócio: ${moradorSelecionado.nome} é menor de idade (${moradorSelecionado.idade} anos) e só pode possuir lançamentos do tipo DESPESA.`);
      return;
    }

    try {
      // Enviamos 'pessoaId' diretamente para que o hook grave corretamente no back-end
      await cadastrarTransacao(descricao, Number(valor), tipo, pessoaId);
      setDescricao('');
      setValor('');

      // Sincroniza e atualiza os saldos e o Resumo Geral em tempo real
      await forcarAtualizacaoRelatorio();
    } catch (err: any) {
      // Erro tratado no hook
    }
  };

  // Handler para remoção de morador
  const handleDeletarPessoa = async (id: string, nomeMorador: string) => {
    if (window.confirm(`Deseja excluir ${nomeMorador}? Todas as transações associadas serão permanentemente removidas.`)) {
      try {
        await deletarPessoa(id);
        // Atualiza o relatório imediatamente após a deleção
        await forcarAtualizacaoRelatorio();
      } catch (err: any) {
        // Erro tratado no hook
      }
    }
  };

  // Define qual fonte de dados usar para renderizar o relatório de baixo
  const dadosExibicao = relatorioLocal || relatorio;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Controle de Gastos Residenciais</h1>
        <p className="text-slate-500 text-sm">Painel de gerenciamento financeiro de alto nível</p>
      </header>

      {/* Alerta de feedback de regras de negócio ou falhas mapeadas */}
      {erro && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-md flex justify-between items-center shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs text-rose-500 font-bold uppercase tracking-wider">Restrição de Validação</span>
            <p className="text-sm text-rose-700 font-semibold">{erro}</p>
          </div>
          <button onClick={() => setErro(null)} className="text-rose-500 hover:text-rose-700 font-bold text-xl px-2">×</button>
        </div>
      )}

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* REQUISITO: CADASTRO DE PESSOAS */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-4 text-slate-700">Moradores</h2>
          <form onSubmit={handlePessoaSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Nome" 
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent col-span-1 sm:col-span-2"
              required
            />
            <input 
              type="number" 
              placeholder="Idade" 
              value={idade}
              onChange={e => setIdade(e.target.value)}
              className="p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button className="sm:col-span-3 bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-blue-700 transition shadow-sm">
              Cadastrar Morador
            </button>
          </form>

          <h3 className="font-semibold text-slate-600 mb-3 text-sm">Moradores Cadastrados:</h3>
          <div className="max-h-48 overflow-y-auto divide-y border border-slate-100 rounded-lg">
            {pessoas.length === 0 ? (
              <p className="p-4 text-center text-slate-400 text-sm">Nenhum morador cadastrado.</p>
            ) : (
              pessoas.map((p: Pessoa) => (
                <div key={p.id} className="p-3 flex justify-between items-center hover:bg-slate-50">
                  <span className="text-sm font-medium text-slate-700">
                    {p.nome} <span className="text-slate-400 text-xs">({p.idade} anos)</span>
                  </span>
                  <button 
                    onClick={() => handleDeletarPessoa(p.id, p.nome)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Excluir
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* REQUISITO: CADASTRO DE TRANSAÇÕES */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-4 text-slate-700">Novo Lançamento</h2>
          <form onSubmit={handleTransacaoSubmit} className="space-y-4 mb-6">
            <input 
              type="text" 
              placeholder="Descrição da despesa ou receita" 
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="number" 
                placeholder="Valor (R$)" 
                value={valor}
                onChange={e => setValor(e.target.value)}
                className="p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <select
                value={tipo}
                onChange={e => setTipo(Number(e.target.value) as 0 | 1)}
                className="p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Despesa</option>
                {(() => {
                  const m = pessoas.find(p => p.id === pessoaId);
                  return m && m.idade < 18 ? (
                    <option value={1} disabled className="text-slate-300">Receita (Bloqueado p/ menores)</option>
                  ) : (
                    <option value={1}>Receita</option>
                  );
                })()}
              </select>
            </div>

            <select 
              value={pessoaId} 
              onChange={e => setPessoaId(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione o morador responsável</option>
              {pessoas.map((p: Pessoa) => (
                <option key={p.id} value={p.id}>{p.nome} ({p.idade} anos)</option>
              ))}
            </select>

            <button className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-emerald-700 transition shadow-sm">
              Lançar Transação
            </button>
          </form>

          {/* REQUISITO: HISTÓRICO DE LANÇAMENTOS */}
          <h3 className="font-semibold text-slate-600 mb-3 text-sm">Lançamentos Recentes:</h3>
          <div className="max-h-36 overflow-y-auto divide-y border border-slate-100 rounded-lg text-xs">
            {transacoes.length === 0 ? (
              <p className="p-3 text-center text-slate-400">Nenhum lançamento efetuado.</p>
            ) : (
              transacoes.map((t: Transacao) => (
                <div key={t.id} className="p-2.5 flex justify-between items-center hover:bg-slate-50">
                  <div>
                    <span className="font-semibold text-slate-700 block">{t.descricao}</span>
                    <span className="text-slate-400 text-[10px]">Resp: {t.nomePessoa}</span>
                  </div>
                  <span className={`font-bold ${t.tipo === 'Receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.tipo === 'Receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* REQUISITO: CONSULTA DE TOTAIS INDIVIDUAIS E AGREGADOS */}
      <section className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-8">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Relatório Financeiro Individual</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b">
                <th className="p-4">Morador</th>
                <th className="p-4">Idade</th>
                <th className="p-4 text-emerald-600">Total Receitas</th>
                <th className="p-4 text-rose-600">Total Despesas</th>
                <th className="p-4">Saldo Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {!dadosExibicao || !dadosExibicao.pessoas || dadosExibicao.pessoas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-400">Nenhum dado financeiro consolidado para exibir.</td>
                </tr>
              ) : (
                dadosExibicao.pessoas.map((p: PessoaRelatorio) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-700">{p.nome}</td>
                    <td className="p-4 text-slate-500">{p.idade} anos</td>
                    <td className="p-4 text-emerald-600 font-medium">+ R$ {(p.totalReceitas ?? 0).toFixed(2)}</td>
                    <td className="p-4 text-rose-600 font-medium">- R$ {(p.totalDespesas ?? 0).toFixed(2)}</td>
                    <td className={`p-4 font-bold ${(p.saldo ?? 0) >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                      R$ {(p.saldo ?? 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* REQUISITO EXIGIDO: TOTALIZAÇÃO GERAL E AGREGADA */}
        {dadosExibicao && dadosExibicao.pessoas && dadosExibicao.pessoas.length > 0 && (
          <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <span className="text-sm font-bold text-slate-700 block">Resumo Consolidado Geral</span>
              <span className="text-xs text-slate-400">Totalização agregada de todas as contas da residência</span>
            </div>
            <div className="flex flex-wrap gap-6 md:gap-12">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Total Receitas</span>
                <span className="text-xl font-black text-emerald-600">+ R$ {(dadosExibicao.totalGeralReceitas ?? 0).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Total Despesas</span>
                <span className="text-xl font-black text-rose-600">- R$ {(dadosExibicao.totalGeralDespesas ?? 0).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Saldo Líquido Geral</span>
                <span className={`text-xl font-black ${(dadosExibicao.saldoLiquidoGeral ?? 0) >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                  R$ {(dadosExibicao.saldoLiquidoGeral ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}