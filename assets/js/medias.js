/**
 * @class Video
 * @author Soheil Saheb-Jamii
 * @description Instancies a new video object
 * @param {Object} DOM element
 * @method initEmbed() - Initialize an embed video
 * @method initObject() - Initialize an object video
 * @method initLandSwpr() - Initialize a landSwpr video
 */
class Video {
    constructor(element) {
        this.element = element;
        this.ready = new Event('ready');
        this.lazyload = new Event('lazyload');
        this.inViewLazyLoad();

        this.isPaused = false;
        this.Loaded = false;
    }
    on(event, callback) {
        let self = this;
        if (!!this.plyr) {
            this.plyr.on(event, callback);
        } else {
            this.element.addEventListener('ready', () => {
                self.on(event, callback);
            })
        }
    }
    pause() {
        if (!!this.plyr) {
            this.plyr.pause();
        }
    }
    inViewLazyLoad() {
        let self = this;
        let lazyLoad = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) {
                    self.element.dispatchEvent(self.lazyload);
                    lazyLoad.unobserve(self.element);
                }
            });
        }, { threshold: 0.25 });
        lazyLoad.observe(this.element);
    }
    // Check if video is initialized
    isInitialized() {
        if (!this.element) {return false;}
        const iframe = this.element.querySelector('iframe');
        if (!!iframe) {
            let src = iframe.getAttribute('data-src');
            if (src) {
                iframe.setAttribute("src", src);
            }
            if (iframe.getAttribute('src')) {
                return true;
            }
        }
        return false;
    }
    // Autoplay only when visible
    autoplayOnVisible() {
        let self = this;
        let isPaused = false;
        let firstLoad = true;
         //  When video is visible
        if (!!window.IntersectionObserver && !!this.plyr.elements.container) {
            const observer = new IntersectionObserver(entries => {
                const entry = entries[0];

                // If visible and isPaused and video has not started yet
                if (((entry.isIntersecting) || (entry.intersectionRatio > 0)) && ((isPaused) && !self.plyr.playing) || (firstLoad)) {
                    self.plyr.play();
                    isPaused = false;
                    firstLoad = false;
                } else if (!entry.isIntersecting && self.plyr.playing) {
                    self.pause();
                    isPaused = true;
                }
            }, { threshold: 0.25 });

            observer.observe(self.plyr.elements.container);
        }
    }

    setSwiper() {
        // If this.swiper is already set, do nothing
        if (!this.swiper) this.swiper = !!this.toggleMovieSwiper && this.toggleMovieSwiper.swiper ? this.toggleMovieSwiper.swiper : null;
    }

    // * Embed Videos worker
    // * =====================
    initEmbed() {

        let self = this;

        const heroPlyrWrapper = this.element.querySelector('.heroPlyr-wrapper');
        const heroWrapper = this.element.parentElement.classList;
        // Enable autoplay for Hero 04
        if (heroWrapper.contains('woody-component-hero') && heroWrapper.contains('tpl_04')) {
            if ((heroPlyrWrapper != null) && (self.isInitialized(heroPlyrWrapper))) {
                let options = {
                    autoplay: true,
                    muted: true,
                    youtube: {
                        noCookie: true,
                    }
                }
                self.createPlyr(heroPlyrWrapper, options);
                self.plyr.on('ready', () => {
                    self.plyr.play();
                    self.autoplayOnVisible(self.plyr);
                });
            }
        } else {
            // Manages the "view video" button
            this.toggleMovieWrapper = this.element.querySelector('.toggling-movie');
            this.toggleMovieButton = this.element.querySelector('.movie-toggle');

            //Manage "view video" in swiper
            this.toggleMovieSwiper = this.element.closest(".swiper-container");

            if (!!this.toggleMovieWrapper && !!this.toggleMovieButton) {
                this.toggleMovieButton.addEventListener('click', () => {
                    self.setSwiper();
                    if (self.plyr == null) {
                        if (self.isInitialized(heroPlyrWrapper)) {
                            let options = {youtube:{noCookie:true}}
                            self.createPlyr(heroPlyrWrapper, options);
                            self.plyr.on('ready', () => {
                                self.plyr.play();
                            });
                        }
                    }

                    self.toggleMovieWrapper.classList.toggle('hidden');
                    self.element.classList.toggle('is-open');

                    if (!!self.swiper){
                        self.swiper.autoplay.stop();
                        self.swiper.allowTouchMove = false;



                        if (self.toggleMovieButton.classList.contains('close-button')) {
                            self.pause();
                            self.swiper.autoplay.start();
                            self.swiper.allowTouchMove = true;
                        } else {
                            self.plyr.play();
                            self.swiper.autoplay.stop();
                            self.swiper.allowTouchMove = false;
                        }
                    }

                    self.toggleMovieButton.classList.toggle('close-button');

                }, false);
            }
        }
    }

    // * Object Videos worker
    // * =====================
    initObject() {
        let self = this;
        if (this.isInitialized()) {
            this.element.addEventListener('lazyload', () => {
                const options = {
                    youtube:{noCookie:true},
                }
                self.createPlyr(this.element, options);
            })
        }
    }

    // * LandSwpr Videos worker
    // * =====================
    initLandSwpr() {
        let self = this;
        let options = JSON.parse(this.element.dataset.options);
        if (this.isInitialized()) {
            options.youtube = typeof options.youtube === 'undefined' ? {} : options.youtube;
            options.youtube.noCookie = true;
            this.createPlyr(this.element, options);
            this.on('ready', () => {
                self.plyr.play();
            })
            this.on('play', () => {
                self.plyr.elements.container.classList.add('playing');
            })
        }
    }

    /**
     * @description Create the Plyr object
     * @param {Object} - DOM element (this.element in most cases)
     * @param {Object} - Plyr options
     */
    createPlyr(element, options) {
        if (!['iPhone', 'iPhone Simulator'].includes(navigator.platform)) {
            this.plyr = new Plyr(element, options);
            this.element.dispatchEvent(this.ready);
        }
    }
}

/**
 * @class Medias
 * @author Soheil Saheb-Jamii
 * @description Initialize all videos found on page
 * with the appropriate Video worker.
 * @description Multi-video management (play/pause)
 */
class Medias {
    constructor() {
        this.components = [];
        this.init();
    }
    init() {
        // Initialize all embed videos
        Array.from(document.querySelectorAll('.embed-plyr')).forEach(element => {
            const player = new Video(element);
            player.initEmbed();
            this.components.push(player);
        });
        // Initialize all Object videos
        Array.from(document.querySelectorAll('.plyrObject')).forEach(element => {
            const player = new Video(element);
            player.initObject();
            this.components.push(player);
        });
        // Initialize all LandSwpr videos
        Array.from(document.querySelectorAll('.landSwprPlyr')).forEach(element => {
            const player = new Video(element);
            player.initLandSwpr();
            this.components.push(player);
        });
        this.playPauseMultiple();
    }
    // On Play, force others videos to be paused
    playPauseMultiple() {
        let self = this;
        this.components.forEach(component => {
            component.on('play', () => {
                self.components.filter(plyr => plyr != component).forEach(otherComponent => {
                    otherComponent.pause();
                });
            })
        });
    }
}
new Medias();
