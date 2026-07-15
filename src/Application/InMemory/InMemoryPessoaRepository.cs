using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;

namespace Application.InMemory
{
    public class InMemoryPessoaRepository : IPessoaRepository
    {
        private static readonly List<Pessoa> _pessoas = new();
        private readonly ITransacaoRepository _transacaoRepository;

        // Injeção de dependência via construtor para coordenar o cascade delete em memória
        public InMemoryPessoaRepository(ITransacaoRepository transacaoRepository)
        {
            _transacaoRepository = transacaoRepository;
        }

        public Task<IEnumerable<Pessoa>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Pessoa>>(_pessoas);
        }

        public Task<Pessoa?> GetByIdAsync(Guid id)
        {
            var pessoa = _pessoas.FirstOrDefault(p => p.Id == id);
            return Task.FromResult(pessoa);
        }

        public Task AddAsync(Pessoa pessoa)
        {
            _pessoas.Add(pessoa);
            return Task.CompletedTask;
        }

        public async Task DeleteAsync(Guid id)
        {
            var pessoa = _pessoas.FirstOrDefault(p => p.Id == id);
            if (pessoa != null)
            {
                // Garante que apagar a pessoa também expurgará as transações associadas
                await _transacaoRepository.DeleteByPessoaIdAsync(id);
                _pessoas.Remove(pessoa);
            }
        }
    }
}