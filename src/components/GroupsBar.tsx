import React from 'react';
import { Users, Plus, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { FacebookGroup } from '../types';

interface GroupsBarProps {
  groups: FacebookGroup[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onOpenAddGroup: () => void;
}

export const GroupsBar: React.FC<GroupsBarProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onOpenAddGroup,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Title and stats */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              مجموعات البيع والشراء المتصلة
            </span>
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <span>{groups.length} مجموعات نشطة</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle className="w-3 h-3" />
                المزامنة مفعلة
              </span>
            </div>
          </div>
        </div>

        {/* Groups Horizontal Scrollable Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          
          {/* All Groups Option */}
          <button
            onClick={() => onSelectGroup('ALL')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedGroupId === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>جميع المجموعات</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedGroupId === 'ALL' ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              الكل
            </span>
          </button>

          {/* Individual Groups */}
          {groups.map((group) => {
            const isSelected = selectedGroupId === group.id;
            return (
              <button
                key={group.id}
                onClick={() => onSelectGroup(group.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-800 dark:text-blue-300 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <img
                  src={group.avatarUrl}
                  alt={group.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="max-w-[170px] truncate">{group.name}</span>
                <span className="text-[10px] text-slate-400">
                  ({(group.memberCount / 1000).toFixed(0)}k)
                </span>
              </button>
            );
          })}

          {/* Add Group Button */}
          <button
            onClick={onOpenAddGroup}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 transition-colors shrink-0"
            title="إضافة مجموعة فيسبوك جديدة للرصد"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة مجموعة</span>
          </button>

        </div>

      </div>
    </div>
  );
};
