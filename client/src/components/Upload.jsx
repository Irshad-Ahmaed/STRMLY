import { useRef, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

const Upload = () => {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview for video
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const formDataToSend = new FormData();
      formDataToSend.append('video', file);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      const response = await axios.post(`${BASE_URL}/video/upload`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Upload successful:', response.data);
      // Reset form after successful upload
      setFile(null);
      setPreview(null);
      setFormData({ title: '', description: '' });
      alert('Video uploaded successfully!');
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='w-full mt-10 mx-[32%]'>
      <div className='bg-gray-300 rounded-lg w-1/3 p-6'>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>Title</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border rounded-md'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>Description</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border rounded-md'
              rows={3}
            />
          </div>

          <div className='mb-4'>
            <input
              ref={fileInputRef}
              type='file'
              accept='video/mp4'
              onChange={handleFileChange}
              className='hidden'
            />
            <div className='bg-gray-600 rounded-md p-4 flex flex-col items-center justify-center'>
              {preview ? (
                <div className='mb-4'>
                  <video 
                    src={preview} 
                    controls 
                    className='max-h-40 mb-2'
                  />
                  <p className='text-white text-center'>{file.name}</p>
                </div>
              ) : (
                <p className='text-white mb-4'>No video selected</p>
              )}
              <button
                type='button'
                onClick={() => fileInputRef.current.click()}
                className='bg-blue-500 py-2 px-4 text-white rounded-md cursor-pointer hover:bg-blue-400'
              >
                {file ? 'Change Video' : 'Select Video'}
              </button>
            </div>
          </div>

          {error && <div className='text-red-500 mb-4'>{error}</div>}

          <button
            type='submit'
            disabled={isUploading || !file}
            className={`w-full py-2 px-4 rounded-md text-white ${isUploading || !file ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;