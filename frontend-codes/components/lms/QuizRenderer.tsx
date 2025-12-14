
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, HelpCircle, Play } from 'lucide-react';
import type { Lecture } from '@/types/course';

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
    <div className="flex-1 bg-white flex flex-col h-full overflow-y-auto">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl w-full">
          <div className="mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-purple-600" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-gray-900">{lecture.title}</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              {lecture.description || 'Test your knowledge with this quiz'}
            </p>
          </div>

          {isCompleted && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-8">
              <CheckCircle className="w-4 h-4" />
              <span>Quiz Completed</span>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 max-w-lg mx-auto">
             <div className="flex flex-col items-center">
                 <h3 className="font-semibold text-gray-900 mb-2">Ready to start?</h3>
                 <p className="text-sm text-gray-500 mb-6 max-w-xs">
                    This quiz contains questions to test your understanding of the material.
                 </p>
                 <Button
                  onClick={handleStartQuiz}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-6 h-auto text-base shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
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
