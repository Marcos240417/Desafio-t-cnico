using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;

namespace Application.InMemory
{
    public class InMemoryTransacaoRepository : ITransacaoRepository
    {
        private static readonly List<Transacao> _transacoes = new();

        public Task<IEnumerable<Transacao>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Transacao>>(_transacoes);
        }

        public Task<IEnumerable<Transacao>> GetByPessoaIdAsync(Guid pessoaId)
        {
            var filtradas = _transacoes.Where(t => t.PessoaId == pessoaId);
            return Task.FromResult(filtradas);
        }

        public Task AddAsync(Transacao transacao)
        {
            _transacoes.Add(transacao);
            return Task.CompletedTask;
        }

        public Task DeleteByPessoaIdAsync(Guid pessoaId)
        {
            _transacoes.RemoveAll(t => t.PessoaId == pessoaId);
            return Task.CompletedTask;
        }
    }
}