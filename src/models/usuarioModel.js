var database = require("../database/config")
var bcrypt = require("bcrypt");

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT CPF, nome, email, fkFilial as idFilial, fkCargo FROM Usuario WHERE email = '${email}' AND senha = SHA2('${senha}', 256);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function cadastrarResponsavel(cpf, nome_responsavel, email, telefone, nome_empresa) {
    var selectSql = `SELECT idFilial FROM Filial WHERE nome = '${nome_empresa}'`;
  
    return database.executar(selectSql).then(result => {
        if (result.length === 0) {
            throw new Error("Filial não encontrada");
        }
        
        var fkFilial = result[0].idFilial;
        var senha = `NE@${cpf.slice(0, 3)}${telefone.slice(-3)}`;
  
        var insertSql = `INSERT INTO Usuario (cpf, nome, email, senha, numTelefone, fkFilial, fkCargo) VALUES ('${cpf}', '${nome_responsavel}', '${email}', SHA2('${senha}', 256), '${telefone}', '${fkFilial}', 1)`;
    
        return database.executar(insertSql);
    }); 
  }

module.exports = {
    autenticar,
    cadastrarResponsavel
};