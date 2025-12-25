
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, HelpCircle, Play } from 'lucide-react';
import type { Lecture } from '@/types/course';
import { RichTextRenderer } from './RichTextRenderer';

interface QuizRendererProps {
  lecture: Lecture;
  onMarkComplete: () => void;
  isCompleted: boolean;
}

export const QuizRenderer: React.FC<QuizRendererProps> = ({
  lecture,
  onMarkComplete,
  isCompleted
}) => {
  const handleStartQuiz = () => {
    // Open quiz in new tab/window or handle quiz logic here
    window.open(`/quiz/${lecture.id}`, '_blank');
    // Mark as complete after starting quiz
    onMarkComplete();
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#1d2026] flex flex-col h-full overflow-y-auto transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl w-full">
          <div className="mb-8">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">{lecture.title}</h2>
            <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-8">
              <RichTextRenderer content={lecture.description || 'Test your knowledge with this quiz'} className="prose prose-lg dark:prose-invert max-w-none" />
            </div>
          </div>

          {isCompleted && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium mb-8">
              <CheckCircle className="w-4 h-4" />
              <span>Quiz Completed</span>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-8 max-w-lg mx-auto">
             <div className="flex flex-col items-center">
                 <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Ready to start?</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                    This quiz contains questions to test your understanding of the material.
                 </p>
                 <Button
                  onClick={handleStartQuiz}
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-medium px-8 py-6 h-auto text-base shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                </Button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
