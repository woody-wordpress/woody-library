export default class SummaryAccordion {
    constructor (el) {
        this.element = el;
        this.accordionHeader = this.element.querySelector('.summary-header');
        this.summaryTitle = this.element.querySelector('.summary-title');
        this.summarySwitcher = this.element.querySelector('.summary-switcher');
        this.tabsContent = this.element.querySelector('.tabs-content');
        this.tabsPanelMap = this.element.querySelector('.tabs-panel#tab-map');
        this.tabsPanelList = this.element.querySelector('.tabs-panel#tab-list');
        this.tabsTitleMap = this.element.querySelector('.tabs-title.map');
        this.tabsTitleList = this.element.querySelector('.tabs-title.list');
        this.fixedMapButton = this.element.querySelector('.fixed-map-button');
        this.init();
    }

    init () {
        if (!!this.summaryTitle) this.manageTitle();
        if (!!this.accordionHeader) this.manageAccordionHeader();
        if (!!this.accordionHeader) this.manageClickOut();
        if (!!this.element) this.manageAccordionClose();
        if (!!this.fixedMapButton) this.manageFixedMapButton();
        this.manageScrollToSection();
    }

    manageTitle () {
        let self = this;
        if (window.innerWidth <= 1200) {
            self.summaryTitle.innerHTML = self.summaryTitle.dataset.title; // Ajoute le titre "Sommaire" <= 1200px si aucun titre n'est renseigné
        }
    }

    manageAccordionHeader () {
        let self = this;
        self.accordionHeader.addEventListener('click', (event) => {
            self.element.classList.toggle('open');
            if (!!self.summarySwitcher) self.summarySwitcher.classList.toggle('show');
            if (!!self.tabsContent) self.tabsContent.classList.toggle('open');
            if (!!self.accordionHeader) self.accordionHeader.classList.toggle('open');
            if (!!self.accordionHeader && self.accordionHeader.classList.contains('open') != true) {
                if (!!self.tabsPanelMap) self.tabsPanelMap.classList.remove('is-active');
                if (!!self.tabsPanelList) self.tabsPanelList.classList.add('is-active');
                if (!!self.tabsTitleMap) self.tabsTitleMap.classList.remove('is-active');
                if (!!self.tabsTitleList) self.tabsTitleList.classList.add('is-active');
            }
            event.stopPropagation();
        });
    }

    manageClickOut () {
        let self = this;
        document.addEventListener('click', function (e) {
            if (self.accordionHeader.classList.contains('open')) {
                if (self.accordionHeader.contains(e.target) != true) {
                    self.element.classList.remove('open');
                    if (!!self.summarySwitcher) self.summarySwitcher.classList.remove('show');
                    if (!!self.tabsContent) self.tabsContent.classList.remove('open');
                    if (!!self.accordionHeader) self.accordionHeader.classList.remove('open');
                    if (!!self.tabsPanelMap) self.tabsPanelMap.classList.remove('is-active');
                    if (!!self.tabsPanelList) self.tabsPanelList.classList.add('is-active');
                    if (!!self.tabsTitleMap) self.tabsTitleMap.classList.remove('is-active');
                    if (!!self.tabsTitleList) self.tabsTitleList.classList.add('is-active');
                }
            }
        });
    }

    manageAccordionClose () {
        let self = this;
        self.element.addEventListener('click', (event) => {
            self.element.classList.remove('open');
            if (!!self.summarySwitcher) self.summarySwitcher.classList.remove('show');
            if (!!self.tabsContent) self.tabsContent.classList.remove('open');
            if (!!self.accordionHeader) self.accordionHeader.classList.remove('open');
            if (!!self.tabsPanelMap) self.tabsPanelMap.classList.remove('is-active');
            if (!!self.tabsPanelList) self.tabsPanelList.classList.add('is-active');
            if (!!self.tabsTitleMap) self.tabsTitleMap.classList.remove('is-active');
            if (!!self.tabsTitleList) self.tabsTitleList.classList.add('is-active');
        });
    }

    manageFixedMapClose () {
        let self = this;
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.fixed-map-wrapper') || event.target.closest('.summary-geomap-anchor')) {
                self.fixedMapButton.classList.remove('active');
                self.fixedMapButton.closest('.fixed-map-container').classList.remove('open');
                self.fixedMapButton.nextElementSibling.classList.remove('show');
            }
        });
    };

    manageFixedMapButton () {
        let self = this;
        this.fixedMapButton.addEventListener('click', (event) => {
            // Create a new event and dispatch it
            let toggleSummaryMapEvent = new CustomEvent('toggleSummaryMap');
            self.fixedMapButton.dispatchEvent(toggleSummaryMapEvent);
            self.fixedMapButton.classList.toggle('active');
            self.fixedMapButton.closest('.fixed-map-container').classList.toggle('open');
            self.fixedMapButton.nextElementSibling.classList.toggle('show');
            event.stopPropagation();
            if (self.fixedMapButton.classList.contains('active')) {
                this.manageFixedMapClose();
            }
        });
    }

    manageScrollToSection () {
        if (window.innerWidth <= 1200) {
            let self = this;
            let summaryHeight = self.element.clientHeight;
            self.element.querySelectorAll('.summary-item > [data-section]').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    let target = document.querySelector(`.page-section${el.dataset.section}`) || document.querySelector(`.sheet-part${el.dataset.section}`);
                    window.scrollTo(0, target.offsetTop - summaryHeight);
                }, false);
            });
        }
    }
}
