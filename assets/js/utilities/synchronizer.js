/**
 * @class Synchronizer
 * @author Soheil Saheb-Jamii
 * @classdesc Syncs clicks between two elements.
 * @use import Synchronizer from 'woody-library/assets/js/utilities/synchronizer';
 * @param {HTMLElement} element - The element container to sync clicks between.
 * @param {
 *   selector: string,
 *   switchClass: string, // Can be single string or array of strings or string with space separated classes
 *   initClasses: boolean, // If false, the switchClass won't be added to the element on init (default: true)
 *   swiperEvent: string, // The event to trigger the swiper (default: slideChangeTransitionStart)
 * } params - The first element.
 * @param {function} callback - The callback to call when the target element is clicked.
 * @description = SWIPER = If a swiper is found, the swiper will automatically be synced with the target element.
 * @example new ClickSync(element, {
 *              selector: 'custom-data-click-sync',
 *              switchClass: 'is-active',
 *              initClasses: false,
 *              swiperEvent: 'slideChangeTransitionEnd'
 *          },
 *         function() { Your code here } );
 */
class Synchronizer {
    get syncDataID() {
        return `[${this.selector}="${this._sync_id}"]`;
    }
    set sync_id(element) {
        this.manageTriggeringsClasses(element);
        this._sync_id = element.getAttribute(this.selector);
        if (!this._sync_id) {
            const childEl = element.querySelector(`[${this.selector}]`);
            this._sync_id = !!childEl ? childEl.getAttribute(this.selector) : '';
        }
    }
    get relatedSwipers() {
        return this.element.querySelectorAll('.swiper-container');
    }
    constructor(element, params, callback) {
        this.params = params ? params : {};
        this.callback = callback;
        this.selector = this.params.selector ? this.params.selector : 'click-sync';
        this.element = element;
        this.current_elements = [];
        this.params.switchClass = !!this.params.switchClass ? this.params.switchClass : 'sync-active';
        this.params.switchClass = typeof(this.params.switchClass) == 'string' ? this.params.switchClass.split(' ') : this.params.switchClass;
        this.params.initClasses = this.params.initClasses !== undefined ? this.params.initClasses : true;
        this.params.swiperEvent = this.params.swiperEvent !== undefined ? this.params.swiperEvent : 'slideChangeTransitionStart';
        this.currentAction = null;
        this.init();
    }
    init() {
        let self = this;
        Array.from(this.element.querySelectorAll('['+self.selector+']')).forEach(function(element) {
            element = self.swiperSlideParent(element);
            if ((self.params.initClasses && [...element.parentElement.children].indexOf(element) == 0)
                || element.classList.contains('swiper-slide-active')
                || element.getAttribute('data-swiper-slide-index') === 0) {
                Array.from(self.params.switchClass).forEach(function(className) {
                    element.classList.add(className);
                })
            }
            self.attachEvent(element);
        })
        this.manageSwipers();
        this.element.Synchronizer = this;
    }
    swiperSlideParent(element) {
        if (element.parentElement.classList.contains('swiper-slide')) {
            return element.parentElement;
        } else {
            return element;
        }
    }
    manageTriggeringsClasses(element) {
        // Remove Any other active class
        Array.from(this.element.querySelectorAll('.sync-trigger')).forEach(function(el) {
            el.classList.remove('sync-trigger');
        });
        element.classList.add('sync-trigger');
    }
    manageSwipers() {
        // Check if swiper is found
        let self = this;
        let swipers_containers = this.element.querySelectorAll('.swiper-container');
        self.hasSwipers = swipers_containers.length > 0 ? true : false;

        // On Swiper nav click
        Array.from(this.element.querySelectorAll('.swiper-controls [class*=swiper-button]')).forEach(function(button) {
            button.addEventListener('click', function(event) {
                self.currentAction = 'swipe';
            })
        })
        Array.from(swipers_containers).forEach(function(swiper_container) {
            let click_sync_elements = swiper_container.querySelectorAll(`[${self.selector}]`);
            if (!!click_sync_elements.length) {
                // First activate a tick var so others events don't trigger 9999times / second
                let swiper_moving = false;
                swiper_container.swiper.on('touchStart', function(event) {
                    self.currentAction = 'swipe';
                })
                swiper_container.swiper.on('slideChangeTransitionStart', function(event) {
                    swiper_moving = true;
                })
                // When swiper is moved, change the target element (will tick only once)
                swiper_container.swiper.on(self.params.swiperEvent, function(e, a) {
                    if (swiper_moving) {
                        swiper_moving = false;
                        let swiper_slide = swiper_container.querySelector('.swiper-slide-active');
                        self.sync_id = swiper_slide;
                        let attr = swiper_slide.getAttribute(self.selector);
                        attr = attr ? attr : swiper_slide.querySelector(`[${self.selector}]`).getAttribute(self.selector);
                        let targets_elements = self.element.querySelectorAll(`[${self.selector}="${attr}"]`);
                        self.manageClasses(targets_elements);
                        self.swiperChange(swiper_slide);
                    }
                })
            }
        });
    }
    attachEvent(element) {
        let self = this;
        element.addEventListener('click', function(event) {
            if (!self.currentElIsActive(event)) { // If element is clicked once
                event.preventDefault();
                self.onClick(event);
                return false;
            } else { // If element is clicked twice
                return true;
            }
        })
    }
    currentElIsActive(event) {
        let self = this;
        let $return = false;
        // If current element has already been clicked (and means it is currently beeing clicked a second time), return true
        Array.from(this.current_elements).forEach(function(element) {
            if (event.currentTarget == self.swiperSlideParent(element)) {
                $return = true;
            }
        })
        return $return;
    }
    onClick(event) {
        let self = this;
        self.currentAction = 'click';
        let event_el = event.currentTarget;
        self.sync_id = event_el;
        let targets_elements = this.element.querySelectorAll(this.syncDataID);
        // If switchClass is defined in parameters, add it to the targets elements
        if (!self.hasSwipers) {
            this.manageClasses(targets_elements);
        }
        // If swiper is found, change swiper
        this.swiperChange();
        // Sync Target Elements
        Array.from(targets_elements).forEach(function(target_element) {
            if (target_element != event_el) {
                // If a callback is defined, call it
                if (self.callback) {
                    self.callback({event_el, target_element});
                }
            }
        })
    }
    manageClasses(targets_elements) {
        let self = this;
        self.current_elements = targets_elements;
        // Remove Any other active class
        Array.from(self.element.querySelectorAll('.' + self.params.switchClass)).forEach(function(element) {
            element.classList.remove(...self.params.switchClass);
        });
        // Add active class
        Array.from(targets_elements).forEach(function(target_element) {
            target_element.classList.add(...self.params.switchClass);
        })
    }
    swiperChange() {
        let self = this;
        this.relatedSwipers.forEach(function(swiper_container) {
            let selector = swiper_container.querySelector('.sync-trigger');
            if (!selector) {
                selector = swiper_container.querySelector(self.syncDataID);
                selector = self.swiperSlideParent(selector); // Check if parent has slide class
            }
            let index = [...selector.parentElement.children].indexOf(selector);
            let speed = swiper_container.swiper.params.speed;
            swiper_container.swiper.slideTo(index, speed);
        })
    }
}

export default Synchronizer;
