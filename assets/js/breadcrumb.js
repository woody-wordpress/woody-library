const breadcrumb = document.querySelector('.woody-component-breadcrumb');

/**
 * Replace link label of given element in breadcrumb when window < 768px
 * 
 * @param {*} element
 */
function replaceBreadcrumbLabel(element) {
    element.innerHTML = '[...]';
}

/**
 * Hide all links in breadcrumb except the first and last links when window < 768px
 */
if (window.innerWidth < 768) {
    if (breadcrumb) {
        var items = breadcrumb.querySelectorAll('li');
        var separators = breadcrumb.querySelectorAll('span.wicon');

        if (items.length > 2) {
            // Add '[...]' instead of full label to prevent long page titles
            replaceBreadcrumbLabel(items[items.length - 2].querySelector('span'));

            for (var i = 1; i < items.length - 2; i++) {
                items[i].style.display = 'none';
                separators[i].style.display = 'none';
            }
        }
    }
}
