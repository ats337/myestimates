import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects, deleteProject } from "@/lib/storage";
import { Plus, FileText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import type { EstimateProject } from "@/types";
import { toast } from "sonner";

export default function Home() {
  const [projects, setProjects] = useState<EstimateProject[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    setProjects(getProjects());
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`「${name}」を削除してもよろしいですか?`)) {
      deleteProject(id);
      loadProjects();
      toast.success("プロジェクトを削除しました");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">見積もりプロジェクト一覧</h2>
        <Link href="/estimate">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-slate-300" />
            <p className="mb-4 text-slate-500">まだプロジェクトがありません</p>
            <Link href="/estimate">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                最初のプロジェクトを作成
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription>
                  作成日: {new Date(project.createdAt).toLocaleDateString('ja-JP')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-sm text-slate-600">
                  作業項目: {project.workItems.length}件
                </div>
                <div className="flex gap-2">
                  <Link href={`/estimate/${project.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      編集
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(project.id, project.name)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
