export default class SummaryAccordion {
    constructor(el) {
        this.element = el;
        this.accordionButton = this.element.querySelector('.summary-accordion-button');
        this.fixedMapButton = this.element.querySelector('.fixed-map-button');
        this.summarySwitcher = this.element.querySelector('.summary-switcher');
        this.tabsContent = this.element.querySelector('.tabs-content');
        this.init();
    }

    init() {
        if (!!this.accordionButton) this.manageAccordionButton();
        if (!!this.fixedMapButton) this.manageFixedMapButton();
        if (!!this.element) this.manageAccordionClose();
    }

    manageAccordionButton() {
        let self = this;
        this.accordionButton.addEventListener('click', (event) => {
            self.element.classList.toggle('open');
            if (!!self.summarySwitcher) self.summarySwitcher.classList.toggle('show');
            if (!!self.tabsContent) self.tabsContent.classList.toggle('open');
            self.accordionButton.classList.toggle('open');
            event.stopPropagation();
        });
    }

    manageFixedMapButton() {
        let self = this;
        this.fixedMapButton.addEventListener('click', (event) => {
            // Create a new event and dispatch it
            let ToggleSummaryMapEvent = new CustomEvent('toggleSummaryMap');
            self.fixedMapButton.dispatchEvent(ToggleSummaryMapEvent);
            self.fixedMapButton.classList.toggle('active');
            self.fixedMapButton.closest('.fixed-map-container').classList.toggle('open');
            self.fixedMapButton.nextElementSibling.classList.toggle('show');
            event.stopPropagation();
            if(self.fixedMapButton.classList.contains('active')){
               this.manageFixedMapClose();
            }

        });
    }

    manageAccordionClose() {
        let self = this;
        self.element.addEventListener('click', (event) =>{
            self.element.classList.remove('open');
            if (!!self.summarySwitcher) self.summarySwitcher.classList.remove('show');
            if (!!self.tabsContent) self.tabsContent.classList.remove('open');
            if (!!self.accordionButton) self.accordionButton.classList.remove('open');
        });
    }

    manageFixedMapClose() {
        let self = this;
        document.addEventListener('click', (event) =>{
            if (!event.target.closest(".fixed-map-wrapper ") || event.target.closest(".summary-geomap-anchor"))  {
                self.fixedMapButton.classList.remove('active');
                self.fixedMapButton.closest('.fixed-map-container').classList.remove('open');
                self.fixedMapButton.nextElementSibling.classList.remove('show');
            }
        });
    }
}
