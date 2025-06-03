import { useState } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import WritePostNavbar from './WritePostNavbar';
import { useAuth } from '../hooks/useAuth';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const { token } = useAuth();

  if (!token) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <p className='text-lg'>You must be logged in to write a post.</p>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverImage(file);
  };

  const handleSubmit = () => {
    console.log({
      title,
      content,
      tags: tags.split(',').map((t) => t.trim()),
      coverImage,
    });

    actionFetchPost();
  };

  const actionFetchPost = async () => {
    const data = new FormData();
    data.append('title', title);
    data.append('content', content);
    data.append('tags', tags);
    if (coverImage) data.append('coverImage', coverImage);
  };

  return (
    <>
      <WritePostNavbar />
      <div className='max-w-3xl py-10 mx-auto space-y-6'>
        <div>
          <Label htmlFor='title'>Title</Label>
          <Input
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor='content'>Content</Label>
          <SunEditor
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
            setContents={content}
            onChange={(value) => setContent(value)}
          />
        </div>

        <div>
          <Label>Cover Image</Label>
          <Input type='file' accept='image/*' onChange={handleImageUpload} />
        </div>

        <div>
          <Label>Tags</Label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder='e.g. react, typescript'
          />
        </div>

        <Button className='w-full' onClick={handleSubmit}>
          Finish
        </Button>
      </div>
    </>
  );
}
