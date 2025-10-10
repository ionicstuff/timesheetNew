const User = require("./User");
const Timesheet = require("./Timesheet");
const RoleMaster = require("./RoleMaster");
const ModuleMaster = require("./ModuleMaster");
const PermissionMaster = require("./PermissionMaster");
const RolePermission = require("./RolePermission");
const UserHierarchy = require("./UserHierarchy");
const Client = require("./Client");
const Project = require("./Project");
const Spoc = require("./Spoc");
const Task = require("./Task");
const Notification = require("./Notification");
const Invoice = require("./Invoice");
const InvoiceItem = require("./InvoiceItem");
const InvoiceRevision = require("./InvoiceRevision");
const ProjectMember = require("./ProjectMember");
const ProjectMessage = require("./ProjectMessage");
const TaskComment = require("./TaskComment");
const TaskFile = require("./TaskFile");
const TaskDependency = require("./TaskDependency");
const TaskActivity = require("./TaskActivity");
const TaskCommentLike = require("./TaskCommentLike");

const TimesheetEntry = require("./TimesheetEntry");
Timesheet.hasMany(TimesheetEntry, { foreignKey: "timesheetId", as: "entries" });
TimesheetEntry.belongsTo(Timesheet, {
  foreignKey: "timesheetId",
  as: "timesheet",
});
TimesheetEntry.belongsTo(Project, { foreignKey: "projectId", as: "project" });
TimesheetEntry.belongsTo(Task, { foreignKey: "taskId", as: "task" });

// User and RoleMaster associations
User.belongsTo(RoleMaster, {
  foreignKey: "roleId",
  as: "roleMaster",
});

RoleMaster.hasMany(User, {
  foreignKey: "roleId",
  as: "users",
});

// ModuleMaster and PermissionMaster associations
PermissionMaster.belongsTo(ModuleMaster, {
  foreignKey: "moduleId",
  as: "module",
});

ModuleMaster.hasMany(PermissionMaster, {
  foreignKey: "moduleId",
  as: "permissions",
});

// RoleMaster and PermissionMaster many-to-many through RolePermission
RoleMaster.belongsToMany(PermissionMaster, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

PermissionMaster.belongsToMany(RoleMaster, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

// RolePermission associations
RolePermission.belongsTo(RoleMaster, {
  foreignKey: "roleId",
  as: "role",
});

RolePermission.belongsTo(PermissionMaster, {
  foreignKey: "permissionId",
  as: "permission",
});

RolePermission.belongsTo(User, {
  foreignKey: "grantedBy",
  as: "grantedByUser",
});

// UserHierarchy associations
UserHierarchy.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

UserHierarchy.belongsTo(User, {
  foreignKey: "parentUserId",
  as: "parentUser",
});

UserHierarchy.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

User.hasMany(UserHierarchy, {
  foreignKey: "userId",
  as: "hierarchyAsUser",
});

User.hasMany(UserHierarchy, {
  foreignKey: "parentUserId",
  as: "hierarchyAsParent",
});

// Client associations
Client.belongsTo(User, {
  foreignKey: "accountManagerId",
  as: "accountManager",
});

Client.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

User.hasMany(Client, {
  foreignKey: "accountManagerId",
  as: "managedClients",
});

// Project associations
Project.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

Project.belongsTo(User, {
  foreignKey: "projectManagerId",
  as: "projectManager",
});

Project.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

Client.hasMany(Project, {
  foreignKey: "clientId",
  as: "projects",
});

User.hasMany(Project, {
  foreignKey: "projectManagerId",
  as: "managedProjects",
});

// Project SPOC association
Project.belongsTo(Spoc, {
  foreignKey: "spocId",
  as: "spoc",
});

// Invoice associations
Project.hasOne(Invoice, { foreignKey: "projectId", as: "invoice" });
Invoice.belongsTo(Project, { foreignKey: "projectId", as: "project" });
Invoice.hasMany(InvoiceItem, { foreignKey: "invoiceId", as: "items" });
InvoiceItem.belongsTo(Invoice, { foreignKey: "invoiceId", as: "invoice" });
Invoice.hasMany(InvoiceRevision, { foreignKey: "invoiceId", as: "revisions" });
InvoiceRevision.belongsTo(Invoice, { foreignKey: "invoiceId", as: "invoice" });

// SPOC associations
Spoc.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

Spoc.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project",
});

Spoc.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

Client.hasMany(Spoc, {
  foreignKey: "clientId",
  as: "spocs",
});

Project.hasMany(Spoc, {
  foreignKey: "projectId",
  as: "spocs",
});

User.hasMany(Spoc, {
  foreignKey: "createdBy",
  as: "createdSpocs",
});

// Task associations
Task.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project",
});

Task.belongsTo(User, {
  foreignKey: "assignedTo",
  as: "assignee",
});

Project.hasMany(Task, {
  foreignKey: "projectId",
  as: "tasks",
});

// Task comments/files/dependencies/activities
Task.hasMany(TaskComment, { foreignKey: "taskId", as: "comments" });
TaskComment.belongsTo(Task, { foreignKey: "taskId", as: "task" });
TaskComment.belongsTo(User, { foreignKey: "userId", as: "author" });
TaskComment.hasMany(TaskCommentLike, { foreignKey: "commentId", as: "likes" });
TaskCommentLike.belongsTo(TaskComment, {
  foreignKey: "commentId",
  as: "comment",
});
TaskCommentLike.belongsTo(User, { foreignKey: "userId", as: "user" });

Task.hasMany(TaskFile, { foreignKey: "taskId", as: "files" });
TaskFile.belongsTo(Task, { foreignKey: "taskId", as: "task" });
TaskFile.belongsTo(User, { foreignKey: "uploadedBy", as: "uploader" });

Task.hasMany(TaskDependency, { foreignKey: "taskId", as: "dependencies" });
TaskDependency.belongsTo(Task, { foreignKey: "taskId", as: "task" });
TaskDependency.belongsTo(Task, {
  foreignKey: "dependsOnTaskId",
  as: "dependsOn",
});

Task.hasMany(TaskActivity, { foreignKey: "taskId", as: "activities" });
TaskActivity.belongsTo(Task, { foreignKey: "taskId", as: "task" });
TaskActivity.belongsTo(User, { foreignKey: "actorId", as: "actor" });

// Project members associations
ProjectMember.belongsTo(Project, { foreignKey: "projectId", as: "project" });
ProjectMember.belongsTo(User, { foreignKey: "userId", as: "user" });
Project.hasMany(ProjectMember, { foreignKey: "projectId", as: "members" });
User.hasMany(ProjectMember, { foreignKey: "userId", as: "projectMemberships" });

// Project messages associations
ProjectMessage.belongsTo(Project, { foreignKey: "projectId", as: "project" });
ProjectMessage.belongsTo(User, { foreignKey: "userId", as: "author" });
Project.hasMany(ProjectMessage, { foreignKey: "projectId", as: "messages" });
User.hasMany(ProjectMessage, { foreignKey: "userId", as: "projectMessages" });

User.hasMany(Task, {
  foreignKey: "assignedTo",
  as: "assignedTasks",
});

// Task creator association
Task.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
User.hasMany(Task, { foreignKey: "createdBy", as: "createdTasks" });

// Notification associations
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });

// Existing User and Timesheet associations
User.hasMany(Timesheet, {
  foreignKey: "userId",
  as: "timesheets",
});

Timesheet.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = {
  User,
  Timesheet,
  RoleMaster,
  ModuleMaster,
  PermissionMaster,
  RolePermission,
  UserHierarchy,
  Client,
  Project,
  Spoc,
  Task,
  ProjectMember,
  ProjectMessage,
  TimesheetEntry,
  Invoice,
  InvoiceItem,
  InvoiceRevision,
  Notification,
  TaskComment,
  TaskFile,
  TaskDependency,
  TaskActivity,
  TaskCommentLike,
};
