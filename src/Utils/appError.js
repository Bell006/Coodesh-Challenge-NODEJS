//Tratando erros e exceções
class AppError {
    //Nomeando no topo, permite acesso de toda a classe.
    message;
    statusCode;

    //O constructor é carregado automaticamente quando a classe é instanciada.
    constructor(message, statusCode = 400){
        this.message = message;
        this.statusCode = statusCode
    }
}

module.exports = AppError;