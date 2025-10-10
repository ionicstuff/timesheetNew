## Project Context

I am working on a full-stack timesheet application with the following architecture:

### Backend Details

*   **Framework:** Node.js with Express.js
*   **Database:** PostgreSQL
*   **ORM:** Sequelize
*   **Authentication:** JWT (jsonwebtoken)
*   **Entrypoint:** `backend/server.js`
*   **Key Libraries:** `pg` (PostgreSQL driver), `bcryptjs`, `cors`, `helmet`, `express-validator`, `nodemailer` (for emails), `multer` (for file uploads).
*   **Environment:** The backend runs as a service in Docker, defined in `backend/docker-compose.yml`. It connects to a separate PostgreSQL container.

### Frontend Details

*   **Framework:** React v18 with TypeScript
*   **Build Tool:** Vite
*   **UI:** Tailwind CSS with Shadcn UI components.
*   **Routing:** React Router (`react-router-dom`)
*   **Data Fetching/State:** TanStack Query (`@tanstack/react-query`)
*   **Forms:** React Hook Form (`react-hook-form`) with Zod for validation.

### Database Schema Overview

The database contains the following main models and relationships, managed by Sequelize. This is defined in `backend/models/index.js`.

*   **Core Models:** `User`, `Project`, `Client`, `Task`, `Timesheet`, `TimesheetEntry`.
*   **Roles & Permissions:** `RoleMaster`, `PermissionMaster`, `RolePermission`.
*   **Project Management:** `ProjectMember`, `ProjectMessage`, `TaskComment`, `TaskFile`, `TaskDependency`, `TaskActivity`.
*   **Finance:** `Invoice`, `InvoiceItem`, `InvoiceRevision`.
*   **Relationships:**
    *   A `User` has a `RoleMaster`.
    *   A `Project` belongs to a `Client` and has a `projectManager` (User).
    *   `ProjectMember` links `Users` to `Projects`.
    *   A `Task` belongs to a `Project` and can be assigned to a `User`.
    *   A `TimesheetEntry` links a `Project` and a `Task`.
