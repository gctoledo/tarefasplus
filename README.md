# Tarefas+

Projeto de organizador de tarefas criado com NextJS, utilizando a autenticação com o Google para o sistema de login, que é gerenciado pelo Next Auth e armazenado no Firebase. A aplicação possui sistema de cadastro, edição e remoção tarefas, podendo deixa-las privadas ou públicas. Também possui sistema de comentários para as tarefas públicas.

## 🔥 Introdução

O projeto consiste em um site utilizado para organização de tarefas. Após efetuar o login utilizando sua conta Google, o usuário recebe a permissão para acessar o Dashboard, que possui rota protegida, e com isso pode cadastrar, editar ou deletar suas tarefas, podendo torna-las privadas ou públicas, que serão armazenadas no banco de dados do Firebase (Firestore). O sistema de rotas foi criado utilizando o próprio sistema do NextJS, contando com rotas protegidas para o Dashboard, permitindo apenas usuários logados a acessarem suas configurações. O gerenciamento de autenticação fica responsável pelo próprio NextAuth.

### 🔨 Guia de instalação

Para visualizar o projeto é necessário possuir o NodeJS instalado em sua máquina. Você pode fazer um clone do repositório e executar os seguintes comandos no terminal para visualizar o projeto:

Clone o projeto

```
  git clone https://github.com/gctoledo/tarefasplus
```

Entre no diretório do projeto

```
  cd my-project
```

Instale as dependências

```
  npm install
```

Inicie o servidor

```
  npm run dev
```

## 📦 Tecnologias usadas:

- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
- ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
