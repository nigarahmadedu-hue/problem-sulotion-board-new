'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';

interface SidebarRolesWidgetProps {
  roles?: string[];
  problemId?: string;
  isLoggedIn?: boolean;
}

export const SidebarRolesWidget: React.FC<SidebarRolesWidgetProps> = ({
  roles: initialRoles = [],
  problemId,
  isLoggedIn = false,
}) => {
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim() || !problemId) return;

    setLoading(true);
    try {
      const updatedRoles = [...roles, newItem.trim()];
      await api.updateProblem(problemId, { looking_for_roles: updatedRoles });
      setRoles(updatedRoles);
      setNewItem('');
      setIsAdding(false);
    } catch (error) {
      alert('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (indexToRemove: number) => {
    if (!problemId) return;
    const updatedRoles = roles.filter((_, idx) => idx !== indexToRemove);
    setRoles(updatedRoles);
    try {
      await api.updateProblem(problemId, { looking_for_roles: updatedRoles });
    } catch (error) {
      alert('Failed to remove item');
      setRoles(roles); // Revert on failure
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Looking For
        </span>
        {isLoggedIn && !isAdding && problemId && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            + Add Need
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {roles.length > 0 ? (
          roles.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <span>{item}</span>
              {isLoggedIn && problemId && (
                <button
                  onClick={() => handleRemoveItem(idx)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  ×
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 py-2">Nothing specified yet.</p>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddItem} className="mt-4 pt-3 border-t border-slate-100">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="e.g. I need shoes, or a UX Designer..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
            autoFocus
            required
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading || !newItem.trim()}
              className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewItem('');
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
