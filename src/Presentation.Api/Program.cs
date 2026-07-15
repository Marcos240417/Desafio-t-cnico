using Application.Interfaces;
using Application.Services;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Presentation.Api.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// 1. Configura o Banco de Dados Físico SQLite (Gerará o arquivo financas.db na pasta da API)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=financas.db"));

// 2. Injeção de Dependências da Arquitetura (Mapeando contratos para implementações do SQLite)
builder.Services.AddScoped<IPessoaRepository, SqlitePessoaRepository>();
builder.Services.AddScoped<ITransacaoRepository, SqliteTransacaoRepository>();
builder.Services.AddScoped<FinanceiroService>();

// 3. Configura a política de CORS para permitir a comunicação com o React Front-end
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactAppPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 4. Garante que o banco seja criado fisicamente na primeira execução com base nas Fluent APIs
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

// Ativa o tratamento de erros global sênior
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactAppPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();