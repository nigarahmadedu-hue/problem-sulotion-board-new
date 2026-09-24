import React from 'react';

interface RoleItem {
  role: string;
  countNeeded: number;
}

interface SidebarRolesWidgetProps {
  roles?: RoleItem[];
}

export const SidebarRolesWidget: React.FC<SidebarRolesWidgetProps> = ({
  roles = [
    { role: 'AI Engineer', countNeeded: 2 },
    { role: 'Developer', countNeeded: 1 },
    { role: 'Domain Expert', countNeeded: 1 },
    { role: 'Designer', countNeeded: 1 },
  ],
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
        Looking For
      </span>

      <div className="space-y-3">
        {roles.map((r) => (
          <div
            key={r.role}
            className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 last:pb-0"
          >
            <span className="text-sm font-medium text-slate-800">{r.role}</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
              {r.countNeeded} needed
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
