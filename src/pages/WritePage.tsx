import { useState } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import WritePostNavbar from './WritePostNavbar';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import { createPost } from '../lib/api/post';
// import { on } from 'events';
import { useNavigate } from 'react-router-dom';

export default function WritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  // const [image] = useState<File | null>(null);
  const auth = useAuth();
  const token = auth?.token;
  const User = auth?.user;
  const [image, setImage] = useState<File | string>('');
  const [imageUrl] = useState(
    image instanceof File ? URL.createObjectURL(image) : image
  );
  // const data = image || ''
  // const imageUrl = data?.image ||'https://pilaradio.com/wp-content/uploads/2025/04/khabib-nurmagomedov-3_169.jpeg'

  // const imageUrl = image
  // ? URL.createObjectURL(image)
  // : 'https://pilaradio.com/wp-content/uploads/2025/04/khabib-nurmagomedov-3_169.jpeg';

  if (!token) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <p className='text-lg'>You must be logged in to write a post.</p>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleSubmit = () => {
    console.log({
      title,
      content,
      tags: tags.split(',').map((t) => t.trim()),
      image,
    });

    actionFetchPost();
  };

  const actionFetchPost = async () => {
    try {
      if (!(image instanceof File)) {
        alert('Please upload a valid image file.');
        return;
      }

      const response = await createPost(
        title,
        content,
        tags.split(','),
        image // langsung File, bukan URL
      );
      console.log(response);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <WritePostNavbar />
      {User && (
        <div className='custom-container'>
          <div className='max-w-3xl py-10 mx-auto space-y-6'>
            <div>
              <Label className='mb-2' htmlFor='title'>
                Title
              </Label>
              <Input
                id='title'
                placeholder='Enter your title'
                value={title}
                className='text-sm-regular text-neutral-500'
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label className='mb-2' htmlFor='content'>
                Content
              </Label>
              <SunEditor
                setOptions={{
                  placeholder: 'Enter your content',
                  className:
                    'text-sm-regular text-neutral-500 w-fill h-[186px]',
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
                setContents={content}
                onChange={(value) => {
                  // const trimmedValue = value.trim().replace(/^['"]|['"]$/g, '');
                  const removeTags = value.replace(/<\/?p[^>]*>/g, '');

                  setContent(removeTags);
                }}
              />
            </div>

            <div>
              <Label className='mb-2'>Cover Image</Label>
              <Input
                type='file'
                accept='image/*'
                height={'140px'}
                placeholder='click to upload or drag and drop'
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
                placeholder='Enter your tags e.g. react, typescript'
              />
            </div>
            <div className='flex justify-end'>
              <Button
                className='bg-primary-300 hover:bg-primary-200 right-0 w-full cursor-pointer rounded-full text-white hover:text-black md:h-[44px] md:w-[265px]'
                onClick={handleSubmit}
              >
                Finish
              </Button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
