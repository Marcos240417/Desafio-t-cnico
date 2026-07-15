using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface ITransacaoRepository
    {
        Task<IEnumerable<Transacao>> GetAllAsync();
        Task<IEnumerable<Transacao>> GetByPessoaIdAsync(Guid pessoaId);
        Task AddAsync(Transacao transacao);
        Task DeleteByPessoaIdAsync(Guid pessoaId);
    }
}