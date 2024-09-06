<template>
    <div class="container">
        <div class="header">
            <h2>Photo Managers</h2>
            <div class="header-buttons">
                <button class="upload-toggle-button" @click="showUploadForm = true">Upload Photo</button>
                <button class="logout-button" @click="logout">Logout</button>
            </div>
        </div>

        <input class="search-bar" type="text" v-model="keyword" @input="performSearch"
            placeholder="Search by tags..." />

        <!-- Upload modal -->
        <div v-if="showUploadForm" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <h3>Upload Photo</h3>
                <form @submit.prevent="handleUpload">
                    <input class="input-field" type="file" @change="onFileChange" />
                    <input class="input-field" type="text" v-model="title" placeholder="Title" />
                    <input class="input-field" type="text" v-model="description" placeholder="Description" />
                    <input class="input-field" type="text" v-model="tags" placeholder="Tags" />
                    <button class="upload-button" type="submit">Upload</button>
                </form>
                <button class="modal-close-button" @click="closeModal">Close</button>
            </div>
        </div>

        <div v-if="photos.length">
            <h3>Your Photos</h3>
            <div class="photo-grid">
                <div v-for="(photo, index) in photos" :key="photo._id" class="photo-item" @click="openSwiper(index)">
                    <img v-lazy="photo.url" :alt="photo.title" class="photo-img" />
                    <p class="photo-tags">Tags: {{ photo.tags.join(', ') }}</p>
                </div>
            </div>
        </div>

        <!-- Swiper Modal -->
        <div v-if="showSwiper" class="modal-overlay" @click.self="closeSwiper">
            <swiper :initial-slide="currentSlide" :space-between="10" lazy>
                <swiper-slide v-for="photo in photos" :key="photo._id">
                    <img :src="photo.url" :alt="photo.title" class="photo-img-fullscreen" />
                </swiper-slide>
            </swiper>
            <button class="modal-close-button" @click="closeSwiper">Close</button>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, nextTick, watch } from 'vue';
import { uploadPhoto, searchPhotos } from '@/services/photoService';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

export default {
    components: {
        Swiper,
        SwiperSlide
    },
    directives: {
        lazy: {
            mounted(el, binding) {
                const options = {
                    root: null,
                    threshold: 0.1,
                };

                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            el.src = binding.value;
                            observer.unobserve(el);
                        }
                    });
                }, options);

                observer.observe(el);
            }
        }
    },
    setup() {
        const store = useStore();
        const router = useRouter();

        const photos = ref([]);
        const file = ref(null);
        const tags = ref('');
        const title = ref('');
        const description = ref('');
        const keyword = ref('');
        const showUploadForm = ref(false);
        const showSwiper = ref(false);
        const currentSlide = ref(0);

        const performSearch = async () => {
            try {
                const result = await searchPhotos(keyword.value);
                if (result.success) {
                    photos.value = result.photos;
                }
            } catch (error) {
                console.error(error);
            }
        };

        const onFileChange = (event) => {
            file.value = event.target.files[0];
        };

        const handleUpload = async () => {
            if (!file.value) {
                alert('Please select a file.');
                return;
            }
            try {
                const result = await uploadPhoto(file.value, tags.value, title.value, description.value);
                if (result.success) {
                    alert('Photo uploaded successfully');
                    performSearch();
                    closeModal();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const logout = () => {
            store.commit('clearAuth');
            router.push('/login');
        };

        const closeModal = () => {
            showUploadForm.value = false;
        };

        const openSwiper = (index) => {
            currentSlide.value = index;
            showSwiper.value = true;
        };

        const closeSwiper = () => {
            showSwiper.value = false;
        };

        onMounted(() => {
            performSearch();

            watch(photos, () => {
                if (photos.value.length === 0) {
                    console.log('No photos to display');
                    return;
                }
                nextTick(() => {
                    imagesLoaded('.photo-grid', { background: true }, function () {
                        const grid = document.querySelector('.photo-grid');
                        if (grid) {
                            setTimeout(() => {
                                new Masonry(grid, {
                                    itemSelector: '.photo-item',
                                    columnWidth: '.photo-item',
                                    percentPosition: true,
                                });
                                document.querySelectorAll('.photo-item').forEach(item => {
                                    item.style.visibility = 'visible';
                                    item.style.opacity = 1;
                                });

                            }, 200);
                        } else {
                            console.error('Grid element not found!');
                        }
                    });
                });
            });
        });

        return {
            photos,
            file,
            tags,
            title,
            description,
            keyword,
            onFileChange,
            handleUpload,
            performSearch,
            logout,
            showUploadForm,
            closeModal,
            showSwiper,
            openSwiper,
            closeSwiper,
            currentSlide
        };
    },
};
</script>

<style scoped>
    .container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 20px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .header-buttons {
        display: flex;
        gap: 10px;
    }

    .upload-toggle-button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 8px 16px;
        cursor: pointer;
        border-radius: 5px;
        font-weight: bold;
    }

    .logout-button {
        background-color: red;
        color: white;
        border: none;
        padding: 8px 16px;
        cursor: pointer;
        border-radius: 5px;
        font-weight: bold;
    }

    .search-bar {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .upload-section {
        margin-bottom: 40px;
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .upload-section h3 {
        text-align: center;
        margin-bottom: 20px;
    }

    .input-field {
        display: block;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 10px;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .upload-button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
        font-weight: bold;
        width: 100%;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 400px;
    }

    .modal-close-button {
        margin-top: 20px;
        background-color: #6c757d;
        color: white;
        border: none;
        padding: 8px 16px;
        cursor: pointer;
        border-radius: 5px;
    }



    .photo-title {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .photo-description,
    .photo-tags {
        color: #666;
        font-size: 14px;
    }

    .photo-item {
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }

    .photo-item {
        width: calc(20% - 20px); /* 调整列宽，考虑左右间隔 */
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .photo-img {
        width: 100%;
        height: auto;
        border-radius: 10px;
        object-fit: cover;
        box-shadow: 0 0px 6px rgba(0, 0, 0, 0.1);
        /* border: solid; */
    }


    .photo-img-fullscreen {
        width: 100%;
        height: auto;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 10px;
    }

    @media (max-width: 1200px) {
        .photo-item {
            width: calc(25% - 10px);
        }
    }

    @media (max-width: 992px) {
        .photo-item {
            width: calc(33.33% - 10px);
        }
    }

    @media (max-width: 768px) {
        .photo-item {
            width: calc(50% - 10px);
        }
    }

    @media (max-width: 576px) {
        .photo-item {
            width: calc(100% - 10px);
        }
    }
</style>