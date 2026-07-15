#  Controle de Gastos Residenciais

Um sistema moderno e robusto de gerenciamento financeiro compartilhado para residências. 
O projeto foi arquitetado utilizando práticas de **Clean Code**, separação estrita de 
responsabilidades no back-end com **.NET 10** e uma interface reativa de alta fidelidade com **React, TypeScript e Tailwind CSS**.

---

##  Recursos Principais

- **Gerenciamento de Moradores:** Cadastro e exclusão de moradores com comportamento de exclusão
 em cascata (*Cascade Delete*) no banco de dados para transações órfãs.
- **Lançamentos Inteligentes:** Cadastro de receitas e despesas vinculadas a um morador responsável.
- **Regra de Negócio Adaptativa (Domínio):** Menores de 18 anos são impedidos preventivamente (tanto no front-end quanto no back-end)
 de possuir lançamentos do tipo **Receita**, sendo restritos apenas a **Despesas**.
- **Relatório Financeiro Individual:** Tabela consolidada calculando receitas totais, despesas e saldo líquido de cada morador em tempo real.
- **Resumo Consolidado Geral:** Totalização agregada de todo o fluxo de caixa do condomínio residencial.
- **Atualização em Tempo Real:** Sincronização automática de dados após qualquer inserção ou exclusão, eliminando a necessidade de atualizar a página (F5).

---

##  Tecnologias Utilizadas

### **Back-end**
- **Ambiente de Execução:** .NET 10
- **Persistência de Dados:** Entity Framework Core (EF Core)
- **Banco de Dados:** SQLite
- **Arquitetura:** Camadas bem definidas (*Domain*, *Application*, *Infrastructure*, *Presentation.Api*)

### **Front-end**
- **Biblioteca:** React (com Vite e TypeScript)
- **Estilização:** Tailwind CSS
- **Gerenciamento de Estado:** Hooks customizados (`useFinanceiro`) para isolamento de lógica de rede e estado
- **Comunicação HTTP:** Axios

---

##  Estrutura do Projeto

```text
ControleGastosResidenciais/
├── src/
│   ├── Domain/                 # Entidades de domínio e regras de negócio essenciais
│   ├── Application/            # Casos de uso, Serviços (FinanceiroService) e DTOs
│   ├── Infrastructure/         # AppDbContext, Repositórios e Persistência SQLite
│   └── Presentation.Api/       # Controllers HTTP (PessoasController, TransacoesController)
└── frontend/
    ├── src/
    │   ├── hooks/              # Custom HookuseFinanceiro para consumo da API
    │   ├── services/           # Configuração de clientes de rede (api.ts)
    │   └── App.tsx             # Interface do painel de controle de alto nível
