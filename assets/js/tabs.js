import $ from 'jquery';

if (window.innerWidth <= 768) {
    $('.woody-component-tabs').each(function () {
        var elem = $(this).find('.tabs');
        var tabs = elem.find('.tab-link');
        elem.on('click', function () {
            if ($(this).hasClass("is-open")) {
                $(this).removeClass('is-open');
            } else {
                $(this).addClass("is-open");
            }
        });
        tabs.on('click', function () {
            elem.removeClass('is-open');
        });
    });
}

// Création d'un tooltip pour le TPL_04
let swiperTabsComponents = document.querySelectorAll('.woody-component-tabs.tabs-swiper');
if (swiperTabsComponents) {

    swiperTabsComponents.forEach((swiperTabs) => {

        // Récupération des deux flèches de navigation
        let slide_next = swiperTabs.querySelector('.swiper-button-next');
        let slide_prev = swiperTabs.querySelector('.swiper-button-prev');

        slide_next != null ? manageTooltipBox(slide_prev, 'prev') : '';
        slide_prev != null ? manageTooltipBox(slide_next, 'next') : '';

        // Création, gestion & suppression du tooltip
        function manageTooltipBox(element, direction) {
            let tooltipClass = `slide-tooltip-${direction}`;

            let contentBox = document.createElement('aside');
            contentBox.classList.add(tooltipClass);

            let icon = document.createElement('span');
            icon.classList.add('wicon');

            let name = document.createElement('span');
            name.classList.add('tooltip-name');

            contentBox.appendChild(icon);
            contentBox.appendChild(name);
            element.appendChild(contentBox);

            if (element) {
                element.addEventListener('mouseenter', () => {
                    icon.removeAttribute('class');
                    icon.classList.add('wicon');
                    icon.classList.add(swiperTabs.querySelector(`.swiper-slide-${direction}`).dataset.icon);
                    name.textContent = swiperTabs.querySelector(`.swiper-slide-${direction}`).dataset.title;
                    element.classList.add('tooltip-visible');
                });

                element.addEventListener('mouseleave', () => {
                    element.classList.remove('tooltip-visible');
                });

                element.addEventListener('click', () => {
                    icon.removeAttribute('class');
                    icon.classList.add('wicon');

                    if( swiperTabs.querySelector('.swiper-slide-visible').classList.contains('swiper-slide-duplicate')){
                        if (direction === 'next') {
                            icon.classList.add(swiperTabs.querySelector('.swiper-slide-duplicate-active').nextElementSibling.dataset.icon);
                            name.textContent = swiperTabs.querySelector('.swiper-slide-duplicate-active').nextElementSibling.dataset.title;
                        }
                        else {
                            icon.classList.add(swiperTabs.querySelector('.swiper-slide-duplicate-active').previousElementSibling.dataset.icon);
                            name.textContent = swiperTabs.querySelector('.swiper-slide-duplicate-active').previousElementSibling.dataset.title;
                        }

                    }
                    else {
                        icon.classList.add(swiperTabs.querySelector(`.swiper-slide-${direction}`).dataset.icon);
                        name.textContent = swiperTabs.querySelector(`.swiper-slide-${direction}`).dataset.title;
                    }
                });
            }
        }
    });
}
