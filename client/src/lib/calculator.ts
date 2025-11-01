import type { WorkItem, JobType } from '@/types';

// 作業項目の金額を計算
export function calculateWorkItemCost(
  workItem: WorkItem,
  jobTypes: JobType[]
): number {
  const jobType = jobTypes.find((jt) => jt.id === workItem.jobTypeId);
  if (!jobType) return 0;
  return workItem.manMonths * jobType.monthlyRate;
}

// 見積もり合計金額を計算
export function calculateTotalCost(
  workItems: WorkItem[],
  jobTypes: JobType[]
): number {
  return workItems.reduce((total, item) => {
    return total + calculateWorkItemCost(item, jobTypes);
  }, 0);
}

// 合計人月を計算
export function calculateTotalManMonths(workItems: WorkItem[]): number {
  return workItems.reduce((total, item) => total + item.manMonths, 0);
}

// 金額をフォーマット
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount);
}

// 人月をフォーマット
export function formatManMonths(manMonths: number): string {
  return `${manMonths.toFixed(1)}人月`;
}
