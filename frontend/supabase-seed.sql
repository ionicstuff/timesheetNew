-- Insert demo users
INSERT INTO users (email, full_name, role) VALUES 
  ('admin@example.com', 'Admin User', 'admin'),
  ('manager@example.com', 'Manager User', 'manager'),
  ('user@example.com', 'Regular User', 'user');

-- Insert a demo workspace
INSERT INTO workspaces (name, description, owner_id) 
SELECT 'Demo Workspace', 'A sample workspace for testing', id 
FROM users WHERE email = 'admin@example.com';

-- Insert demo folders
INSERT INTO folders (name, workspace_id) 
SELECT 'Project Folders', w.id 
FROM workspaces w 
JOIN users u ON w.owner_id = u.id 
WHERE u.email = 'admin@example.com';

-- Insert demo projects
INSERT INTO projects (name, description, folder_id, workspace_id) 
SELECT 'Sample Project', 'A sample project for testing', f.id, w.id
FROM folders f
JOIN workspaces w ON f.workspace_id = w.id
JOIN users u ON w.owner_id = u.id
WHERE u.email = 'admin@example.com';

-- Insert demo tasks
INSERT INTO tasks (title, description, project_id, status, priority) 
SELECT 'Create initial design', 'Create the initial UI design for the application', p.id, 'todo', 'high'
FROM projects p
JOIN folders f ON p.folder_id = f.id
JOIN workspaces w ON p.workspace_id = w.id
JOIN users u ON w.owner_id = u.id
WHERE u.email = 'admin@example.com';

INSERT INTO tasks (title, description, project_id, status, priority) 
SELECT 'Implement authentication', 'Set up user authentication system', p.id, 'in_progress', 'medium'
FROM projects p
JOIN folders f ON p.folder_id = f.id
JOIN workspaces w ON p.workspace_id = w.id
JOIN users u ON w.owner_id = u.id
WHERE u.email = 'admin@example.com';

INSERT INTO tasks (title, description, project_id, status, priority) 
SELECT 'Write documentation', 'Create user documentation', p.id, 'todo', 'low'
FROM projects p
JOIN folders f ON p.folder_id = f.id
JOIN workspaces w ON p.workspace_id = w.id
JOIN users u ON w.owner_id = u.id
WHERE u.email = 'admin@example.com';

-- Insert demo documents
INSERT INTO documents (name, content, project_id, created_by) 
SELECT 'Project Requirements', 'Initial project requirements document', p.id, u.id
FROM projects p
JOIN folders f ON p.folder_id = f.id
JOIN workspaces w ON p.workspace_id = w.id
JOIN users u ON w.owner_id = u.id
WHERE u.email = 'admin@example.com';

-- Insert task assignments
INSERT INTO user_tasks (user_id, task_id) 
SELECT u.id, t.id
FROM users u, tasks t
WHERE u.email = 'user@example.com' 
AND t.title = 'Create initial design';

INSERT INTO user_tasks (user_id, task_id) 
SELECT u.id, t.id
FROM users u, tasks t
WHERE u.email = 'manager@example.com' 
AND t.title = 'Implement authentication';