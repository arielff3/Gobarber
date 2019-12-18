import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // Init é um métoodo que o sequuelize chama automaticamente
  static init(sequelize) {
    super.init(
      {
        /* Enviar colunas que estão na tabela, pode-se evitar as colunas com chaves
           primarias. Ex: createdat, id...
        */
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // .VIRTUAL não vai passar o banco de dados.
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        // Conexão com o banco
        sequelize,
      }
    );
    // Transforma a senha em um hash antes de enviar para o banco de dados
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  // Compara a senha que o usuário colocou no campo com a que está no banco de dados
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
