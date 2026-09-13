# Back-end — Lista de Casamento Virtual

API em Node.js + Express + PostgreSQL. Cobre as 4 funcionalidades dos sprints:

- **Sprint 1:** cadastro/login (JWT) + CRUD de presentes
- **Sprint 2:** listagem pública e paginada de presentes (por slug do casal)
- **Sprint 3:** checkout simulado (transação financeira fictícia)
- **Sprint 4:** dashboard (total arrecadado + quem comprou o quê)

## Como rodar

### Instalar o PostgreSQL (uma vez, em cada máquina)

1. **Instale o PostgreSQL** — baixe em [postgresql.org/download](https://www.postgresql.org/download/) e instale (o instalador já vem com o **pgAdmin**, uma interface visual pra mexer no banco). Durante a instalação, ele vai pedir uma senha para o usuário `postgres` — anote essa senha, você vai precisar dela no `.env`.

2. **Crie o banco `lista_casamento` e rode o `schema.sql`:**
   - Pelo terminal (se `psql` estiver no PATH):
     ```bash
     createdb lista_casamento
     psql -d lista_casamento -f src/db/schema.sql
     ```
   - Ou pelo **pgAdmin** (mais fácil pra quem não usa terminal com Postgres):
     1. Abra o pgAdmin, conecte no servidor local com a senha que você definiu.
     2. Clique com o botão direito em "Databases" → "Create" → "Database..." → nome `lista_casamento`.
     3. Clique no banco criado → "Query Tool".
     4. Abra o arquivo `src/db/schema.sql` num editor de texto, copie todo o conteúdo, cole na Query Tool e aperte F5 (ou o botão de "play") para executar.

3. **Configure o `.env`:**
   ```bash
   cp .env.example .env
   ```
   Edite o `.env` e coloque a senha que você definiu na instalação em `DB_PASSWORD`.

4. **Instale as dependências e rode:**
   ```bash
   npm install
   npm run dev
   ```

   API sobe em `http://localhost:3333`.

### Alternativa: Docker (opcional)

Se em algum momento quiserem uma forma mais rápida de testar localmente sem instalar o Postgres em cada máquina, o projeto também inclui um `docker-compose.yml` — mas como decidiram seguir com instalação nativa por causa da avaliação do professor, o passo a passo acima é o oficial.

## Endpoints

### Auth (Sprint 1)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/cadastro` | `{ nome, email, senha }` → cria conta do casal |
| POST | `/api/auth/login` | `{ email, senha }` → retorna token JWT |

### Presentes — privado (Sprint 1)
> Precisa do header `Authorization: Bearer <token>`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/presentes` | `{ titulo, descricao, valor, imagem_url }` → cria presente |
| GET | `/api/presentes` | lista os presentes do casal logado |
| PUT | `/api/presentes/:id` | edita um presente |
| DELETE | `/api/presentes/:id` | remove um presente |

### Presentes — público (Sprint 2)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/publico/:slug/presentes?pagina=1&limite=6` | lista paginada, sem login |

### Pagamento — público (Sprint 3)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/pagamentos` | `{ gift_id, nome_convidado, mensagem }` → simula pagamento e marca presente como comprado |

### Dashboard — privado (Sprint 4)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/dashboard` | totais arrecadados + lista de quem comprou o quê |

## Notas para o vídeo de cada sprint

- Sprint 1: mostrar cadastro → login → criação de um presente (Postman/Insomnia ou já com o front).
- Sprint 2: mostrar a lista pública carregando com paginação (mudar `pagina=2`).
- Sprint 3: mostrar o POST em `/api/pagamentos` e o presente virando `comprado`.
- Sprint 4: mostrar o GET em `/api/dashboard` com o total somado corretamente.

## Sobre uso de IA

Este código foi montado com apoio de IA. Antes de subir pro GitHub, revise e remova qualquer comentário do tipo `// gerado por IA` que não deva ir pro repositório entregue, conforme a orientação do professor.
