import React, { useEffect, useState } from 'react';
import { tasks as tasksApi } from '../api/client';
import { useTaskStore } from '../store';
import {
  Plus,
  Search,
  CheckCircle,
  Trash2,
  Edit,
  GripVertical,
  Clock,
  Brain,
  Award,
} from 'lucide-react';

// Point calculation (matches backend logic)
const calculateTaskPoints = (task) => {
  const basePoints = Math.floor(task.estimated_duration / 10);
  const priorityMultipliers = { low: 1.0, medium: 1.5, high: 2.0, urgent: 3.0 };
  const priorityMultiplier = priorityMultipliers[task.priority] || 1.0;
  const deepWorkBonus = task.is_deep_work ? 5 : 0;
  const cognitiveBonus = task.cognitive_load >= 8 ? 3 : 0;
  const total = Math.floor(basePoints * priorityMultiplier) + deepWorkBonus + cognitiveBonus;
  return Math.max(1, total);
};
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableTask({ task, onComplete, onDelete, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        opacity: task.completed ? 0.5 : 1,
        marginBottom: '10px'
      }}
      className="card"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr auto', gap: '12px', alignItems: 'center' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'move', padding: '4px' }}>
          <GripVertical style={{ color: '#666' }} size={20} />
        </div>

        <button
          onClick={() => onComplete(task.id)}
          title={task.completed ? "Click to mark as incomplete" : "Click to mark as complete"}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: task.completed ? '2px solid #10b981' : '2px solid #666',
            background: task.completed ? '#10b981' : 'none',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {task.completed && <CheckCircle size={16} style={{ color: '#fff' }} />}
        </button>

        <div style={{ minWidth: 0 }}>
          <h3 style={{ 
            fontWeight: 700, 
            marginBottom: '8px', 
            fontSize: '15px',
            letterSpacing: '-0.2px',
            textDecoration: task.completed ? 'line-through' : 'none'
          }}>
            {task.title}
          </h3>
          {task.description && (
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '8px', fontWeight: 500 }}>
              {task.description}
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span
              className={`badge badge-${
                task.priority === 'urgent'
                  ? 'danger'
                  : task.priority === 'high'
                  ? 'warning'
                  : 'primary'
              }`}
              style={{ fontWeight: 700, fontSize: '11px' }}
            >
              {task.priority}
            </span>
            <span className="badge badge-secondary" style={{ fontWeight: 600, fontSize: '11px' }}>
              {task.category}
            </span>
            {task.is_deep_work && (
              <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '11px' }}>
                <Brain size={12} />
                Deep Work
              </span>
            )}
            <span style={{ fontSize: '12px', color: '#999', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <Clock size={12} />
              {task.estimated_duration}min
            </span>
            <span style={{ fontSize: '12px', color: '#999', fontWeight: 600 }}>
              Load: {task.cognitive_load}/10
            </span>
            {!task.completed && (
              <span style={{ 
                fontSize: '12px', 
                color: '#fbbf24', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                fontWeight: 700 
              }}>
                <Award size={12} />
                +{calculateTaskPoints(task)} pts
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => onEdit(task)}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#222'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <Edit size={18} style={{ color: '#60a5fa' }} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#222'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <Trash2 size={18} style={{ color: '#f87171' }} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState(
    task || {
      title: '',
      description: '',
      category: 'study',
      priority: 'medium',
      estimated_duration: 30,
      cognitive_load: 5,
      is_deep_work: false,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 50,
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 800, 
          marginBottom: '20px',
          letterSpacing: '-0.5px'
        }}>
          {task ? '✏️ Edit Task' : '➕ Create Task'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Title
            </label>
            <input
              type="text"
              className="input"
              style={{ fontWeight: 500 }}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Description
            </label>
            <textarea
              className="input"
              rows="3"
              style={{ fontWeight: 500, resize: 'vertical' }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: 700, 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Category
              </label>
              <select
                className="input"
                style={{ fontWeight: 500 }}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="study">📚 Study</option>
                <option value="coding">💻 Coding</option>
                <option value="fitness">💪 Fitness</option>
                <option value="reading">📖 Reading</option>
                <option value="writing">✍️ Writing</option>
                <option value="organizing">🗂️ Organizing</option>
                <option value="creativity">🎨 Creativity</option>
                <option value="social">👥 Social</option>
                <option value="other">📌 Other</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: 700, 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Priority
              </label>
              <select
                className="input"
                style={{ fontWeight: 500 }}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: 700, 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Duration (minutes)
              </label>
              <input
                type="number"
                className="input"
                style={{ fontWeight: 500 }}
                value={formData.estimated_duration}
                onChange={(e) =>
                  setFormData({ ...formData, estimated_duration: parseInt(e.target.value) })
                }
                min="5"
                step="5"
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: 700, 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Cognitive Load (1-10)
              </label>
              <input
                type="number"
                className="input"
                style={{ fontWeight: 500 }}
                value={formData.cognitive_load}
                onChange={(e) =>
                  setFormData({ ...formData, cognitive_load: parseInt(e.target.value) })
                }
                min="1"
                max="10"
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              id="deep-work"
              checked={formData.is_deep_work}
              onChange={(e) => setFormData({ ...formData, is_deep_work: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="deep-work" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              🧠 This is deep work (requires high focus)
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px' }}>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 800, fontSize: '14px' }}>
              {task ? 'Update' : 'Create'} Task
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontWeight: 700, fontSize: '14px' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Tasks() {
  const { tasks, setTasks } = useTaskStore();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filter, searchTerm]);

  const loadTasks = async () => {
    try {
      const response = await tasksApi.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (filter !== 'all') {
      filtered = filtered.filter((task) =>
        filter === 'completed' ? task.completed : !task.completed
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => a.order - b.order);
    setFilteredTasks(filtered);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await tasksApi.update(editingTask.id, taskData);
      } else {
        await tasksApi.create(taskData);
      }
      loadTasks();
      setShowModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    try {
      await tasksApi.update(taskId, { completed: !task.completed });
      loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksApi.delete(taskId);
        loadTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
      const newIndex = filteredTasks.findIndex((task) => task.id === over.id);

      const newTasks = arrayMove(filteredTasks, oldIndex, newIndex);
      setFilteredTasks(newTasks);

      const reorderData = newTasks.map((task, index) => ({ id: task.id, order: index }));
      try {
        await tasksApi.reorder(reorderData);
      } catch (error) {
        console.error('Failed to reorder tasks:', error);
      }
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '80px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto', 
        alignItems: 'center', 
        marginBottom: '32px',
        marginTop: '8px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 900, 
            marginBottom: '8px',
            letterSpacing: '-0.5px',
            lineHeight: '1.2'
          }}>
            Tasks ✅
          </h1>
          <p style={{ color: '#999', fontSize: '15px', fontWeight: 500 }}>
            Manage your productivity
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
          className="btn btn-primary"
          style={{ fontWeight: 800, fontSize: '14px' }}
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={20} />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: '44px', fontWeight: 500 }}
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('all')}
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontWeight: 700, fontSize: '13px' }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontWeight: 700, fontSize: '13px' }}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontWeight: 700, fontSize: '13px' }}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📝</div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>
            No tasks found
          </h3>
          <p style={{ color: '#999', marginBottom: '20px', fontWeight: 500 }}>
            {searchTerm ? 'Try a different search term' : 'Create your first task to get started!'}
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ fontWeight: 800 }}>
            <Plus size={20} />
            Create Task
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {filteredTasks.map((task) => (
              <SortableTask
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                onEdit={(task) => {
                  setEditingTask(task);
                  setShowModal(true);
                }}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}

export default Tasks;
