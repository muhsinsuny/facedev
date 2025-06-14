// import { useEffect, useRef, useState } from 'react';
// import { Input } from '../../components/ui/input'; // sesuaikan path
// import { Camera } from 'lucide-react';
// import { type User } from '../../context/AuthContext'; // pastikan kamu punya lucide-react

// const AvatarUploader = (user: User) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Preview langsung
//     const url = URL.createObjectURL(file);
//     setPreviewUrl(url);

//     // Konversi file ke base64
//     const toBase64 = (file: File) =>
//       new Promise<string>((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => {
//           // buang prefix data:image/png;base64, dst → ambil base64-nya saja
//           const result = reader.result as string;
//           const base64 = result.split(',')[1];
//           resolve(base64);
//         };
//         reader.onerror = (err) => reject(err);
//       });

//     try {
//       setIsUploading(true);
//       setError(null);

//       const avatarBase64 = await toBase64(file);

//       // Kirim base64 ke backend
//       const response = await fetch('/api/avatar', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ avatar: avatarBase64 }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to upload avatar');
//       }

//       setIsUploading(false);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to upload avatar');
//       setIsUploading(false);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   return (
//     <div className='flex items-center justify-center'>
//       <div className='relative w-32 h-32'>
//         <img
//           src={user?.avatarUrl || '/images/avatar.png'}
//           alt='Avatar'
//           className='object-cover w-full h-full border border-gray-300 rounded-full shadow hover:cursor-pointer'
//           onError={(e) => {
//             e.currentTarget.src = '/images/avatar.png';
//           }}
//         />

//         {/* Button kamera */}
//         <button
//           type='button'
//           onClick={handleClick}
//           className='absolute p-1 bg-white rounded-full shadow right-1 bottom-1 hover:cursor-pointer hover:bg-gray-100'
//         >
//           <Camera className='w-4 h-4 text-gray-600' />
//         </button>

//         {/* Input file tersembunyi */}
//         <Input
//           type='file'
//           accept='image/*'
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           className='hidden'
//         />
//       </div>
//       {isUploading && <p>Uploading...</p>}
//       {error && <p className='text-red-500'>{error}</p>}
//     </div>
//   );
// };

// export default AvatarUploader;

import { useEffect, useRef, useState } from 'react';
import { Input } from '../../components/ui/input';
import { Camera } from 'lucide-react';
import { useAuth, type User } from '../../context/AuthContext';
// import { api } from '../../lib/api';
// import { updateUserProfile } from '../../lib/api/user';
import { api } from '../../lib/api';

interface AvatarUploaderProps {
  user: User;
  token?: string; // jika pakai auth
  onUpdated?: () => void; // callback opsional
}

const AvatarUploader = ({ user, token, onUpdated }: AvatarUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const toBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = (err) => reject(err);
      });

    try {
      setIsUploading(true);
      setError(null);

      const avatarBase64 = await toBase64(file);

      // const response = await updateUserProfile({
      //   name: user.name,
      //   headline: user.headline,
      //   avatarUrl: avatarBase64,
      // });

      const response = await api.patch('/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: user.name,
          headline: user.headline,
          avatar: avatarBase64,
        }),
      });
      console.log(response);

      const { data } = response;
      setUser(data);
      if (onUpdated) onUpdated();
      if (!(response.status >= 200 && response.status < 300)) {
        throw new Error('Gagal mengunggah avatar');
      }
    } catch (error) {
      console.error(error);
      setError('Gagal mengunggah avatar');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className='flex items-center justify-center'>
      <div className='relative w-32 h-32'>
        <img
          src={user?.avatarUrl || '/images/avatar.png'}
          alt='Avatar'
          className='object-cover w-full h-full border border-gray-300 rounded-full shadow hover:cursor-pointer'
          onError={(e) => {
            e.currentTarget.src = '/images/avatar.png';
          }}
        />

        <button
          type='button'
          onClick={handleClick}
          className='absolute p-1 bg-white rounded-full shadow right-1 bottom-1 hover:cursor-pointer hover:bg-gray-100'
        >
          <Camera className='w-4 h-4 text-gray-600' />
        </button>

        <Input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          ref={fileInputRef}
          className='hidden'
        />
      </div>

      {isUploading && <p>Uploading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
};

export default AvatarUploader;
