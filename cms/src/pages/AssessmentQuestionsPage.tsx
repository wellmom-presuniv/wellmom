import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { assessmentApi } from "@/api/assessment";
import { AssessmentFormDialog } from "@/components/assessment/AssessmentFormDialog";
import type { AssessmentQuestion } from "@/types";

export default function AssessmentQuestionsPage() {
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<AssessmentQuestion | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<AssessmentQuestion | null>(null);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["assessment-questions"],
    queryFn: assessmentApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: assessmentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-questions"] });
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof assessmentApi.update>[1];
    }) => assessmentApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-questions"] });
      setFormOpen(false);
      setSelectedQuestion(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: assessmentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-questions"] });
      setDeleteTarget(null);
    },
  });

  function handleAddClick() {
    setSelectedQuestion(null);
    setFormOpen(true);
  }

  function handleEditClick(question: AssessmentQuestion) {
    setSelectedQuestion(question);
    setFormOpen(true);
  }

  function handleFormClose() {
    setFormOpen(false);
    setSelectedQuestion(null);
  }

  async function handleFormSubmit(
    data: Parameters<typeof assessmentApi.create>[0]
  ) {
    if (selectedQuestion) {
      await updateMutation.mutateAsync({
        id: selectedQuestion.id,
        payload: data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Assessment Questions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage daily self-assessment questions for pregnant women.
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Legenda Red Flag — penting untuk Chelsea */}
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
          ⚠ Red Flag
        </Badge>
        <span>
          Answering "Yes" to this question will directly trigger High Risk,
          regardless of the total score.
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-200 rounded-lg text-slate-400">
          <p className="text-sm">No assessment questions have been added yet.</p>
          <p className="text-sm">Click "Add Question" to get started.</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No.</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead className="w-20">Weight</TableHead>
                <TableHead className="w-28">Red Flag</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-24 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions
                .slice()
                .sort((a, b) => a.order_index - b.order_index)
                .map((question, index) => (
                  <TableRow
                    key={question.id}
                    className={
                      question.is_red_flag ? "bg-rose-50/50" : ""
                    }
                  >
                    <TableCell className="text-slate-400 text-sm">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {question.question_text}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {question.weight}
                    </TableCell>
                    <TableCell>
                      {question.is_red_flag ? (
                        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
                          ⚠ Red Flag
                        </Badge>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          question.is_active ? "default" : "secondary"
                        }
                        className={
                          question.is_active
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : ""
                        }
                      >
                        {question.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditClick(question)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() => setDeleteTarget(question)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AssessmentFormDialog
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedQuestion}
        isSubmitting={
          createMutation.isPending || updateMutation.isPending
        }
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.question_text}" will be permanently deleted and
              will no longer appear in the assessment form. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-500 hover:bg-rose-600"
              onClick={() =>
                deleteTarget &&
                deleteMutation.mutate(deleteTarget.id)
              }
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}