import { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { format } from 'date-fns';
import { Search, Plus } from 'lucide-react';

export function Header() {
  const { search, setSearch, addProject, projects } = useProjectStore();
  const [newName, setNewName] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const nowCount = projects.filter((p) => p.priority === 'Now').length;
  const heading =
    nowCount > 0
      ? `${projects.find((p) => p.priority === 'Now')?.name} is claimed for today`
      : 'Nothing is claimed for today';

  const handleAdd = () => {
    if (!newName.trim()) return;
    addProject({ name: newName.trim() });
    setNewName('');
    setShowAdd(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wider text-text-dim uppercase">
            {format(new Date(), 'EEEE, MMMM d').toUpperCase()}
          </p>
          <h1 className="text-2xl font-semibold text-text mt-1 tracking-tight">{heading}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              placeholder="Search projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 pl-9 pr-3 py-2 rounded-lg bg-surface border border-border text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/30"
            />
          </div>

          {showAdd ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                placeholder="New project name…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                  if (e.key === 'Escape') setShowAdd(false);
                }}
                className="w-48 px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-purple/50"
              />
              <button
                onClick={handleAdd}
                className="px-3 py-2 rounded-lg bg-purple hover:bg-purple-light text-white text-sm font-medium transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-2 py-2 text-text-dim hover:text-text text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple hover:bg-purple-light text-white text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
