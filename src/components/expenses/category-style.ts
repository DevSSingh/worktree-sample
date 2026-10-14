import { Utensils, TrainFront, Clapperboard, ShoppingBag, Receipt, Shapes } from 'lucide-react';
import type { Category } from '@/types/expense';
export const categoryStyle = {
  Food: {
    icon: Utensils,
    color: '#f59e0b',
    className: 'bg-amber-50 text-amber-600'
  },
  Transportation: {
    icon: TrainFront,
    color: '#6366f1',
    className: 'bg-indigo-50 text-indigo-600'
  },
  Entertainment: {
    icon: Clapperboard,
    color: '#a855f7',
    className: 'bg-purple-50 text-purple-600'
  },
  Shopping: {
    icon: ShoppingBag,
    color: '#ec4899',
    className: 'bg-pink-50 text-pink-600'
  },
  Bills: {
    icon: Receipt,
    color: '#10b981',
    className: 'bg-emerald-50 text-emerald-600'
  },
  Other: {
    icon: Shapes,
    color: '#94a3b8',
    className: 'bg-slate-100 text-slate-600'
  }
} satisfies Record<Category, {
  icon: typeof Utensils;
  color: string;
  className: string;
}>;
