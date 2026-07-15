using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;

namespace Application.Services
{
    public class FinanceiroService
    {
        private readonly IPessoaRepository _pessoaRepository;
        private readonly ITransacaoRepository _transacaoRepository;

        public FinanceiroService(IPessoaRepository pessoaRepository, ITransacaoRepository transacaoRepository)
        {
            _pessoaRepository = pessoaRepository;
            _transacaoRepository = transacaoRepository;
        }

        public async Task<RelatorioFinanceiroDto> ObterRelatorioFinanceiroAsync()
        {
            var pessoas = await _pessoaRepository.GetAllAsync();
            var transacoesTodas = await _transacaoRepository.GetAllAsync();

            var listaPessoasDto = pessoas.Select(p =>
            {
                var transacoesDaPessoa = transacoesTodas.Where(t => t.PessoaId == p.Id).ToList();
                
                var receitas = transacoesDaPessoa.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
                var despesas = transacoesDaPessoa.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);

                return new PessoaRelatorioDto
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Idade = p.Idade,
                    TotalReceitas = receitas,
                    TotalDespesas = despesas,
                    Saldo = receitas - despesas
                };
            }).ToList();

            var totalGeralReceitas = listaPessoasDto.Sum(p => p.TotalReceitas);
            var totalGeralDespesas = listaPessoasDto.Sum(p => p.TotalDespesas);

            return new RelatorioFinanceiroDto
            {
                Pessoas = listaPessoasDto,
                TotalGeralReceitas = totalGeralReceitas,
                TotalGeralDespesas = totalGeralDespesas,
                SaldoLiquidoGeral = totalGeralReceitas - totalGeralDespesas
            };
        }
    }
}