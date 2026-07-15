using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class SqliteTransacaoRepository : ITransacaoRepository
    {
        private readonly AppDbContext _context;

        public SqliteTransacaoRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<Transacao>> GetAllAsync()
        {
            return await _context.Transacoes.AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<Transacao>> GetByPessoaIdAsync(Guid pessoaId)
        {
            return await _context.Transacoes
                                 .AsNoTracking()
                                 .Where(t => t.PessoaId == pessoaId)
                                 .ToListAsync();
        }

        public async Task AddAsync(Transacao transacao)
        {
            await _context.Transacoes.AddAsync(transacao);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteByPessoaIdAsync(Guid pessoaId)
        {
            var transacoes = _context.Transacoes.Where(t => t.PessoaId == pessoaId);
            _context.Transacoes.RemoveRange(transacoes);
            await _context.SaveChangesAsync();
        }
    }
}