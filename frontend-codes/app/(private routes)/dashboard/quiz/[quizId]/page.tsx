"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Timer, CheckCircle, XCircle, ArrowLeft, ChevronRight, AlertCircle, Play } from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  duration?: number; // in seconds
  quizConfig: QuizQuestion[];
}

interface QuizResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.quizId as string;

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        if (!res.ok) throw new Error('Failed to load quiz');
        const data = await res.json();
        setQuizData(data);
        if (data.duration) {
          setTimeLeft(data.duration * 60); // Assuming duration is minutes in schema? Or seconds? Schema comment says "Duration in seconds for videos". For quiz duration usually minutes is preferred context for editing, but let's assume raw value. If it's small (<100) it might be minutes. If explicitly seconds, fine. Let's assume it is stored as SECONDS to match schema comment.
          // Actually, let's play safe. If > 1000 likely seconds? 
          // Let's assume Seconds as per schema.
          setTimeLeft(data.duration);
        }
      } catch (error) {
        toast.error('Could not load quiz');
      } finally {
        setLoading(false);
      }
    };

    if (quizId) fetchQuiz();
  }, [quizId]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error('Failed to submit quiz');

      const data = await res.json();
      setResult(data);
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  }, [answers, isSubmitting, quizId]);

  // Timer effect
  useEffect(() => {
    if (!started || timeLeft === null || result) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft, result, handleSubmit]);


  const handleStart = () => {
    setStarted(true);
  };

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (quizData && currentQuestionIndex < quizData.quizConfig.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
        // Last question
        handleSubmit();
    }
  };
    
  const handleRetake = () => {
      setResult(null);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setStarted(false);
      if (quizData?.duration) {
          setTimeLeft(quizData.duration);
      }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#fdb606]" />
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Quiz not found</h2>
          <Button className="mt-4" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Result View
  if (result) {
      return (
          <div className="min-h-screen flex items-center justify-center p-4">
              <Card className="w-full max-w-lg shadow-xl border-border bg-card dark:bg-card/40">
                  <CardHeader className="text-center pb-2">
                      <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                          {result.score >= 70 ? (
                              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
                          ) : (
                              <AlertCircle className="w-10 h-10 text-yellow-600 dark:text-yellow-500" />
                          )}
                      </div>
                      <CardTitle className="text-2xl font-bold text-foreground">Quiz Completed!</CardTitle>
                      <p className="text-muted-foreground mt-2">You scored {result.score}%</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Correct Answers</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-500">{result.correctCount}</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Total Questions</p>
                                <p className="text-2xl font-bold text-foreground">{result.totalQuestions}</p>
                            </div>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-foreground">Message</h4>
                            <p className="text-sm text-muted-foreground">
                                {result.score >= 80 ? 'Excellent work! You have mastered this topic.' : 
                                 result.score >= 60 ? 'Good job! You have a solid understanding.' :
                                 'Keep practicing. You can retake the quiz to improve your score.'}
                            </p>
                      </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3">
                      <Button onClick={handleRetake} className="w-full" variant="outline">Retake Quiz</Button>
                      <Button onClick={() => router.back()} className="w-full bg-[#fdb606] hover:bg-[#f39c12] text-white border-none">Back to Lesson</Button>
                  </CardFooter>
              </Card>
          </div>
      )
  }

  // Intro View
  if (!started) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-lg border-border bg-card">
                <div className="h-2 bg-gradient-to-r from-[#fdb606] to-[#f39c12] w-full rounded-t-xl" />
                <CardHeader>
                    <CardTitle className="text-3xl font-bold mb-2 text-foreground">{quizData.title}</CardTitle>
                    <p className="text-muted-foreground text-lg">{quizData.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full shadow-sm border border-border">
                            <AlertCircle className="w-4 h-4 text-[#fdb606]" />
                            {quizData.quizConfig.length} Questions
                        </div>
                        {timeLeft !== null && (
                            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full shadow-sm border border-border">
                                <Timer className="w-4 h-4 text-[#fdb606]" />
                                {Math.ceil(timeLeft / 60)} Mins Duration
                            </div>
                        )}
                        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full shadow-sm border border-border">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Auto-grading
                        </div>
                    </div>
                    
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Before you start:</h4>
                        <ul className="list-disc list-inside space-y-2 text-blue-800/80 dark:text-blue-200/80 text-sm">
                            <li>You can retake this quiz multiple times.</li>
                            <li>Ensure you have a stable internet connection.</li>
                             {timeLeft !== null && <li>The quiz will automatically submit when the timer runs out.</li>}
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4 pt-6">
                    <Button variant="ghost" onClick={() => router.back()} className="text-foreground hover:bg-muted">Cancel</Button>
                    <Button size="lg" onClick={handleStart} className="gap-2 bg-[#fdb606] hover:bg-[#f39c12] text-white px-8">
                        <Play className="w-4 h-4" /> Start Quiz
                    </Button>
                </CardFooter>
            </Card>
        </div>
      );
  }

  // Quiz Taking View
  const currentQuestion = quizData.quizConfig[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.quizConfig.length - 1;
  const progress = ((currentQuestionIndex + 1) / quizData.quizConfig.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
            <h1 className="font-bold text-lg max-w-[50%] truncate text-foreground">{quizData.title}</h1>
            <div className="flex items-center gap-6">
                {timeLeft !== null && (
                    <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-foreground'}`}>
                        <Timer className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                )}
                <Button variant="ghost" size="sm" className="hidden sm:flex text-foreground hover:bg-muted" onClick={() => router.back()}>
                    Exit Quiz
                </Button>
            </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-secondary h-2">
            <div 
                className="bg-[#fdb606] h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>

        {/* Main Content */}
        <main className="flex-1 container max-w-3xl mx-auto p-4 md:p-8 flex flex-col justify-center">
            <div className="mb-8">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {quizData.quizConfig.length}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mt-3 text-foreground leading-tight">
                    {currentQuestion.question}
                </h2>
            </div>

            <div className="grid gap-4 mb-10">
                {currentQuestion.options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                        className={`
                            group relative w-full p-5 text-left rounded-xl transition-all duration-200 border-2
                            ${answers[currentQuestion.id] === option.id 
                                ? 'border-[#fdb606] bg-[#fdb606]/5 shadow-md' 
                                : 'border-border bg-card hover:border-[#fdb606]/50 hover:bg-muted/50'}
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                ${answers[currentQuestion.id] === option.id 
                                    ? 'border-[#fdb606] bg-[#fdb606]' 
                                    : 'border-muted-foreground/30 group-hover:border-[#fdb606]/50'}
                            `}>
                                {answers[currentQuestion.id] === option.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                )}
                            </div>
                            <span className={`text-lg ${answers[currentQuestion.id] === option.id ? 'font-medium text-[#fdb606]' : 'text-foreground'}`}>
                                {option.text}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                <Button
                    variant="ghost"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                </Button>

                <Button 
                    size="lg"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="pl-8 pr-6 bg-[#fdb606] hover:bg-[#f39c12] text-white"
                >
                    {isLastQuestion ? (
                        <>
                           {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Submit Quiz'}
                        </>
                    ) : (
                        <>
                            Next Question <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </main>
    </div>
  );
}
