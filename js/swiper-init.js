document.addEventListener('DOMContentLoaded', function () {
    const videoSlider = document.querySelector('.wtn-video-slider');

    if (videoSlider) {
        const swiper = new Swiper('.wtn-video-slider', {
            effect: 'coverflow',
            loop: false,
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 10,
            coverflowEffect: {
                rotate: 20,
                stretch: 0,
                depth: 150,
                modifier: 1,
                slideShadows: false,
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

        function setupUnmute() {
            const overlays = document.querySelectorAll('.unmute-overlay');
            const allVideos = document.querySelectorAll('.wtn-video-slider video');

            overlays.forEach(overlay => {
                overlay.addEventListener('click', function() {
                    // Unmute all videos
                    allVideos.forEach(video => {
                        video.muted = false;
                    });

                    // Hide all overlays
                    overlays.forEach(o => o.classList.add('hidden'));

                    // Ensure the currently active video continues playing with sound
                    const activeSlide = swiper.slides[swiper.activeIndex];
                    const activeVideo = activeSlide.querySelector('video');
                    if (activeVideo) {
                        activeVideo.play().catch(error => {
                            console.error("Video autoplay with sound failed:", error);
                        });
                    }
                }, { once: true }); // Ensure this only runs once per overlay
            });
        }

        setupUnmute();
    }
});
