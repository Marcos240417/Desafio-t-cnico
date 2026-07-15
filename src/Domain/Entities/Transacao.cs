using System;
using Domain.Enums;

namespace Domain.Entities
{
    public class Transacao
    {
        public Guid Id { get; private set; }
        public string Descricao { get; private set; } = null!;
        public decimal Valor { get; private set; }
        public TipoTransacao Tipo { get; private set; }
        public Guid PessoaId { get; private set; }
        
        public virtual Pessoa Pessoa { get; private set; } = null!; 

        public Transacao(string descricao, decimal valor, TipoTransacao tipo, Pessoa pessoa)
        {
            if (pessoa == null)
                throw new ArgumentNullException(nameof(pessoa), "A transação precisa estar associada a uma pessoa válida.");

            Validate(descricao, valor, tipo, pessoa); // CORRIGIDO: de pessaO para pessoa

            Id = Guid.NewGuid();
            Descricao = descricao;
            Valor = valor;
            Tipo = tipo;
            PessoaId = pessoa.Id;
        }

        protected Transacao() { }

        private static void Validate(string descricao, decimal valor, TipoTransacao tipo, Pessoa pessoa)
        {
            if (string.IsNullOrWhiteSpace(descricao))
                throw new ArgumentException("A descrição da transação é obrigatória.");

            if (valor <= 0)
                throw new ArgumentException("O valor da transação deve ser estritamente maior que zero.");

            if (pessoa.EhMenorDeIdade() && tipo == TipoTransacao.Receita)
                throw new InvalidOperationException($"Violação de Regra de Negócio: Não é permitido registrar RECEITAS para menores de idade ({pessoa.Nome}).");
        }
    }
}