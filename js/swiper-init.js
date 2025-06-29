document.addEventListener('DOMContentLoaded', function () {
    const videoSlider = document.querySelector('.wtn-video-slider');

    if (videoSlider) {
        const swiper = new Swiper('.wtn-video-slider', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
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
            lazy: {
                loadPrevNext: true,
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
                if (!video.paused) {
                    video.pause();
                }
            });
        
            // Play the active slide's video
            const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
            const activeVideo = activeSlide.querySelector('video');
        
            // Check if the video has a src, which indicates it's loaded or loading
            if (activeVideo && activeVideo.hasAttribute('src')) {
                activeVideo.play().catch(error => {
                    // Autoplay was likely prevented by the browser
                    console.error("Video autoplay failed. This is common in browsers that require user interaction first.", error);
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
