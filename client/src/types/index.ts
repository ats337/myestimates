// 職種の型定義
export interface JobType {
  id: string;
  name: string;
  monthlyRate: number; // 人月単価
}

// 作業項目の型定義
export interface WorkItem {
  id: string;
  name: string;
  jobTypeId: string;
  manMonths: number; // 人月
}

// 見積もりプロジェクトの型定義
export interface EstimateProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  workItems: WorkItem[];
}

// テンプレートの型定義
export interface Template {
  id: string;
  name: string;
  workItems: Omit<WorkItem, 'id'>[];
}

// 設定の型定義
export interface Settings {
  jobTypes: JobType[];
  templates: Template[];
}
