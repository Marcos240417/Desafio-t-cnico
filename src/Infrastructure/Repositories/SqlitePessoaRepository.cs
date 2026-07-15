using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class SqlitePessoaRepository : IPessoaRepository
    {
        private readonly AppDbContext _context;

        public SqlitePessoaRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<Pessoa>> GetAllAsync()
        {
            return await _context.Pessoas.AsNoTracking().ToListAsync();
        }

        public async Task<Pessoa?> GetByIdAsync(Guid id)
        {
            return await _context.Pessoas.FindAsync(id);
        }

        public async Task AddAsync(Pessoa pessoa)
        {
            await _context.Pessoas.AddAsync(pessoa);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa != null)
            {
                _context.Pessoas.Remove(pessoa);
                // O EF Core executará o Cascade Delete nas transações automaticamente baseado no mapeamento Fluent API
                await _context.SaveChangesAsync();
            }
        }
    }
}