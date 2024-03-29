import WoodyFilter from '../filter';
import SummaryAccordion from './ext_accordion';

export default class Summary {
    constructor (el) {
        this.element = el;
        this.offset = this.element.getBoundingClientRect().top + document.documentElement.scrollTop;
        this.summaryItems = this.element.querySelectorAll('.summary-item');
        this.sections = [];
        this.scrollPos = 0;
        this.currentSection;
        this.offsetRatio;
        this.currentIndex = 0;
        this.init();
    }

    init () {
        this.trigger('summary:init');
        this.setOffsetRatio();
        this.manageSections();
        this.events();
        this.loadChildClasses();
        this.fixedSummarySize();
        this.hideFixedSummary();
        this.manageScrollToSection();
    }

    // ******** Run Classes ********
    loadChildClasses () {
        if (this.element.classList.contains('summary-accordion')) new SummaryAccordion(this.element);
    }

    setOffsetRatio () {
        this.offsetRatio = window.innerHeight / 4;
    }

    manageSections () {
        let self = this;
        this.element.querySelectorAll('.summary-item > [data-section]').forEach(el => {
            self.sections.push({
                id: el.dataset.section,
                element: document.querySelector(el.dataset.section),
            })
        })
    }

    scrollEvent () {
        //TODO: REFAC: This should be into a Singleton
        let self = this;
        let lastKnownScrollPosition = 0;
        let ticking = false;
        window.addEventListener('scroll', function (e) {
            lastKnownScrollPosition = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    self.scrollPos = lastKnownScrollPosition;
                    self.scrolling();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    events () {
        let self = this;
        // On Scroll
        this.scrollEvent();
        // On Resize
        let resize;
        window.onresize = function () {
            clearTimeout(resize);
            resize = setTimeout(function () {
                self.setOffsetRatio();
                self.manageActiveSection();
                self.trigger('summary:resized');
            }.bind(self), 100);
        }
    }

    // Self class Events
    on (event, callback) {
        this.element.addEventListener(event, callback);
    }

    trigger (event) {
        this.element.dispatchEvent(new Event(event));
    }

    scrolling () {
        if (this.element.classList.contains('fixed-summary')) this.manageFixedSummary();
        this.manageActiveSection();
        this.trigger('summary:scrolling');
    }

    manageFixedSummary () {
        let adminbar = document.querySelector('#wpadminbar') ? document.querySelector('#wpadminbar').offsetHeight : 0;
        let summary_offset_modifier = WoodyFilter.apply('summary_offset_modifier', 0); //Hook var
        if (this.scrollPos - summary_offset_modifier >= this.offset - adminbar) {
            WoodyFilter.apply('summary_start_fixed', this.element); //Hook function
            this.element.classList.add('isFixed');
            this.trigger('summary:fixed:start');
        } else {
            WoodyFilter.apply('summary_stop_fixed', this.element); //Hook function
            this.element.classList.remove('isFixed');
            this.trigger('summary:fixed:stop');
        }
    }

    manageActiveSection () {
        let self = this;
        let index = 0;
        this.sections.forEach(section => {
            if (section.element !== null) {
                let screenOffset = section.element.getBoundingClientRect();
                if (screenOffset.top <= 0 + self.offsetRatio && screenOffset.bottom >= 0 + self.offsetRatio) {
                    if (self.currentSection !== section.id) {
                        self.currentSection = section.id;
                        let oldActive = self.element.querySelector('.summary-item [data-section].active');
                        let newActive = self.element.querySelector('[data-section="' + section.id + '"]');
                        if (!!oldActive) {
                            oldActive.classList.remove('active');
                            oldActive.closest('.summary-item').classList.remove('active');
                        }
                        if (!!newActive) {
                            newActive.classList.add('active');
                            newActive.closest('.summary-item').classList.add('active');
                            self.currentIndex = index;
                            self.trigger('summary:section:changed');
                        }
                    }
                }
            }
            index++;
        })
    }

    fixedSummarySize () {
        if ((this.element.classList.contains('fixed-summary')) && (window.innerWidth >= 1200)) {
            // Si c'est un fixed-summary au dessus de 1200 OU un summary accordion en dessous de 1200
            let summaryContainer = this.element.closest('.cell');
            // Ajout de la height de base à son container pour éviter le saut du contenu au scroll
            if (summaryContainer !== null) {
                summaryContainer.style.height = summaryContainer.offsetHeight + 'px';
            }
        }
    }

    hideFixedSummary () {
        // Dans le cas d'un fixed summary qui ne se fixe pas en haut de page
        if (this.element.classList.contains('fixed-summary') && !this.element.classList.contains('fixedTop')) {
            let self = this,
                pageFooter = document.querySelector('.site-footer-container'),
                sections = document.querySelectorAll('.page-section');
            let pageLastSection = sections[sections.length - 1];

            if (pageLastSection != null && pageFooter != null) {
                window.addEventListener('scroll', () => {
                    // Au moment où la dernière section est vue
                    if (self.isVisible(pageLastSection)) {
                        // Ajout d'une classe pour que le sommaire ait une transition a l'arrivée du footer (et pas avant)
                        self.element.classList.add('summary-visibility-transition');
                    } else {
                        self.element.classList.remove('summary-visibility-transition');
                    }

                    // Au moment où le footer est vu
                    if (self.isVisible(pageFooter)) {
                        // Ajout d'une classe pour cacher le sommaire
                        self.element.classList.add('hide-summary');
                    } else {
                        self.element.classList.remove('hide-summary');
                    }
                });
            }
        }
    }

    isVisible (element) {
        let bounding = element.getBoundingClientRect();

        if ((bounding.top > 0 || bounding.bottom > 0) && bounding.top < (window.innerHeight || document.documentElement.clientHeight)) {
            return true;
        } else {
            return false;
        }
    }

    manageScrollToSection () {
        if (window.innerWidth >= 1200) {
            // Déclaration des variables globales
            let self = this,
                allHeight = 0;

            // Definition des fonctions globales
            function getSummaryHeight () {
                return self.element.clientHeight;
            }
            function getNavigationHeight () {
                return document.querySelector('.woody-component-headnavs').clientHeight;
            }

            // Si Summary fixée en haut (TPL_01)
            if (self.element.classList.contains('fixedTop')) {
                self.element.querySelectorAll('.summary-item > [data-section]').forEach(el => {
                    el.addEventListener('click', (e) => {

                        // Récupération de l'ancre
                        let target = document.querySelector(`.page-section${el.dataset.section}`) || document.querySelector(`.sheet-part${el.dataset.section}`);
                        e.preventDefault();

                        if (target !== null) {
                            // Si scroll-down
                            if (document.querySelector('body.scrolling-down')) {
                                if (self.element.classList.contains('isFixed')) {
                                    if (target.offsetTop < window.pageYOffset) {
                                        allHeight = getSummaryHeight() + getNavigationHeight();
                                    }
                                    else {
                                        allHeight = getSummaryHeight();
                                    }
                                }
                                else {
                                    allHeight = getSummaryHeight();
                                }
                            }
                            // Si scroll-up
                            else if (document.querySelector('body.scrolling-up')) {
                                if (target.offsetTop > window.pageYOffset) {
                                    allHeight = getSummaryHeight();
                                }
                                else {
                                    allHeight = getSummaryHeight() + getNavigationHeight();
                                }
                            }
                            window.scrollTo(0, target.offsetTop - allHeight);
                        }
                    });
                });
            }

            // Si Summary fixée sur le coté (TPL_02 / TPL_03)
            if (self.element.classList.contains('fixed-summary')) {
                self.element.querySelectorAll('.summary-item > [data-section]').forEach(el => {
                    el.addEventListener('click', (e) => {

                        // Récupération de l'ancre
                        let target = document.querySelector(`.page-section${el.dataset.section}`) || document.querySelector(`.sheet-part${el.dataset.section}`);
                        e.preventDefault();

                        if (target !== null) {
                            // Si scroll-down
                            if (document.querySelector('body.scrolling-down')) {
                                if (self.element.classList.contains('isFixed')) {
                                    if (target.offsetTop < window.pageYOffset) {
                                        allHeight = getNavigationHeight();
                                    }
                                }
                            }

                            // Si scroll-up
                            else if (document.querySelector('body.scrolling-up')) {
                                if (target.offsetTop < window.pageYOffset) {
                                    allHeight = getNavigationHeight();
                                }
                            }
                            window.scrollTo(0, target.offsetTop - allHeight);
                        }
                    });
                });
            }
        }
    }
}
