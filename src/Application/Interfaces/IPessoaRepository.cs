using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IPessoaRepository
    {
        Task<IEnumerable<Pessoa>> GetAllAsync();
        Task<Pessoa?> GetByIdAsync(Guid id);
        Task AddAsync(Pessoa pessoa);
        Task DeleteAsync(Guid id);
    }
}