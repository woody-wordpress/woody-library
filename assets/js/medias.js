// See https://github.com/sampotts/plyr#initialising for more inforations
(function() {
    class Video {
        constructor(element, type) {
            this.element = element;
            this.type = type;

            // Initialize Plyr based on video type
            this.initPlyr(this.element, this.type);
        }

        initPlyr(component, type) {
            let plyrComponent = {};

            switch (type) {
                case 'embed':
                    // Create a Plyr for embedded videos
                    plyrComponent = this.embedVideo(component);
                    break;
                case 'landswpr':
                    // Create Plyr options to override the controls on the Landswpr
                    plyrComponent = this.landswprVideo(component);
                    break;
                default:
                    // Create Plyrs objects to get smart controls over medias files
                    if (initialize(component)) {
                        const options = { muted: true };
                        plyrComponent = new Plyr(component, options);

                        // Manages play/pause
                        plyrComponent.on('ready', () => {
                            this.playPauseHandler(plyrComponent);
                        });
                    }
                    break;
            }

            if (!!plyrComponent) {
                // Add to plyrComponents
                plyrComponents.push(plyrComponent);
            }
        }

        embedVideo(component) {
            const heroPlyrWrapper = component.querySelector('.heroPlyr-wrapper');
            let heroPlyr = null;

            // Enable autoplay for Hero 04
            const heroWrapper = component.parentElement.classList;
            if (heroWrapper.contains('woody-component-hero') && heroWrapper.contains('tpl_04')) {
                if ((heroPlyrWrapper != null) && (initialize(heroPlyrWrapper))) {
                    heroPlyr = new Plyr(heroPlyrWrapper, {
                        autoplay: true,
                        muted: true,
                    });
                    heroPlyr.on('ready', () => {
                        heroPlyr.play();
                        this.playPauseHandler(heroPlyr);
                    });
                }
            } else {
                // Manages the "view video" button
                const toggleMovieWrapper = component.querySelector('.toggling-movie');
                const toggleMovieButton = component.querySelector('.movie-toggle');

                if (!!toggleMovieWrapper && !!toggleMovieButton) {
                    toggleMovieButton.addEventListener('click', () => {
                        if (heroPlyr == null) {
                            if (initialize(heroPlyrWrapper)) {
                                heroPlyr = new Plyr(heroPlyrWrapper);
                                heroPlyr.on('ready', () => {
                                    heroPlyr.play();
                                });
                            }
                        }

                        toggleMovieWrapper.classList.toggle('hidden');
                        component.classList.toggle('is-open');

                        if (toggleMovieButton.classList.contains('close-button')) {
                            heroPlyr.pause();
                        } else {
                            heroPlyr.play();
                        }

                        toggleMovieButton.classList.toggle('close-button');

                    }, false);
                }
            }

            return heroPlyr;
        }

        landswprVideo(component) {
            const options = JSON.parse(component.dataset.options);
            if (initialize(component)) {
                let landSwprPlyr = new Plyr(component, options);

                // Manages play/pause
                landSwprPlyr.on('ready', () => {
                    landSwprPlyr.play();
                });

                landSwprPlyr.on('playing', () => {
                    landSwprPlyr.elements.container.classList.add('playing');
                });

                return landSwprPlyr;
            }
        }

        playPauseHandler(video) {
            let isPaused = false;
            let firstLoad = true;

            //  When video is visible
            if (!!window.IntersectionObserver && !!video.elements.container) {
                const observer = new IntersectionObserver(entries => {
                    const entry = entries[0];

                    // If visible and isPaused and video has not started yet
                    if (((entry.isIntersecting) || (entry.intersectionRatio > 0)) && ((isPaused) && !video.playing) || (firstLoad)) {
                        video.play();
                        isPaused = false;
                        firstLoad = false;
                    } else if (!entry.isIntersecting && video.playing) {
                        video.pause();
                        isPaused = true;
                    }
                }, { threshold: 0.25 });

                observer.observe(video.elements.container);
            }
        }
    }

    // Init
    let plyrComponents = [];
    const videoElements = {
        'embed': document.querySelectorAll('.embed-plyr'),
        'object': document.querySelectorAll('.plyrObject'),
        'landswpr': document.querySelectorAll('.landSwprPlyr')
    }

    const initialize = (element) => {
        if (element == null) {
            return false;
        }
        const iframe = element.querySelector('iframe');
        if (iframe) {
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

    Object.entries(videoElements).forEach(([type, components]) => {
        if (components.length > 0) {
            for (let i = 0; i < components.length; i++) {
                (function(i) {
                    if (type == 'landswpr' || type == 'embed') {
                        new Video(components[i], type);
                    } else {
                        components[i].addEventListener('lazybeforeunveil', () => {
                            new Video(components[i], type);
                        });
                    }
                })(i);
            }
        }
    });

    // When the page has multiple instances in the view
    plyrComponents.forEach(currentPlyr => {
        currentPlyr.on('play', event => {
            let othersPlyr = plyrComponents.filter(plyr => plyr != currentPlyr);
            othersPlyr.forEach(plyr => {
                plyr.pause();
            })
        });
    });
}());
