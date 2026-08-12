import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GoalForm } from '../components/goals/GoalForm';
import { GoalList } from '../components/goals/GoalList';
import { GoalSkeleton } from '../components/goals/GoalSkeleton';
import { useAccounts } from '../context/AccountContext';

import {
  fetchGoals,
  createGoalRequest,
  contributeGoalRequest,
  deleteGoalRequest,
} from '../api/goals';

import { Goal } from '../types';
import { withMinimumDelay } from '../utils/withMinimumDelay';

import type { JSX } from 'react';

export function GoalsPage(): JSX.Element {
  const { accounts } = useAccounts();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);

    const data = await withMinimumDelay(fetchGoals());

    setGoals(data);
    setIsLoading(false);
  }, []);


  const refreshData = useCallback(async () => {
    const data = await fetchGoals();
    setGoals(data);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleCreate(payload: {
    name: string;
    targetAmount: number;
    targetDate: string | null;
  }): Promise<void> {
    await createGoalRequest(payload);
    await refreshData();
  }

  async function handleContribute(
    id: string,
    amount: number,
    accountId: string,
  ): Promise<void> {
    await contributeGoalRequest(id, amount, accountId);
    await refreshData();
  }

  async function handleDelete(id: string): Promise<void> {
    await deleteGoalRequest(id);
    await refreshData();
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <GoalForm onSubmit={handleCreate} />
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <GoalSkeleton />
          ) : (
            <GoalList
              goals={goals}
              accounts={accounts}
              isLoading={false}
              onContribute={handleContribute}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
