using System;

namespace Domain.Entities
{
    public class Pessoa
    {
        // Propriedades com "private set" garantem que o estado da entidade 
        // só seja modificado de maneira controlada (Encapsulamento Sênior).
        public Guid Id { get; private set; }
        public string Nome { get; private set; }
        public int Idade { get; private set; }

        // Construtor rico: Valida os dados antes de criar a instância
        public Pessoa(string nome, int idade)
        {
            Validate(nome, idade);
            
            Id = Guid.NewGuid();
            Nome = nome;
            Idade = idade;
        }

        // Regra de especificação do Domínio
        public bool EhMenorDeIdade() => Idade < 18;

        private static void Validate(string nome, int idade)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new ArgumentException("O nome do morador é obrigatório e não pode ser vazio.");
                
            // CORRIGIDO: alterado de "date" para "idade"
            if (idade < 0 || idade > 120)
                throw new ArgumentOutOfRangeException(nameof(idade), "Idade inválida. Deve estar entre 0 e 120 anos.");
        }
    }
}