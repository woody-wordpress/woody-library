export default class Forms {
    constructor() {
        this.init();
    }

    init() {
        const forms = document.querySelectorAll('form');
        forms.forEach((form) => {
            if (form) {

                // Init form
                form.classList.add('accessibility-mode');
                const inputs = form.querySelectorAll('input');
                const textareas = form.querySelectorAll('textarea');
                const champs = [...inputs, ...textareas];

                if (champs) {
                    champs.forEach((input) => {
                        if (!form.querySelector('label[for="' + input.id + '"]')) {
                            // Create a new receveir for the input
                            let span = document.createElement('span');
                            span.classList.add('input-wrapper');

                            // Duplicate and add the input into the new recevier
                            let duplicateInput = input.cloneNode(true);
                            span.appendChild(duplicateInput);

                            // Add the new recevier in DOM and remove old input
                            input.parentElement.insertBefore(span, input);
                            input.remove();

                            // Create a new label for the input
                            if (duplicateInput.placeholder) {
                                duplicateInput.closest('span').dataset.content = input.placeholder;
                                duplicateInput.setAttribute('aria-label', input.placeholder);
                                duplicateInput.addEventListener('focus', () => {
                                    duplicateInput.closest('span').classList.add('active-input');
                                });
                                duplicateInput.addEventListener('blur', () => {
                                    if (duplicateInput.value === '') {
                                        duplicateInput.closest('span').classList.remove('active-input');
                                    }
                                });
                            }
                        }
                    });
                }
            }
        })

    }
}
