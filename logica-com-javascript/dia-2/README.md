## Como executar

Se você for executar esse projeto localmente, siga os passos abaixo, considerando que esteja no Linux. Caso esteja no Windows, talvez usar o PowerShell ajude por ter comandos mais semelhantes:

### Pré-requisitos

1. Tenha o [Node.js](https://nodejs.org/) instalado. Teste com `node --version`;
2. Tenha o [npm](https://www.npmjs.com/) instalado. Teste com `npm -v`;
3. Tenha o [GIT](https://git-scm.com/) instalado. Teste com `git`;

### Setup local

1. Clone o repositório local em um diretório de sua escolha com o seguinte comando:

```bash
git clone git@github.com:chinaglia-rafa/7DaysOfCode.git
```

2. Acesse o projeto do Wordle dentro do repositório com o seguinte comando:

```bash
cd 7DaysOfCode/logica-com-javascript
```

3. O projeto terá sido baixado, mas as dependências (bibliotecas e softwares que o projeto usa e o autor não escreveu diretamente) não. Para baixá-las, utilize o comando abaixo:

```bash
npm install
```

4. Execute o projeto (que criará um servidor HTTP simples para o projeto):

```bash
npm start
```

5. Acesse este endereço usando seu navegador: [http://127.0.0.1:8080](http://127.0.0.1:8080).
