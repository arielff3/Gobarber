import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  // Init é um métoodo que o sequuelize chama automaticamente
  static init(sequelize) {
    super.init(
      {
        /* Enviar colunas que estão na tabela, pode-se evitar as colunas com chaves
           primarias. Ex: createdat, id...
        */
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        // Conexão com o banco
        sequelize,
      }
    );

    return this;
  }

  static associte(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
