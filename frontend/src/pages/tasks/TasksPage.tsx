import { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Flame,
  CheckSquare,
  Pencil,
  Trash2,
  LayoutDashboard,
  Check,
  X
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { useAuthStore } from '../../stores/useAuthStore';
import { getStoredTasks, saveTasks } from '../../utils/storage';
import type { Task, TaskList, TaskPriority } from '../../types';

export default function TasksPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const [tasks, setTasks] = useState<Task[]>(() => getStoredTasks(userId));
  const [activeList, setActiveList] = useState<TaskList>('my-day');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium');

  // Persist whenever tasks change
  useEffect(() => {
    saveTasks(userId, tasks);
  }, [tasks, userId]);

  // Reload tasks when user changes
  useEffect(() => {
    setTasks(getStoredTasks(userId));
  }, [userId]);

  const listActiveClasses: Record<TaskList, string> = {
    'my-day': 'bg-blue-500 text-white',
    'important': 'bg-red-500 text-white',
    'planned': 'bg-emerald-500 text-white',
    'tasks': 'bg-primary text-white',
  };

  const lists: { id: TaskList; label: string; icon: typeof CheckSquare }[] = [
    { id: 'my-day', label: 'My Day', icon: LayoutDashboard },
    { id: 'important', label: 'Important', icon: Flame },
    { id: 'planned', label: 'Planned', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ];

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      userId,
      title: newTaskTitle.trim(),
      completed: false,
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
      priority: newTaskPriority,
      list: activeList,
      createdAt: new Date(),
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskPriority('medium');
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '');
    setEditPriority(task.priority ?? 'medium');
  };

  const saveEdit = (taskId: string) => {
    if (!editTitle.trim()) return;
    setTasks(tasks.map(t =>
      t.id === taskId
        ? {
            ...t,
            title: editTitle.trim(),
            dueDate: editDueDate ? new Date(editDueDate) : undefined,
            priority: editPriority,
          }
        : t
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const filteredTasks = tasks
    .filter(t => activeList === 'tasks' ? true : t.list === activeList)
    .filter(t => {
      if (filter === 'completed') return t.completed;
      if (filter === 'pending') return !t.completed;
      return true;
    });

  const isOverdue = (date?: Date) => {
    if (!date) return false;
    return isPast(new Date(date)) && !isToday(new Date(date));
  };

  const getPriorityColor = (priority?: TaskPriority) => {
    if (priority === 'high') return 'bg-red-100 text-red-600';
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-600';
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r border-gray-200 p-4 flex-shrink-0">
        <nav className="space-y-1">
          {lists.map((list) => {
            const Icon = list.icon;
            const isActive = activeList === list.id;
            const count = tasks.filter(t => t.list === list.id && !t.completed).length;

            return (
              <button
                key={list.id}
                onClick={() => setActiveList(list.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                  isActive ? listActiveClasses[list.id] : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 font-medium">{list.label}</span>
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">My Tasks</h1>
              <p className="text-sm text-gray-500">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Add Task */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Task</h3>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Task title..."
              className="input-field flex-1"
            />
            <button onClick={addTask} className="btn-primary">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Due Date (optional)</label>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                className="input-field"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
          {(['all', 'completed', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === f ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all ${
                task.completed ? 'bg-gray-50' : ''
              }`}
            >
              {editingId === task.id ? (
                /* Inline edit form */
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(task.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="input-field w-full"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="input-field flex-1 text-sm"
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                      className="input-field flex-1 text-sm"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="p-2 bg-primary text-white rounded-lg hover:bg-primary-600"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Normal task row */
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-primary border-primary'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                  </div>

                  {/* Priority badge */}
                  {task.priority && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  )}

                  {/* Due Date */}
                  {task.dueDate && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isOverdue(task.dueDate as Date)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isOverdue(task.dueDate as Date) ? 'Overdue: ' : ''}
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(task)}
                      className="p-1.5 hover:bg-gray-100 rounded"
                    >
                      <Pencil className="w-4 h-4 text-gray-400 hover:text-primary" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No tasks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
