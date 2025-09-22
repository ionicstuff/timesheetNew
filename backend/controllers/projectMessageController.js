const sequelize = require('../config/database');
const { Project, ProjectMember, ProjectMessage, User } = require('../models');

async function isMember(projectId, userId) {
  // A user is considered a member if they are in project_members OR they are the PM or creator of the project
  const [[row]] = await sequelize.query(`
    SELECT 1 as ok FROM projects p
    WHERE p.id = $1
      AND (
        p.created_by = $2 OR p.project_manager_id = $2 OR
        EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = p.id AND pm.user_id = $2)
      )
    LIMIT 1
  `, { bind: [projectId, userId] });
  return !!row;
}

const listMessages = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const userId = req.user?.id || req.user?.userId;
    if (!projectId || !userId) return res.status(401).json({ message: 'Unauthorized' });

    if (!(await isMember(projectId, userId))) return res.status(403).json({ message: 'Forbidden' });

    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);

    const rows = await ProjectMessage.findAll({
      where: { projectId },
      include: [{ model: User, as: 'author', attributes: ['id','firstName','lastName','email'] }],
      order: [['created_at','ASC']],
      limit,
    });

    const messages = rows.map(r => ({
      id: r.id,
      content: r.content,
      createdAt: r.created_at || r.createdAt,
      author: r.author ? { id: r.author.id, firstName: r.author.firstName, lastName: r.author.lastName, email: r.author.email } : null,
      attachments: [],
    }));
    return res.json(messages);
  } catch (e) {
    console.error('listMessages error', e);
    return res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

const createMessage = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const userId = req.user?.id || req.user?.userId;
    if (!projectId || !userId) return res.status(401).json({ message: 'Unauthorized' });

    if (!(await isMember(projectId, userId))) return res.status(403).json({ message: 'Forbidden' });

    const content = (req.body?.content || '').trim();
    if (!content) return res.status(400).json({ message: 'content is required' });

    const row = await ProjectMessage.create({ projectId, userId, content });
    const author = await User.findByPk(userId, { attributes: ['id','firstName','lastName','email'] });

    return res.status(201).json({
      id: row.id,
      content: row.content,
      createdAt: row.created_at || row.createdAt,
      author: author ? { id: author.id, firstName: author.firstName, lastName: author.lastName, email: author.email } : null,
      attachments: [],
    });
  } catch (e) {
    console.error('createMessage error', e);
    return res.status(500).json({ message: 'Failed to create message' });
  }
};

module.exports = { listMessages, createMessage };