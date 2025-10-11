import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchProvider } from './contexts/SearchContext';
import { TimesheetProvider } from './contexts/TimesheetContext';
import { TimerProvider } from './contexts/TimerContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Calendar from './pages/Calendar';
import Documents from './pages/Documents';
import Team from './pages/Team';
import Settings from './pages/Settings';
import SearchResults from './pages/SearchResults';
import TaskDetail from './pages/TaskDetail';
import ProjectDetail from './pages/ProjectDetail';
import DocumentDetail from './pages/DocumentDetail';
import TeamMemberDetail from './pages/TeamMemberDetail';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Billings from './pages/Billings';
import BillingDetail from './pages/BillingDetail';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import MainLayout from './components/layout/MainLayout';
import AdminLogin from '../admin/components/AdminLogin';
import AdminDashboard from '../admin/components/AdminDashboard';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SearchProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <TimesheetProvider>
          <TimerProvider>
            <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route
                path="/"
                element={
                  <MainLayout>
                    <Index />
                  </MainLayout>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                }
              />
              <Route
                path="/tasks"
                element={
                  <MainLayout>
                    <Tasks />
                  </MainLayout>
                }
              />
              <Route
                path="/tasks/:id"
                element={
                  <MainLayout>
                    <TaskDetail />
                  </MainLayout>
                }
              />
              <Route
                path="/projects"
                element={
                  <MainLayout>
                    <Projects />
                  </MainLayout>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <MainLayout>
                    <ProjectDetail />
                  </MainLayout>
                }
              />
              <Route
                path="/clients"
                element={
                  <MainLayout>
                    <Clients />
                  </MainLayout>
                }
              />
              <Route
                path="/clients/:id"
                element={
                  <MainLayout>
                    <ClientDetail />
                  </MainLayout>
                }
              />
              <Route
                path="/calendar"
                element={
                  <MainLayout>
                    <Calendar />
                  </MainLayout>
                }
              />
              <Route
                path="/documents"
                element={
                  <MainLayout>
                    <Documents />
                  </MainLayout>
                }
              />
              <Route
                path="/documents/:id"
                element={
                  <MainLayout>
                    <DocumentDetail />
                  </MainLayout>
                }
              />
              <Route
                path="/team"
                element={
                  <MainLayout>
                    <Team />
                  </MainLayout>
                }
              />
              <Route
                path="/team/:id"
                element={
                  <MainLayout>
                    <TeamMemberDetail />
                  </MainLayout>
                }
              />
              <Route
                path="/settings"
                element={
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                }
              />
              <Route
                path="/notifications"
                element={
                  <MainLayout>
                    <Notifications />
                  </MainLayout>
                }
              />
              <Route
                path="/reports"
                element={
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                }
              />
              <Route
                path="/search"
                element={
                  <MainLayout>
                    <SearchResults />
                  </MainLayout>
                }
              />
              <Route
                path="/billings"
                element={
                  <MainLayout>
                    <Billings />
                  </MainLayout>
                }
              />
              <Route
                path="/billings/:id"
                element={
                  <MainLayout>
                    <BillingDetail />
                  </MainLayout>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
          </TimerProvider>
        </TimesheetProvider>
      </TooltipProvider>
    </SearchProvider>
  </QueryClientProvider>
);

export default App;
