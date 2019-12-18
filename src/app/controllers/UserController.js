import * as Yup from 'yup';
import User from '../models/User';
// Campos que vão no YUP, name: email: password:
class UserController {
  async store(req, res) {
    // Validação de entrata
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required(),
    });
    // Chegar se os campos são validos com o isValid
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados invalidos' });
    }
    // checa se o email já existe
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ Error: 'Usuário já existente' });
    }
    // Cria um item na tabela do banco de dados
    const { id, name, email, provider } = await User.create(req.body);
    // Retornar um json com os dados do user
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    // Validação de entrata
    // O nome/email não precisa ser obrigatório
    // Caso o usuário esteja informando a senha antiga dele a senha atual é obrigatória
    // O  método when da acesso a qualquer outro campo do yup
    // field = password
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    // Chegar se os campos são validos com o isValid
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados invalidos' });
    }

    // Pega o email e a senha atual
    const { email, oldPassword } = req.body;
    // Busca o usuário que está logado pelo id usando o id que é recuperado do token
    const user = await User.findByPk(req.userId);
    // Email já existente
    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res.status(400).json({ Error: 'Usuário já existente' });
      }
    }
    // Compara se a senha atual é igual a senha nova
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    // Atualiza o usuário
    const { id, name, provider } = await user.update(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
