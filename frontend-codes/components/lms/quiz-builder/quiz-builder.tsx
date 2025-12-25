"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define strict types for our quiz structure
export interface QuizOption {
  id: string; // uuid or simple random string
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string | null;
}

interface QuizBuilderProps {
  // We'll pass the JSON object (array of questions) via value
  value?: QuizQuestion[];
  onChange: (value: QuizQuestion[]) => void;
}

export function QuizBuilder({ value = [], onChange }: QuizBuilderProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(value || []);

  useEffect(() => {
     // If value changes externally (e.g. form reset), sync state
     if (value && JSON.stringify(value) !== JSON.stringify(questions)) {
         setQuestions(value);
     }
  }, [value]);

  const updateQuestions = (newQuestions: QuizQuestion[]) => {
      setQuestions(newQuestions);
      onChange(newQuestions);
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: crypto.randomUUID(),
      question: "",
      options: [
          { id: crypto.randomUUID(), text: "" },
          { id: crypto.randomUUID(), text: "" },
      ],
      correctOptionId: null,
    };
    updateQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    updateQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestionText = (id: string, text: string) => {
    updateQuestions(
      questions.map((q) => (q.id === id ? { ...q, question: text } : q))
    );
  };

  const addOption = (questionId: string) => {
    updateQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [...q.options, { id: crypto.randomUUID(), text: "" }],
          };
        }
        return q;
      })
    );
  };

  const removeOption = (questionId: string, optionId: string) => {
    updateQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
            // clear correct option if it was the one deleted
            const newCorrect = q.correctOptionId === optionId ? null : q.correctOptionId;
            return {
                ...q,
                options: q.options.filter((opt) => opt.id !== optionId),
                correctOptionId: newCorrect,
            };
        }
        return q;
      })
    );
  };

  const updateOptionText = (
    questionId: string,
    optionId: string,
    text: string
  ) => {
    updateQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) =>
              opt.id === optionId ? { ...opt, text } : opt
            ),
          };
        }
        return q;
      })
    );
  };

  const setCorrectOption = (questionId: string, optionId: string) => {
    updateQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, correctOptionId: optionId } : q
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h3 className="text-lg font-medium">Quiz Questions</h3>
         <Button onClick={addQuestion} size="sm" type="button" variant="outline">
            <Plus className="mr-2 size-4" /> Add Question
         </Button>
      </div>

      {questions.length === 0 && (
          <div className="text-center p-8 border rounded-md border-dashed text-muted-foreground">
              No questions added yet. Click &quot;Add Question&quot; to start building your quiz.
          </div>
      )}

      {questions.map((q, qIndex) => (
        <Card key={q.id} className="relative">
          <CardHeader className="py-4 bg-muted/30">
             <div className="flex items-center justify-between">
                <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestion(q.id)} className="text-destructive hover:text-destructive/80">
                     <Trash2 className="size-4" />
                </Button>
             </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
             <div className="space-y-2">
                 <Label>Question Text</Label>
                 <Input 
                   value={q.question}
                   onChange={(e) => updateQuestionText(q.id, e.target.value)} 
                   placeholder="Enter your question here..."
                 />
             </div>

             <div className="space-y-3">
                 <Label>Options</Label>
                 {q.options.map((opt, oIndex) => (
                     <div key={opt.id} className="flex items-center gap-2">
                         <button 
                           type="button" 
                           onClick={() => setCorrectOption(q.id, opt.id)}
                           className={cn("shrink-0 transition-colors", q.correctOptionId === opt.id ? "text-green-500" : "text-muted-foreground hover:text-foreground")}
                           title="Mark as correct answer"
                         >
                             {q.correctOptionId === opt.id ? (
                                 <CheckCircle className="size-5" />
                             ) : (
                                 <Circle className="size-5" />
                             )}
                         </button>
                         <Input 
                            value={opt.text}
                            onChange={(e) => updateOptionText(q.id, opt.id, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className={cn(q.correctOptionId === opt.id && "border-green-500 ring-green-500")}
                         />
                         <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(q.id, opt.id)} disabled={q.options.length <= 2}>
                             <Trash2 className="size-4" />
                         </Button>
                     </div>
                 ))}
                 
                 <Button type="button" variant="ghost" size="sm" className="ml-7" onClick={() => addOption(q.id)}>
                     <Plus className="size-3 mr-2" /> Add Option
                 </Button>
             </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
