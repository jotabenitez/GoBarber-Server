import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      provider: Yup.boolean().default(false), // adicionado por mim p criar provedor
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const user = await User.create(req.body);

    const { id, name, email, avatar, provider } = user;

    return res.json({
      id,
      name,
      email,
      provider,
      avatar,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.mail) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPasword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    await user.update(req.body);

    const { id, name, avatar, provider } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['avatar', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      provider,
      avatar,
    });
  }

  // rotas adicionadas por mim
  async show(req, res) {
    const user = await User.findByPk(req.userId);

    res.json(user);
  }

  async delete(req, res) {
    const user = await User.findByPk(req.userId);

    if (user) {
      await user.destroy();
    }

    res.json({ ok: true });
  }

  async index(req, res) {
    const users = await User.findAll({
      where: { provider: false },
      attributes: ['id', 'name', 'email'],
    });

    return res.json({ users });
  }
}

export default new UserController();
