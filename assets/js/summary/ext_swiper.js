import Swiper from "swiper";

export default class SummarySwiper {
    constructor(master) {
        this.totalItemWidth = 0;
        this.swiper;
        this.master = master;
        this.element = master.element;
        this.requiredSwiper = false;
        this.init();
    }

    init() {
        this.events();
    }

    events() {
        this.master.on('summary:init', this.calculateRequiredSwiper(this));
        this.master.on('summary:fixed:start', this.createSwiper.bind(this));
        this.master.on('summary:fixed:stop', this.removeSwiper.bind(this));
        this.master.on('summary:resized', this.createSwiper.bind(this));
        this.master.on('summary:section:changed', this.manageSwiper.bind(this));
    }

    calculateRequiredSwiper() {
        let self = this;
        this.master.summaryItems.forEach(el => self.totalItemWidth += el.offsetWidth);
        if (this.totalItemWidth > this.element.offsetWidth) {
            this.requiredSwiper = true;
        }
    }

    createSwiper() {
        if (!this.swiper) {
            let self = this;
            if (self.requiredSwiper) {
                this.element.classList.add('swiper-container');
                this.master.summaryItems.forEach(el => el.classList.add('swiper-slide'));
                let menuWrap = this.element.querySelector('.menu');
                if (!!menuWrap) {
                    // wrap into swiper-container
                    let container = document.createElement('div');
                    container.classList.add('swiper-container');
                    menuWrap.parentNode.insertBefore(container, menuWrap);
                    container.appendChild(menuWrap);
                    menuWrap.classList.add('swiper-wrapper');
                    menuWrap.style.flexWrap = 'nowrap';
                    this.swiper = new Swiper(container, {
                        spaceBetween: 0,
                        loopAdditionalSlides: 1,
                    })
                }
            }
        }
        this.updateSwiper();
    }

    removeSwiper() {
        if (!!this.swiper) {
            this.swiper.destroy();
            this.swiper = null;
            this.element.classList.remove('swiper-container');
            this.master.summaryItems.forEach(el => el.classList.remove('swiper-slide'));
            let container = this.element.querySelector('.swiper-container');
            if (!!container) {
                container.parentNode.insertBefore(container.firstChild, container);
                container.parentNode.removeChild(container);
            }
            let menuWrap = this.element.querySelector('.menu');
            if (!!menuWrap) {
                menuWrap.classList.remove('swiper-wrapper');
                menuWrap.style.flexWrap = '';
            }
        }
    }

    updateSwiper() {
        if (!!this.swiper) {
            this.swiper.params.slidesPerView = Math.floor(this.element.offsetWidth / (this.totalItemWidth / this.master.summaryItems.length)); // Item average max in 1 view
            this.swiper.update(); // Update Swiper
        }
    }

    manageSwiper() {
        if (!!this.swiper) this.swiper.slideTo(this.master.currentIndex);
    }
}
