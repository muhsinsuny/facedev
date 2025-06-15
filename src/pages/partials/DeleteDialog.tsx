import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import type { ReactNode } from 'react';
import { ShineBorder } from '../../components/magicui/shine-border';

interface DeleteDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void;
  loading?: boolean;
  onClose?: () => void;
}

export default function DeleteDialog({
  trigger,
  title = 'Delete Confirmation',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  onConfirm,
  loading = false,
  onClose,
}: DeleteDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#ffbe7b']} />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='outline'
              onClick={onClose}
              className='cursor-pointer'
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant='destructive'
              onClick={onConfirm}
              disabled={loading}
              className='cursor-pointer'
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
