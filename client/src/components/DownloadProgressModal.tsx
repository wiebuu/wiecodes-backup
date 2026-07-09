import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface DownloadProgressModalProps {
  open: boolean;
  current: number;
  total: number;
  title?: string;
}

const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({ open, current, total, title }) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm w-full space-y-4">
        <h2 className="text-lg font-semibold text-primary text-center">
          Downloading {title || 'Templates'}...
        </h2>
        <p className="text-center text-sm text-muted-foreground">
          {current} of {total} templates
        </p>
        <Progress value={percent} />
      </DialogContent>
    </Dialog>
  );
};

export default DownloadProgressModal;
