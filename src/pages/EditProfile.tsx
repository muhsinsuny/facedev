import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth, type User } from '../context/AuthContext';
import { updateUserProfile } from '../lib/api/user'; // Pastikan fungsi ini menerima FormData
import AvatarUploader from './partials/AvatarUploader';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileEdit = ({ open, onOpenChange }: EditProfileModalProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user?.email) throw new Error('User not found');

      const formData = new FormData();
      formData.append('name', name);
      formData.append('headline', headline);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      const userData = {
        name: formData.get('name') as string,
        headline: formData.get('headline') as string,
        avatar: avatarFile ? (formData.get('avatar') as string) : undefined,
      };
      return updateUserProfile(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user?.email] });
      alert('Profil berhasil diperbarui!');
      onOpenChange(false); // Tutup modal
    },
    onError: (error: Error) => {
      alert('Gagal memperbarui profil: ' + error.message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    setAvatarFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-left text-md-bold text-neutral-950'>
            Edit Profil
          </DialogTitle>
          <DialogDescription className='hidden text-left text-sm-semibold text-neutral-950'>
            Perbarui profil Anda
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* <div className='flex items-center justify-center'>
            <Input
              type='file'
              accept='image/*'
              className='justify-center item-center'
              placeholder={user?.avatarUrl}
              onChange={handleFileChange}
            />
          </div> */}
          {user && <AvatarUploader user={user as User} {...handleFileChange} />}
          <div className='text-sm-semibold text-neutral-950'>
            Name
            <Input
              className='text-sm-regular text-neutral-500'
              value={name}
              placeholder='Name'
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='text-sm-semibold text-neutral-950'>
            Profile Headline
            <Input
              className='text-sm-regular text-neutral-500'
              value={headline}
              placeholder='Headline'
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>
          <Button
            className='w-full rounded-full bg-primary-300 hover:bg-primary-200 text-sm-semibold text-neutral-25 hover:cursor-pointer hover:text-black'
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEdit;
