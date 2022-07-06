import WoodyFilter from './filter';

const body = document.querySelector('body');
const headnavs = document.querySelector('.woody-component-headnavs');
const header = document.querySelector('.woody-component-header');
const mobileMenu = document.querySelector('.woody-component-mobile-menu');
const slidingMenu = document.querySelector('.sliding-menu');
const burgerButtonDesktop = document.querySelector('.woody-component-headnavs button.menu-icon');
const menuItems = document.querySelectorAll('.menu-item.is-submenu-parent');
const submenuGrids = document.querySelectorAll('.submenu-grid');

if (body.classList.contains('menus-v2')) {

    if (headnavs !== null) {
        if (window.innerWidth >= 1200) {
            body.addEventListener('click', () => {
                if (header !== null && !header.classList.contains('woody-burger')) {
                    closeMainMenu();
                }
            });
        }

        let headerHeight = headnavs.offsetHeight;
        let headerHeightFull = headerHeight + 30 + 'px';

        if (document.querySelectorAll('.submenu-wrapper').length > 0) {
            document.querySelectorAll('.submenu-wrapper').forEach(item => {
                item.addEventListener('click', event => {
                    event.stopPropagation();
                });

                if (slidingMenu !== null) {
                    item.style.setProperty('height', `calc(100vh - ${headerHeightFull})`);
                }
            });
        }

        if (slidingMenu !== null) {
            let slidingMenuPosition = headerHeight + 'px';

            slidingMenu.style.setProperty('top', `${slidingMenuPosition}`);
            slidingMenu.style.setProperty('height', `calc(100vh - ${slidingMenuPosition})`);
        }
    }

    document.querySelectorAll('.menu-item.is-submenu-parent > a').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();

            // Prevent click on link to close mainmenu
            event.stopPropagation();

            let targetLink = event.currentTarget;
            let targetSubmenu = targetLink.nextElementSibling;
            let submenus = document.querySelectorAll('.submenu-wrapper');

            body.classList.add('menu-is-open');

            if (targetSubmenu.classList.contains('submenu-active') && header !== null && !header.classList.contains('woody-burger')) {
                targetSubmenu.closest('.is-submenu-parent').classList.remove('is-active');
                targetSubmenu.classList.remove('submenu-active');
                body.classList.remove('menu-is-open');
            } else {
                targetSubmenu.closest('.is-submenu-parent').classList.add('is-active');
                targetSubmenu.classList.add('submenu-active');
            }

            submenus.forEach((submenu) => {
                if (submenu !== targetSubmenu) {
                    submenu.closest('.is-submenu-parent').classList.remove('is-active');
                    submenu.classList.remove('submenu-active');
                }
            });

            header !== null ? header.classList.add('submenu-open') : '';
        });
    });

    // Add index on each submenu item for 'one-by-one' animation type
    if (submenuGrids.length > 0) {
        submenuGrids.forEach(grid => {
            if (grid.classList.contains('one-by-one')) {
                let submenuItemsDelay = grid.querySelectorAll('.submenu-item-delay');
                let submenuItemIndex = 0;

                if (submenuItemsDelay.length > 0) {
                    submenuItemsDelay.forEach(submenuItemDelay => {
                        submenuItemIndex++;
                        submenuItemDelay.classList.add(`submenu-item-${submenuItemIndex}`);
                    });
                }
            }
        });
    }

    /**
     * Closes the active submenu and returns the main menu to its initial state
     */
    function closeMainMenu() {
        if (body.classList.contains('menu-is-open')) {
            let submenuParentActive = document.querySelector('.is-submenu-parent.is-active');

            if (submenuParentActive) {
                let submenuActive = submenuParentActive.querySelector('.submenu-wrapper.submenu-active');

                if (submenuActive) {
                    submenuParentActive.classList.remove('is-active');
                    submenuActive.classList.remove('submenu-active');
                }
            }

            body.classList.remove('menu-is-open');
            header !== null ? header.classList.remove('submenu-open') : '';

            document.querySelectorAll('button.menu-icon').forEach(burgerButton => {
                if (burgerButton && burgerButton.classList.contains('open')) {
                    burgerButton.classList.remove('open');
                }
            });
        }
    }

    /**
     * Closes the active submenu and returns the main menu to its initial state when body is scrolling down or when "Escape" key is pressed
     */
    var scrollHideMenuModifier = WoodyFilter.apply('scroll_hide_menu_modifier');
    scrollHideMenuModifier = typeof scrollHideMenuModifier === 'undefined' ? true : scrollHideMenuModifier;

    if (scrollHideMenuModifier != false) {
        // Close on scroll
        window.addEventListener('scroll', () => {
            if (body.classList.contains('scrolling-down') && window.innerWidth >= 1200) {
                closeMainMenu();
            }
        });
    }

    // Close on press "Escape"
    document.addEventListener('keydown', event => {
        if ((event.key == 'Escape' || event.key == 'Esc')) {
            closeMainMenu();
        }
    });

    // Click on button.menu-icon (burger menu icon)
    document.querySelectorAll('button.menu-icon').forEach(burgerButton => {
        burgerButton.addEventListener('click', event => {
            event.stopPropagation();

            if (!burgerButton.classList.contains('open')) {
                lazySizes.autoSizer.checkElems(); // resize imgs with right sizes
            }

            burgerButton.classList.toggle('open');
            body.classList.toggle('menu-is-open');
            header !== null ? header.classList.toggle('submenu-open') : '';

            if (slidingMenu !== null) {
                let slidingMenuWidth = slidingMenu.offsetWidth + 'px';

                if (document.querySelectorAll('.submenu-wrapper').length > 0) {
                    document.querySelectorAll('.submenu-wrapper').forEach(item => {
                        item.style.setProperty('width', `calc(100vw - ${slidingMenuWidth})`);
                    });
                }
            }
        });
    });

    if (mobileMenu !== null) {
        let button = mobileMenu.querySelector('button.menu-icon');

        if (button !== null) {
            button.addEventListener('click', () => {
                body.classList.toggle('mobile-menu-open');
            });
        }
    }
}

/**
 * Creates an event on element
 *
 * @param {object} element
 * @param {string} eventType
 */
function eventFire(element, eventType) {
    let eventObject = new Event(eventType, {
        "bubbles": true,
        "cancelable": true
    });
    element.dispatchEvent(eventObject);
}

/**
 * Opens the right submenu when burger button is clicked : if a .menu-item.is-submenu-parent has .is-active, we take its .menuLink, else we take the first .menuLink of the .main-menu-list
 */
function openTheRightSubmenu() {
    let isOpenOnce = true;

    if (burgerButtonDesktop !== null && menuItems.length > 0) {
        burgerButtonDesktop.addEventListener('click', () => {
            let menuIsOpen = body.classList.contains('menu-is-open');

            if (isOpenOnce && menuIsOpen && menuItems.length > 0) {
                let menuItemActive = document.querySelector('.menu-item.is-submenu-parent.is-active');
                let menuLinkActive = null;

                if (menuItemActive !== null) {
                    menuLinkActive = menuItemActive.querySelector('.menuLink');
                } else {
                    menuLinkActive = menuItems[0].querySelector('.menuLink');
                }

                isOpenOnce = false;
                eventFire(menuLinkActive, 'click');
            }
        });
    }
}

openTheRightSubmenu();
