# barber-api

## Descrição

Um sistema completo de agendamento para barbearias com painel administrativo, geração de gráficos e controle de clientes e colaboradores.

## Funcionalidades Principais

- Agendamento de horários
- Cadastro de clientes e colaboradores
- Cadastro de serviços
- Geração de gráficos e relatórios
- Login com autenticação JWT

## Rotas de acesso

### Clientes

- /api/users
  - POST: /register
  - POST: /login
  - PUT: /:id
  - PUT: /password/:id
  - PUT: /email/:id
- /api/services
  - GET: /
  - POST: /
  - PUT: /:id
  - DELETE: /:id
- /api/employees
  - GET: /
  - POST: /
  - PUT: /:id
  - DELETE: /:id
- /api/clients
  - GET: /
  - POST: /
  - PUT: /:id
  - DELETE: /:id
- /api/customer-services
  - GET: /
  - POST: /
  - PUT: /:id
  - DELETE: /:id
- /comfirm-email-change:
  - GET: /