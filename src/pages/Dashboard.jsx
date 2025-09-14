import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Clock,
  Activity,
  Zap,
  Code,
  Briefcase,
  Globe,
  Database,
  Brain,
  Workflow,
  Calendar,
  MessageSquare,
  Cpu,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthActions, useAuthUser } from '../store/authStore';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Auth hooks
  const { logout } = useAuthActions();
  const user = useAuthUser();

  // Handle logout
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Redirect will be handled by auth store and protected route
    }
  };

  // AI Assistant capabilities
  const assistantCapabilities = [
    { id: 'dashboard', label: 'AI Dashboard', icon: Bot },
    { id: 'automation', label: 'Daily Automation', icon: Workflow },
    { id: 'schedule', label: 'Smart Schedule', icon: Calendar },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'tools', label: 'Dev Tools', icon: Code },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // AI Assistant stats
  const aiStats = [
    {
      title: 'Tasks Automated',
      value: '127',
      change: 'This week',
      icon: Brain,
      gradient: 'linear-gradient(135deg, var(--ai-primary), var(--ai-secondary))'
    },
    {
      title: 'Time Saved',
      value: '8.3h',
      change: 'Today',
      icon: Clock,
      gradient: 'linear-gradient(135deg, var(--ai-accent), var(--ai-primary))'
    },
    {
      title: 'AI Responses',
      value: '34',
      change: 'Active today',
      icon: Cpu,
      gradient: 'linear-gradient(135deg, var(--ai-secondary), var(--gradient-end))'
    },
    {
      title: 'System Health',
      value: 'Optimal',
      change: 'All systems go',
      icon: Activity,
      gradient: 'linear-gradient(135deg, var(--ai-accent), var(--ai-warning))'
    }
  ];

  // AI Assistant activities
  const aiActivities = [
    {
      id: 1,
      type: 'automation',
      title: 'Morning Routine Automated',
      description: 'Scheduled daily tasks, checked emails, prepared dev environment',
      time: '8:30 AM',
      icon: Sparkles,
      color: 'var(--ai-primary)'
    },
    {
      id: 2,
      type: 'analysis',
      title: 'Code Analysis Complete',
      description: 'Reviewed 12 files, suggested optimizations, fixed 3 issues',
      time: '2 hours ago',
      icon: Brain,
      color: 'var(--ai-secondary)'
    },
    {
      id: 3,
      type: 'workflow',
      title: 'Task Pipeline Updated',
      description: 'Optimized workflow, automated deployment process',
      time: '4 hours ago',
      icon: Workflow,
      color: 'var(--ai-accent)'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-16" : "w-64",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )} style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-primary)' }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {!sidebarCollapsed && (
                <h1 className="text-lg font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>Helper</h1>
              )}
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-1.5 rounded-md transition-colors cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-card)';
                  e.target.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--text-muted)';
                }}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-md transition-colors cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-card)';
                  e.target.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--text-muted)';
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Info */}

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-2">
            {assistantCapabilities.map((capability) => {
              const Icon = capability.icon;
              const isActive = activeSection === capability.id;

              return (
                <button
                  key={capability.id}
                  onClick={() => setActiveSection(capability.id)}
                  className={cn(
                    "w-full flex items-center rounded-lg text-left transition-all duration-300 ease-in-out overflow-hidden cursor-pointer",
                    sidebarCollapsed ? "px-3 py-3 justify-center" : "px-3 py-2.5 space-x-3"
                  )}
                  style={{
                    backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-muted)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'var(--bg-card)';
                      e.target.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={cn(
                    "text-sm font-medium transition-all duration-300 ease-in-out whitespace-nowrap",
                    sidebarCollapsed ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto ml-3"
                  )}>
                    {capability.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3" style={{ borderTop: '1px solid var(--border-primary)' }}>
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center rounded-lg transition-all duration-300 ease-in-out overflow-hidden cursor-pointer",
                sidebarCollapsed ? "px-3 py-3 justify-center" : "px-3 py-2.5 space-x-3"
              )}
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--accent-error)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-muted)';
              }}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={cn(
                "text-sm font-medium transition-all duration-300 ease-in-out whitespace-nowrap",
                sidebarCollapsed ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto ml-3"
              )}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        {/* Mobile menu button */}
        <div className="lg:hidden p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md transition-colors cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--bg-card)';
              e.target.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'var(--text-muted)';
            }}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <main className="p-6 lg:p-8">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Message */}
              <div
                className="rounded-xl p-6 mb-6"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
              >
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  AI Dashboard
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Your personal AI assistant for daily automation and productivity.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {aiStats.map((stat, index) => {
                  const Icon = stat.icon;
                  const colors = [
                    'var(--accent-primary)',
                    'var(--accent-success)',
                    '#8B5CF6',
                    'var(--accent-warning)'
                  ];
                  return (
                    <div
                      key={stat.title}
                      className="rounded-xl p-6"
                      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: colors[index] + '20' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: colors[index] }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                          {stat.value}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.title}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--accent-success)' }}>{stat.change}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Activities */}
              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>AI Assistant Activity</h3>
                <div className="space-y-4">
                  {aiActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 rounded-lg"
                        style={{ backgroundColor: 'var(--bg-card-alt)', border: '1px solid var(--border-primary)' }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: activity.color + '20' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: activity.color }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>{activity.title}</h4>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{activity.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Clock className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {activeSection !== 'dashboard' && (
            <div
              className="rounded-xl p-8 text-center"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
            >
              <h3 className="text-xl font-semibold mb-2 capitalize" style={{ color: 'var(--text-primary)' }}>
                {activeSection}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                This feature is coming soon!
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;