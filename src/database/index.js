import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';
// Array de models
const models = [User, File, Appointment];
// Carrega todos o Models
class Database {
  constructor() {
    this.init();
  }

  init() {
    // Conexão que vai dentro do model
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
