import NotebookViewer from './file-viewer-components/NotebookViewer';
import { useConstructUrl } from '@/hooks/use-construct-url';
import { getFileType } from '@/lib/utils';

interface DocumentContentProps {
  documentKey?: string;
}

export const DocumentContent: React.FC<DocumentContentProps> = ({ documentKey }) => {
  if (!documentKey) return null;

  const fileType = getFileType(documentKey);
  const documentUrl = useConstructUrl(documentKey);

  switch (fileType) {
    case 'ipynb':
      return <NotebookViewer notebookUrl={documentUrl} />;

    case 'pdf':
      return (
        <iframe
          src={documentUrl}
          className="w-full h-full border-0"
        />
      );

    case 'docx':
      return (
        <div className="p-6">
          <a href={documentUrl} target="_blank" rel="noreferrer">
            Open Word document
          </a>
        </div>
      );

    default:
      return (
        <div className="p-6">
          <a href={documentUrl} target="_blank" rel="noreferrer">
            Open document
          </a>
        </div>
      );
  }
};
