using System;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Application.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly IPessoaRepository _pessoaRepository;
        private readonly FinanceiroService _financeiroService;

        public PessoasController(IPessoaRepository pessoaRepository, FinanceiroService financeiroService)
        {
            _pessoaRepository = pessoaRepository;
            _financeiroService = financeiroService;
        }

        // RESTAURADO: Volta a listar as pessoas de forma simples para não quebrar o React
        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _pessoaRepository.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CriarPessoaRequest request)
        {
            var pessoa = new Pessoa(request.Nome, request.Idade);
            await _pessoaRepository.AddAsync(pessoa);
            return CreatedAtAction(nameof(Get), new { id = pessoa.Id }, pessoa);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _pessoaRepository.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("totais")]
        public async Task<IActionResult> GetTotais() => Ok(await _financeiroService.ObterRelatorioFinanceiroAsync());
    }
}