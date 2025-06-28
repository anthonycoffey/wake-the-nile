document.addEventListener('DOMContentLoaded', function () {
    const videoSlider = document.querySelector('.wtn-video-slider');

    if (videoSlider) {
        const swiper = new Swiper('.wtn-video-slider', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                init: function () {
                    playActiveVideo(this);
                },
                slideChange: function () {
                    playActiveVideo(this);
                },
            },
        });

        function playActiveVideo(swiperInstance) {
            // Pause all videos
            const allVideos = document.querySelectorAll('.wtn-video-slider video');
            allVideos.forEach(video => {
                video.pause();
            });

            // Play the active slide's video
            const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
            const activeVideo = activeSlide.querySelector('video');
            if (activeVideo) {
                activeVideo.play().catch(error => {
                    console.error("Video autoplay failed:", error);
                });
            }
        }
    }
});
