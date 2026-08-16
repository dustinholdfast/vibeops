import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/useProjectStore';
import { formatLastTouched, formatFullDate, cn } from '../lib/utils';
import type { Stage, Priority } from '../types';
import {
  X,
  ExternalLink,
  Github,
  Pencil,
  Check,
  Trash2,
} from 'lucide-react';

const stages: Stage[] = ['Exploring', 'Building', 'Testing', 'Live', 'Paused', 'Archived'];
const priorities: Priority[] = ['Now', 'Next', 'Later'];

const stageDot: Record<Stage, string> = {
  Exploring: 'bg-blue',
  Building: 'bg-purple',
  Testing: 'bg-orange',
  Live: 'bg-success',
  Paused: 'bg-text-dim',
  Archived: 'bg-text-dim',
};

export function ProjectDrawer() {
  const {
    projects,
    selectedId,
    isDrawerOpen,
    closeDrawer,
    setPriority,
    setStage,
    setNextAction,
    deleteProject,
  } = useProjectStore();

  const project = projects.find((p) => p.id === selectedId);

  const [editingAction, setEditingAction] = useState(false);
  const [actionDraft, setActionDraft] = useState('');

  useEffect(() => {
    if (project) {
      setActionDraft(project.nextAction);
      setEditingAction(false);
    }
  }, [project?.id]);

  if (!project) return null;

  const saveAction = () => {
    if (actionDraft.trim() && actionDraft !== project.nextAction) {
      setNextAction(project.id, actionDraft.trim());
    }
    setEditingAction(false);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-border-subtle">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-text truncate">{project.name}</h2>
                <div className="mt-1.5 h-1 w-24 rounded-full bg-border-subtle overflow-hidden">
                  <div
                    className="h-full bg-purple rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-text-dim hover:text-text hover:bg-surface-elevated transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              {/* Stage */}
              <div>
                <label className="text-xs font-medium text-text-dim uppercase tracking-wider">
                  Stage
                </label>
                <div className="mt-2 relative">
                  <select
                    value={project.stage}
                    onChange={(e) => setStage(project.id, e.target.value as Stage)}
                    className="w-full appearance-none bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-purple/50"
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span
                    className={cn(
                      'absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none',
                      stageDot[project.stage]
                    )}
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs font-medium text-text-dim uppercase tracking-wider">
                  Priority
                </label>
                <div className="mt-2 flex rounded-lg overflow-hidden border border-border">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(project.id, p)}
                      className={cn(
                        'flex-1 py-2 text-sm font-medium transition-colors',
                        project.priority === p
                          ? 'bg-purple text-white'
                          : 'bg-surface-elevated text-text-muted hover:text-text'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next action */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-text-dim uppercase tracking-wider">
                    Next action
                  </label>
                  {!editingAction && (
                    <button
                      onClick={() => setEditingAction(true)}
                      className="p-1 text-text-dim hover:text-purple-light"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>

                {editingAction ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      autoFocus
                      value={actionDraft}
                      onChange={(e) => setActionDraft(e.target.value)}
                      rows={3}
                      className="w-full bg-surface-elevated border border-purple/50 rounded-lg px-3 py-2 text-sm text-text focus:outline-none resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveAction}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple text-white text-sm font-medium"
                      >
                        <Check size={14} /> Save
                      </button>
                      <button
                        onClick={() => {
                          setActionDraft(project.nextAction);
                          setEditingAction(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-text bg-surface-elevated border border-border rounded-lg px-3 py-2.5">
                    {project.nextAction || (
                      <span className="text-text-dim italic">No next action defined</span>
                    )}
                  </p>
                )}

                <p className="mt-2 text-xs text-text-dim">
                  Last touched {formatLastTouched(project.lastTouched)} · Created{' '}
                  {formatFullDate(project.createdAt)}
                </p>
              </div>

              {/* Progress */}
              <div>
                <label className="text-xs font-medium text-text-dim uppercase tracking-wider">
                  Progress
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-border-subtle overflow-hidden">
                    <div
                      className="h-full bg-purple rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm tabular-nums text-text-muted">{project.progress}%</span>
                </div>
              </div>

              {/* Links */}
              <div>
                <label className="text-xs font-medium text-text-dim uppercase tracking-wider">
                  Links
                </label>
                <div className="mt-2 space-y-2">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-text-muted hover:text-purple-light"
                    >
                      <ExternalLink size={14} /> Live URL
                    </a>
                  ) : (
                    <span className="text-sm text-text-dim">No live URL</span>
                  )}
                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-text-muted hover:text-purple-light"
                    >
                      <Github size={14} /> GitHub repo
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Activity */}
              <div>
                <label className="text-xs font-medium text-text-dim uppercase tracking-wider">
                  Activity
                </label>
                <div className="mt-3 space-y-3">
                  {project.activity.length === 0 ? (
                    <p className="text-sm text-text-dim">No activity yet.</p>
                  ) : (
                    project.activity.slice(0, 8).map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-text">{item.message}</p>
                          <p className="text-xs text-text-dim mt-0.5">
                            {item.author && `${item.author} · `}
                            {formatLastTouched(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-border-subtle flex items-center justify-between">
              <button
                onClick={() => {
                  if (confirm(`Delete “${project.name}”?`)) {
                    deleteProject(project.id);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-sm text-danger hover:text-danger/80"
              >
                <Trash2 size={14} /> Delete
              </button>
              <button
                onClick={closeDrawer}
                className="px-4 py-2 rounded-lg bg-surface-elevated border border-border text-sm text-text hover:bg-border transition-colors"
              >
                Close
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
