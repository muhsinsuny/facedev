// src/pages/UpdatePost.tsx
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import WritePostNavbar from '../partials/WritePostNavbar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';
import { fetchPostDetail, updatePost } from '../../lib/api/post';

export default function UpdatePost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const auth = useAuth();
  const token = auth?.token;
  const user = auth?.user;

  // Ref to access editor instance
  const editorRef = useRef<typeof SunEditor | null>(null);
  useEffect(() => {
    const getPost = async () => {
      try {
        if (id) {
          const data = await fetchPostDetail(id);
          setTitle(data.title);
          setContent(data.content); // Set state
          setTags(data.tags.join(', '));
          setImage(data.image);
          setImageUrl(data.image);

          // Set editor content
          if (editorRef.current) {
            setContent(data.content);
          }
        }
      } catch (err) {
        console.error('Failed to fetch post detail:', err);
      }
    };
    getPost();
  }, [id]);

  if (!token) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <p className='text-lg'>You must be logged in to update a post.</p>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!user || !id) return;

    try {
      const finalImage = image instanceof File ? undefined : image;

      await updatePost(
        parseInt(id),
        title,
        content,
        tags.split(',').map((t) => t.trim()),
        finalImage
      );

      navigate('/');
    } catch (err) {
      console.error('Failed to update post:', err);
    }
  };

  return (
    <>
      <WritePostNavbar />
      {user && (
        <div className='custom-container'>
          <div className='max-w-3xl py-10 mx-auto space-y-6'>
            <div>
              <Label className='mb-2' htmlFor='title'>
                Title
              </Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label className='mb-2' htmlFor='content'>
                Content
              </Label>
              <SunEditor
                key={content}
                setOptions={{
                  height: '300',
                  buttonList: [
                    ['undo', 'redo'],
                    ['formatBlock'],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['fontColor', 'hiliteColor'],
                    ['align', 'list', 'table'],
                    ['link', 'image', 'video'],
                    ['fullScreen', 'codeView'],
                  ],
                }}
                defaultValue={content}
                onChange={(value) => {
                  // Optional: remove unwanted <p> tags
                  const cleaned = value.replace(/<\/?p[^>]*>/g, '');
                  setContent(cleaned);
                }}
              />
            </div>

            <div>
              <Label className='mb-2'>Image</Label>
              <Input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt='Preview'
                  className='mt-2 rounded max-h-48'
                />
              )}
            </div>

            <div>
              <Label className='mb-2'>Tags</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder='e.g. react, typescript'
              />
            </div>

            <div className='flex justify-end'>
              <Button
                className='bg-primary-300 hover:bg-primary-200 right-0 h-[44px] w-full cursor-pointer rounded-full text-white hover:text-black md:w-[265px]'
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
