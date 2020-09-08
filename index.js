//Criar uma base mysql chamada "teste"

//Conexão:
var ejs = require("ejs");       //Gera o template
var pdf = require("html-pdf");  //Gera o PDF

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306, //Porta da base
  user: 'root',
  password: '', //Sem senha
  database: 'teste'
});

connection.connect(function (err) {
  if (err) return console.log(err);
  console.log('Conectado na base de dados!');
  createTable(connection);
  leDados(connection);
})

//Servidor:
const http = require("http");
const fs = require('fs').promises;
const host = 'localhost';
const port = 8000; //Porta do servidor

///////////////////////////////////////////////////////////////////////////////////////

//Cria a base:
function createTable(conn) {

  const sql = "CREATE TABLE IF NOT EXISTS Alunos " +
    "(ID int NOT NULL AUTO_INCREMENT, " +
    "Nome varchar(150) NOT NULL, " +
    "Curso varchar(150) NOT NULL, " +
    "Inicio varchar(150) NOT NULL, " +
    "Final varchar(150) NOT NULL, " +
    "Horas int NOT NULL, " +
    "Cidade varchar(150) NOT NULL, " +
    "Dia int NOT NULL, " +
    "Mes varchar(150) NOT NULL, " +
    "Ano varchar(150) NOT NULL, PRIMARY KEY (ID));";

  conn.query(sql, function (error, results, fields) {
    if (error) return console.log(error);
    console.log('Tabela criada!');
    adicionaGente(conn);

///////////////////////////////////////////////////////////////////////////////////////

    //Popula a tabela:
    function adicionaGente(conn) {
      const sql = "INSERT INTO Alunos(Nome,Curso,Inicio,Final,Horas,Cidade,Dia,Mes,Ano) VALUES ?";
      const values = [
        ['Laurindo Schwaltz Jr', 'Análise e Desenvolvimento de Sistemas','15/10/2016','20/12/2020',948,'Porto Alegre',15,'janeiro',2020],
        ['Estrogildo Olegário Santos', 'Pós Graduação em Culinária','12/03/2010','20/10/2018',845,'Viamão',16,'março',2020],
        ['Hermengarda Belicosa Filha', 'Geografia e Ciências Políticas','03/06/2019','11/03/2020',324,'Cambará do Sul',12,'abril',2020],
        ['Leovesgaldina da Silva', 'Artes e Literatura Avançado','12/08/1996','15/11/2017',265,'Gravataí',19,'maio',2017],
        ['Asperinilson Laos Claos', 'Bacharelado em Consultoria Sutil','08/04/2015','16/08/2020',120,'São Leopoldo',03,'agosto',2019],
      ];
      conn.query(sql, [values], function (error, results, fields) {
        if (error) return console.log(error);
        console.log('Registros inseridos na tabela!');
        conn.end();
      });
    }
  });
}

///////////////////////////////////////////////////////////////////////////////////////

// lê os dados do Banco e coloca num Array:
function leDados(connection) {
  const sql = "SELECT * FROM Alunos;";
  let resposta = [];

  connection.query(sql, function (error, result, fields) {
    if (error) return console.log(error);
    
    result.map(function (dados) {
      let recebidos = {
        nome: dados.Nome,
        curso: dados.Curso,
        inicio: dados.Inicio,
        final: dados.Final,
        horas: dados.Horas,
        cidade: dados.Cidade,
        dia: dados.Dia,
        mes: dados.Mes,
        ano: dados.Ano,
      }
      resposta.push(recebidos);
    });
    console.log('Dados recebidos!');

///////////////////////////////////////////////////////////////////////////////////////    
   
// Cria os PDFs preenchidos:
    for (let i = 0; i < resposta.length; i++) {
      ejs.renderFile("certificado.ejs", { 
        nome: resposta[i].nome, 
        curso: resposta[i].curso,
        inicio: resposta[i].inicio,
        final: resposta[i].final,
        horas: resposta[i].horas,
        cidade: resposta[i].cidade,
        dia: resposta[i].dia,
        mes: resposta[i].mes,
        ano: resposta[i].ano,
      }, (err, html) => {
        if (err) {
          console.log("ERRO!");
        } else {
      
          let options = {
            "orientation": "landscape", 
            "format": "A4", 
            "height": "auto"
          };
          
          pdf.create(html, options).toFile("teste" + [i] + ".pdf", (err, res) => {
            if (err) {
              console.log("Erro em criar o PDF");
            } else {
              console.log(res);
            }
          })
        }
      });
    }
  })
}