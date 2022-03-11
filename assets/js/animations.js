(function() {
    // Récupération du style et de l'activation des animations dans le sous-thème
    let style = getComputedStyle(document.body),
        animSubtheme = style.getPropertyValue('--animSubtheme').replace(/\s/g, '');

    // Si les animations sont activées dans le sous-thème
    if (animSubtheme) {
        // Test des sections : ajout des classes aux woody-component si la section possède un data-animate
        let sections = Array.from(document.getElementsByClassName('section'));
        for (let section of sections) {
            // Si les sections contiennent un data-animate
            if (section.dataset.animate) {
                let animations = section.dataset.animate.split(', '),
                    sectionComponents = section.getElementsByClassName('woody-component');

                // Ajout des classes d'animations aux woody components de la section dans l'ordre du data-animate
                for (let [key, sectionComponent] of Object.entries(sectionComponents)) {
                    if (animations[key] != "false") {
                        sectionComponent.classList.add(animations[key]);
                    }
                }
            }
        }

        // Récupération des classes d'animations et de loading passées en scss
        let animClasses = style.getPropertyValue('--animList').split(','),
            animTrigger = style.getPropertyValue('--animTrigger').replace(/\s/g, ''),
            animTreshold = style.getPropertyValue('--animTreshold').replace(/\s/g, '');

        // Options de l'observer
        const observerOptions = {
            root: null,
            threshold: animTreshold,
            rootMargin: '0px 0px -50px 0px'
        };

        // Observer, ajoute la classe de lancement d'animation à l'arrivée d'un woodyComponent
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(animTrigger);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Si au moins un woodyComponent contient une des classes de la liste, on lance l'observer sur ce woodyComponent
        function testClassesAndObserve() {
            for (let animClass of animClasses) {
                animClass = animClass.replace(/\s/g, '');
                const woodyComponents = Array.from(document.getElementsByClassName(animClass));

                // S'il y a au moins un woodyComponent qui contient une animation, on lance l'observer
                if (woodyComponents[0]) {
                    for (let woodyComponent of woodyComponents) {
                        observer.observe(woodyComponent);
                    }
                }
            }
        }

        // Init de la fonction d'observation
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', testClassesAndObserve);
        } else {
            testClassesAndObserve();
        }
    }
}());
