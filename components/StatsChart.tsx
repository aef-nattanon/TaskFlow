import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Task } from '../types';
import { PRIORITY_COLORS } from '../constants';

interface StatsChartProps {
  tasks: Task[];
}

const StatsChart: React.FC<StatsChartProps> = ({ tasks }) => {
  const data = [
    { name: 'Urgent', count: tasks.filter(t => t.priority === 'Urgent' && t.status === 'Active').length, color: PRIORITY_COLORS.Urgent },
    { name: 'High', count: tasks.filter(t => t.priority === 'High' && t.status === 'Active').length, color: PRIORITY_COLORS.High },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'Medium' && t.status === 'Active').length, color: PRIORITY_COLORS.Medium },
    { name: 'Low', count: tasks.filter(t => t.priority === 'Low' && t.status === 'Active').length, color: PRIORITY_COLORS.Low },
  ];

  if (tasks.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 h-64">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Active Tasks by Priority</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(StatsChart);
