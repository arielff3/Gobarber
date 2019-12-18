import Sequelize, { Model } from 'sequelize';

class File extends Model {
  // Init é um métoodo que o sequuelize chama automaticamente
  static init(sequelize) {
    super.init(
      {
        /* Enviar colunas que estão na tabela, pode-se evitar as colunas com chaves
           primarias. Ex: createdat, id...
        */
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      {
        // Conexão com o banco
        sequelize,
      }
    );

    return this;
  }
}

export default File;
