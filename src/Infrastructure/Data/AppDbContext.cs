using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Pessoa> Pessoas => Set<Pessoa>();
        public DbSet<Transacao> Transacoes => Set<Transacao>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pessoa>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Idade).IsRequired();

                // SOLUÇÃO DEFINITIVA: Mapeia a propriedade 'Pessoa' explicitamente para evitar a coluna 'PessoaId1'
                entity.HasMany<Transacao>() 
                      .WithOne(t => t.Pessoa)
                      .HasForeignKey(t => t.PessoaId)
                      .OnDelete(DeleteBehavior.Cascade); 
            });

            modelBuilder.Entity<Transacao>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Descricao).IsRequired().HasMaxLength(250);
                entity.Property(e => e.Valor).HasConversion<double>().IsRequired();
                entity.Property(e => e.Tipo).HasConversion<string>().IsRequired();
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}