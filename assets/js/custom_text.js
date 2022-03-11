import WoodyFilter from './filter';


/**
 * SHOW MORE BUTTON
 */

const customTextShowMore = document.querySelectorAll('.woody-component-custom-text.has-show-more-button');

if (customTextShowMore) {
    customTextShowMore.forEach(function(component){

        var componentLabelClose = component.getAttribute('data-show-more-title-close');
        var componentLabelOpen = component.getAttribute('data-show-more-title-open');
        var textComponent = component.querySelector('div >.cell');
        var linkShowMore = document.createElement('a');
        var linkTextShowMore = document.createTextNode(componentLabelClose);
        var showMoreButtonMinHeight = 150;

        /**
         * Add show more button
         */
        if (textComponent.offsetHeight > showMoreButtonMinHeight){
            linkShowMore.appendChild(linkTextShowMore);
            linkShowMore.title = componentLabelClose;
            linkShowMore.classList.add("showMoreButton");
            component.appendChild(linkShowMore);

            /**
             *Event on click of button linkShowMore
             */
            component.querySelector('.showMoreButton').addEventListener('click', () => {
                component.classList.toggle('show-more-button-open');
                if( component.classList.contains('show-more-button-open')){
                    linkShowMore.title = componentLabelOpen;
                    linkShowMore.textContent = componentLabelOpen;
                }else{
                    linkShowMore.title = componentLabelClose;
                    linkShowMore.textContent = componentLabelClose;
                }
            });
        }

    });
}


