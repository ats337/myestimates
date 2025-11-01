import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSettings, saveSettings } from "@/lib/storage";
import type { JobType, Template, WorkItem } from "@/types";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  useEffect(() => {
    const settings = getSettings();
    setJobTypes(settings.jobTypes);
    setTemplates(settings.templates);
  }, []);

  const handleSave = () => {
    saveSettings({ jobTypes, templates });
    toast.success("設定を保存しました");
  };

  // 職種管理
  const handleAddJobType = () => {
    const newJobType: JobType = {
      id: crypto.randomUUID(),
      name: "",
      monthlyRate: 0,
    };
    setJobTypes([...jobTypes, newJobType]);
  };

  const handleRemoveJobType = (id: string) => {
    setJobTypes(jobTypes.filter((jt) => jt.id !== id));
  };

  const handleUpdateJobType = (id: string, updates: Partial<JobType>) => {
    setJobTypes(jobTypes.map((jt) => (jt.id === id ? { ...jt, ...updates } : jt)));
  };

  // テンプレート管理
  const handleAddTemplate = () => {
    setEditingTemplate({
      id: crypto.randomUUID(),
      name: "",
      workItems: [],
    });
    setIsTemplateDialogOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setIsTemplateDialogOpen(true);
  };

  const handleRemoveTemplate = (id: string) => {
    if (confirm("このテンプレートを削除してもよろしいですか?")) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    if (!editingTemplate.name.trim()) {
      toast.error("テンプレート名を入力してください");
      return;
    }

    const existingIndex = templates.findIndex((t) => t.id === editingTemplate.id);
    if (existingIndex >= 0) {
      setTemplates(templates.map((t) => (t.id === editingTemplate.id ? editingTemplate : t)));
    } else {
      setTemplates([...templates, editingTemplate]);
    }

    setIsTemplateDialogOpen(false);
    setEditingTemplate(null);
    toast.success("テンプレートを保存しました");
  };

  const handleAddWorkItemToTemplate = () => {
    if (!editingTemplate) return;

    const newItem: Omit<WorkItem, "id"> = {
      name: "",
      jobTypeId: jobTypes[0]?.id || "",
      manMonths: 0,
    };

    setEditingTemplate({
      ...editingTemplate,
      workItems: [...editingTemplate.workItems, newItem],
    });
  };

  const handleRemoveWorkItemFromTemplate = (index: number) => {
    if (!editingTemplate) return;

    setEditingTemplate({
      ...editingTemplate,
      workItems: editingTemplate.workItems.filter((_, i) => i !== index),
    });
  };

  const handleUpdateTemplateWorkItem = (
    index: number,
    updates: Partial<Omit<WorkItem, "id">>
  ) => {
    if (!editingTemplate) return;

    setEditingTemplate({
      ...editingTemplate,
      workItems: editingTemplate.workItems.map((item, i) =>
        i === index ? { ...item, ...updates } : item
      ),
    });
  };

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
            <h1 className="text-xl font-bold text-slate-900">設定</h1>
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto py-8">
        <Tabs defaultValue="jobTypes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobTypes">職種別単価</TabsTrigger>
            <TabsTrigger value="templates">テンプレート</TabsTrigger>
          </TabsList>

          {/* 職種別単価タブ */}
          <TabsContent value="jobTypes">
            <Card>
              <CardHeader>
                <CardTitle>職種別単価設定</CardTitle>
                <CardDescription>
                  見積もり計算に使用する職種と人月単価を設定します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Button onClick={handleAddJobType} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    職種を追加
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>職種名</TableHead>
                      <TableHead>人月単価(円)</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-slate-500">
                          職種を追加してください
                        </TableCell>
                      </TableRow>
                    ) : (
                      jobTypes.map((jobType) => (
                        <TableRow key={jobType.id}>
                          <TableCell>
                            <Input
                              value={jobType.name}
                              onChange={(e) =>
                                handleUpdateJobType(jobType.id, { name: e.target.value })
                              }
                              placeholder="例: プロジェクトマネージャー"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="10000"
                              min="0"
                              value={jobType.monthlyRate}
                              onChange={(e) =>
                                handleUpdateJobType(jobType.id, {
                                  monthlyRate: parseInt(e.target.value) || 0,
                                })
                              }
                              placeholder="例: 1000000"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveJobType(jobType.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* テンプレートタブ */}
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>作業項目テンプレート</CardTitle>
                <CardDescription>
                  よく使う作業項目のセットをテンプレートとして保存できます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Button onClick={handleAddTemplate} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    テンプレートを追加
                  </Button>
                </div>

                <div className="space-y-4">
                  {templates.length === 0 ? (
                    <div className="text-center text-slate-500">
                      テンプレートを追加してください
                    </div>
                  ) : (
                    templates.map((template) => (
                      <Card key={template.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditTemplate(template)}
                              >
                                編集
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveTemplate(template.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-slate-600">
                            作業項目数: {template.workItems.length}件
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* テンプレート編集ダイアログ */}
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>テンプレート編集</DialogTitle>
              <DialogDescription>
                テンプレート名と作業項目を設定してください
              </DialogDescription>
            </DialogHeader>

            {editingTemplate && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="templateName">テンプレート名</Label>
                  <Input
                    id="templateName"
                    value={editingTemplate.name}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, name: e.target.value })
                    }
                    placeholder="例: 標準Webアプリケーション開発"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>作業項目</Label>
                    <Button onClick={handleAddWorkItemToTemplate} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      追加
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>作業項目名</TableHead>
                        <TableHead>職種</TableHead>
                        <TableHead className="w-32">人月</TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editingTemplate.workItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-slate-500">
                            作業項目を追加してください
                          </TableCell>
                        </TableRow>
                      ) : (
                        editingTemplate.workItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Input
                                value={item.name}
                                onChange={(e) =>
                                  handleUpdateTemplateWorkItem(index, { name: e.target.value })
                                }
                                placeholder="作業項目名"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.jobTypeId}
                                onValueChange={(value) =>
                                  handleUpdateTemplateWorkItem(index, { jobTypeId: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {jobTypes.map((jobType) => (
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
                                value={item.manMonths}
                                onChange={(e) =>
                                  handleUpdateTemplateWorkItem(index, {
                                    manMonths: parseFloat(e.target.value) || 0,
                                  })
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveWorkItemFromTemplate(index)}
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

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={handleSaveTemplate}>保存</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
