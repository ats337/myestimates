import type { WorkItem, JobType } from '@/types';

// 作業項目の金額を計算
export function calculateWorkItemCost(
  workItem: WorkItem,
  jobTypes: JobType[]
): number {
  const jobType = jobTypes.find((jt) => jt.id === workItem.jobTypeId);
  if (!jobType) return 0;
  return workItem.hours * jobType.hourlyRate;
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

// 合計時間を計算
export function calculateTotalHours(workItems: WorkItem[]): number {
  return workItems.reduce((total, item) => total + item.hours, 0);
}

// 金額をフォーマット
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount);
}

// 時間をフォーマット
export function formatHours(hours: number): string {
  return `${hours.toFixed(1)}時間`;
}
