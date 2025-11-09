import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  calculateTotalCost,
  calculateTotalHours,
  calculateWorkItemCost,
  formatCurrency,
  formatHours,
} from "@/lib/calculator";
import { getProjects, getSettings, saveProject } from "@/lib/storage";
import type { EstimateProject, WorkItem } from "@/types";
import { ArrowLeft, Plus, Save, Trash2, FileDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EstimateEditor() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const projectId = params.id;

  const [projectName, setProjectName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const settings = getSettings();

  useEffect(() => {
    if (projectId) {
      const projects = getProjects();
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setProjectName(project.name);
        setWorkItems(project.workItems);
      }
    }
  }, [projectId]);

  const handleSave = () => {
    if (!projectName.trim()) {
      toast.error("プロジェクト名を入力してください");
      return;
    }

    const project: EstimateProject = {
      id: projectId || crypto.randomUUID(),
      name: projectName,
      createdAt: projectId
        ? getProjects().find((p) => p.id === projectId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workItems,
    };

    saveProject(project);
    toast.success("保存しました");
    setLocation("/");
  };

  const handleAddWorkItem = () => {
    const newItem: WorkItem = {
      id: crypto.randomUUID(),
      name: "",
      jobTypeId: settings.jobTypes[0]?.id || "",
      hours: 0,
    };
    setWorkItems([...workItems, newItem]);
  };

  const handleRemoveWorkItem = (id: string) => {
    setWorkItems(workItems.filter((item) => item.id !== id));
  };

  const handleUpdateWorkItem = (id: string, updates: Partial<WorkItem>) => {
    setWorkItems(
      workItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = settings.templates.find((t) => t.id === templateId);
    if (template) {
      const newItems: WorkItem[] = template.workItems.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
      }));
      setWorkItems([...workItems, ...newItems]);
      toast.success("テンプレートを読み込みました");
    }
  };

  const totalCost = calculateTotalCost(workItems, settings.jobTypes);
  const totalHours = calculateTotalHours(workItems);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                戻る
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">
              {projectId ? "見積もり編集" : "新規見積もり作成"}
            </h1>
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 左側: 入力フォーム */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>プロジェクト情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">顧客名</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="例: 株式会社〇〇"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectName">プロジェクト名</Label>
                    <Input
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="例: 顧客管理システム開発"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <Label>作業項目</Label>
                    <div className="flex gap-2">
                      {settings.templates.length > 0 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <FileDown className="mr-2 h-4 w-4" />
                              テンプレート
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>テンプレートを選択</DialogTitle>
                              <DialogDescription>
                                テンプレートから作業項目を追加できます
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                              {settings.templates.map((template) => (
                                <Button
                                  key={template.id}
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleLoadTemplate(template.id)}
                                >
                                  {template.name}
                                </Button>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button onClick={handleAddWorkItem} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        追加
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>作業項目名</TableHead>
                          <TableHead>職種</TableHead>
                          <TableHead className="w-32">時間</TableHead>
                          <TableHead className="text-right">金額</TableHead>
                          <TableHead className="w-16"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-slate-500">
                              作業項目を追加してください
                            </TableCell>
                          </TableRow>
                        ) : (
                          workItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Input
                                  value={item.name}
                                  onChange={(e) =>
                                    handleUpdateWorkItem(item.id, { name: e.target.value })
                                  }
                                  placeholder="作業項目名"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={item.jobTypeId}
                                  onValueChange={(value) =>
                                    handleUpdateWorkItem(item.id, { jobTypeId: value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {settings.jobTypes.map((jobType) => (
                                      <SelectItem key={jobType.id} value={jobType.id}>
                                        {jobType.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  value={item.hours}
                                  onChange={(e) =>
                                    handleUpdateWorkItem(item.id, {
                                      hours: parseFloat(e.target.value) || 0,
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(
                                  calculateWorkItemCost(item, settings.jobTypes)
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveWorkItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側: 見積もりサマリー */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>見積もりサマリー</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-600">合計時間</span>
                  <span className="font-semibold">{formatHours(totalHours)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-600">作業項目数</span>
                  <span className="font-semibold">{workItems.length}件</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-lg font-semibold text-slate-900">合計金額</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
