using System;
using System.Collections.Generic;

namespace Application.Dtos
{
    public record CriarPessoaRequest(string Nome, int Idade);
    
    public record CriarTransacaoRequest(string Descricao, decimal Valor, int Tipo, Guid PessoaId);

    public record PessoaRelatorioDto
    {
        public Guid Id { get; init; }
        public string Nome { get; init; } = string.Empty;
        public int Idade { get; init; }
        public decimal TotalReceitas { get; init; }
        public decimal TotalDespesas { get; init; }
        public decimal Saldo { get; init; }
    }

    public record RelatorioFinanceiroDto
    {
        public List<PessoaRelatorioDto> Pessoas { get; init; } = new();
        public decimal TotalGeralReceitas { get; init; }
        public decimal TotalGeralDespesas { get; init; }
        public decimal SaldoLiquidoGeral { get; init; }
    }
}