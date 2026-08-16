import { useProjectStore } from '../store/useProjectStore';
import { formatLastTouched, cn } from '../lib/utils';
import type { Priority, Stage } from '../types';
import { Check, ExternalLink } from 'lucide-react';

const stageColor: Record<Stage, string> = {
  Exploring: 'bg-blue',
  Building: 'bg-purple',
  Testing: 'bg-orange',
  Live: 'bg-success',
  Paused: 'bg-text-dim',
  Archived: 'bg-text-dim',
};

export function ProjectList() {
  const { projects, filter, search, openDrawer, setPriority } = useProjectStore();

  const filtered = projects
    .filter((p) => (filter === 'All' ? true : p.stage === filter))
    .filter((p) =>
      search
        ? p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.nextAction.toLowerCase().includes(search.toLowerCase())
        : true
    );

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-text">
          All projects
          <span className="ml-2 text-text-dim font-normal">{filtered.length} projects</span>
        </h2>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_120px_140px_120px_80px] gap-4 px-4 py-2.5 text-[11px] font-medium tracking-wider text-text-dim uppercase border-b border-border-subtle">
          <div>Project & Next Action</div>
          <div>Stage</div>
          <div>Priority</div>
          <div>Last Touched</div>
          <div>Links</div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-text-dim">
            No projects match the current filter.
          </div>
        ) : (
          filtered.map((project) => (
            <div
              key={project.id}
              onClick={() => openDrawer(project.id)}
              className="grid grid-cols-[1fr_120px_140px_120px_80px] gap-4 px-4 py-3.5 border-b border-border-subtle last:border-0 hover:bg-surface-elevated/60 cursor-pointer transition-colors group"
            >
              {/* Name + next action */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text truncate">{project.name}</span>
                  <div className="h-1 w-12 rounded-full bg-border-subtle overflow-hidden">
                    <div
                      className="h-full bg-purple rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-text-muted truncate mt-0.5">{project.nextAction}</p>
              </div>

              {/* Stage */}
              <div className="flex items-center">
                <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
                  <span className={cn('w-1.5 h-1.5 rounded-full', stageColor[project.stage])} />
                  {project.stage}
                </span>
              </div>

              {/* Priority pills */}
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {(['Now', 'Next', 'Later'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(project.id, p)}
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                      project.priority === p
                        ? 'bg-purple text-white'
                        : 'bg-surface-elevated text-text-dim hover:text-text hover:bg-border'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Last touched */}
              <div className="flex items-center gap-1.5 text-sm text-text-muted">
                <span>{formatLastTouched(project.lastTouched)}</span>
                <Check size={14} className="text-success" />
              </div>

              {/* Links */}
              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-purple-light"
                  >
                    Live <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-xs text-text-dim">—</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
