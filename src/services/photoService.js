import axios from './axios';

export const uploadPhoto = async (file, tags, title, description) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags);
    formData.append('title', title);
    formData.append('description', description);

    const response = await axios.post('/photo/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const searchPhotos = async (keyword) => {
    const response = await axios.get('/photo/search', { params: { keyword } });
    return response.data;
};