using System;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly ITransacaoRepository _transacaoRepository;
        private readonly IPessoaRepository _pessoaRepository;

        public TransacoesController(ITransacaoRepository transacaoRepository, IPessoaRepository pessoaRepository)
        {
            _transacaoRepository = transacaoRepository;
            _pessoaRepository = pessoaRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var transacoes = await _transacaoRepository.GetAllAsync();
            var pessoas = await _pessoaRepository.GetAllAsync();

            // Mapeia adicionando o nome da pessoa de forma amigável para o consumo do front-end
            var resultado = transacoes.Select(t => new
            {
                t.Id,
                t.Descricao,
                t.Valor,
                Tipo = t.Tipo.ToString(),
                t.PessoaId,
                NomePessoa = pessoas.FirstOrDefault(p => p.Id == t.PessoaId)?.Nome ?? "Desconhecido"
            });

            return Ok(resultado);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CriarTransacaoRequest request)
        {
            var pessoa = await _pessoaRepository.GetByIdAsync(request.PessoaId);
            if (pessoa == null)
                return BadRequest("A pessoa informada para esta transação não existe.");

            var tipoEnum = (TipoTransacao)request.Tipo;

            // Instancia a entidade rica executando a validação de menor de idade centralizada no domínio
            var transacao = new Transacao(request.Descricao, request.Valor, tipoEnum, pessoa);
            
            await _transacaoRepository.AddAsync(transacao);
            return Ok(transacao);
        }
    }
}