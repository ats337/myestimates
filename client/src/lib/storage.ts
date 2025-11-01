import type { EstimateProject, Settings, JobType } from '@/types';

const STORAGE_KEYS = {
  PROJECTS: 'estimate_projects',
  SETTINGS: 'estimate_settings',
} as const;

// デフォルトの職種設定
const DEFAULT_JOB_TYPES: JobType[] = [
  { id: '1', name: 'プロジェクトマネージャー', monthlyRate: 1200000 },
  { id: '2', name: 'システムエンジニア', monthlyRate: 900000 },
  { id: '3', name: 'プログラマー', monthlyRate: 700000 },
  { id: '4', name: 'テスター', monthlyRate: 600000 },
];

// デフォルト設定
const DEFAULT_SETTINGS: Settings = {
  jobTypes: DEFAULT_JOB_TYPES,
  templates: [
    {
      id: '1',
      name: '標準Webアプリケーション開発',
      workItems: [
        { name: '要件定義', jobTypeId: '1', manMonths: 0.5 },
        { name: '基本設計', jobTypeId: '2', manMonths: 1.0 },
        { name: '詳細設計', jobTypeId: '2', manMonths: 1.5 },
        { name: '開発', jobTypeId: '3', manMonths: 3.0 },
        { name: '単体テスト', jobTypeId: '3', manMonths: 1.0 },
        { name: '結合テスト', jobTypeId: '4', manMonths: 1.0 },
        { name: 'システムテスト', jobTypeId: '4', manMonths: 0.5 },
      ],
    },
  ],
};

// プロジェクト一覧の取得
export function getProjects(): EstimateProject[] {
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return data ? JSON.parse(data) : [];
}

// プロジェクトの保存
export function saveProject(project: EstimateProject): void {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

// プロジェクトの削除
export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

// 設定の取得
export function getSettings(): Settings {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
}

// 設定の保存
export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}
