import jwt from 'jsonwebtoken';
// Metódo responsável por transformar outro método em assincrono
import { promisify } from 'util';
// Importação dos arquivos secretos do token (JTW)
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Pegar o token do usuario de dentro do header
  const authHeader = req.headers.authorization;

  // Verifica se o reader existe
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  // Separa o token da palabra Bearer
  const [, token] = authHeader.split(' ');

  // Dentro de um try/catch pq pode retornar erro
  try {
    // Verifica se o token é compativel com o do usuário que foi logado
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
