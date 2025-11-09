import type { EstimateProject, Settings, JobType } from '@/types';

const STORAGE_KEYS = {
  PROJECTS: 'estimate_projects',
  SETTINGS: 'estimate_settings',
} as const;

// デフォルトの職種設定 (1人月=160時間として計算)
const DEFAULT_JOB_TYPES: JobType[] = [
  { id: '1', name: 'プロジェクトマネージャー', hourlyRate: 7500 }, // 1200000 / 160
  { id: '2', name: 'システムエンジニア', hourlyRate: 5625 }, // 900000 / 160
  { id: '3', name: 'プログラマー', hourlyRate: 4375 }, // 700000 / 160
  { id: '4', name: 'テスター', hourlyRate: 3750 }, // 600000 / 160
];

// デフォルト設定
const DEFAULT_SETTINGS: Settings = {
  jobTypes: DEFAULT_JOB_TYPES,
  templates: [
    {
      id: '1',
      name: '標準Webアプリケーション開発',
      workItems: [
        { name: '要件定義', jobTypeId: '1', hours: 80 }, // 0.5人月 = 80時間
        { name: '基本設計', jobTypeId: '2', hours: 160 }, // 1.0人月 = 160時間
        { name: '詳細設計', jobTypeId: '2', hours: 240 }, // 1.5人月 = 240時間
        { name: '開発', jobTypeId: '3', hours: 480 }, // 3.0人月 = 480時間
        { name: '単体テスト', jobTypeId: '3', hours: 160 }, // 1.0人月 = 160時間
        { name: '結合テスト', jobTypeId: '4', hours: 160 }, // 1.0人月 = 160時間
        { name: 'システムテスト', jobTypeId: '4', hours: 80 }, // 0.5人月 = 80時間
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
