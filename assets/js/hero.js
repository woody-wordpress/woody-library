(function() {
    class Hero {
        constructor(element) {
            this.hero = element;
            this.heroMedia = element.getElementsByClassName('heroMediaWrapper')[0];
            this.teaser = document.getElementsByClassName('woody-component-teaser')[0];
            this.rootStyle = window.getComputedStyle(document.documentElement);

            if (this.heroMedia) {
                this.updateHeight();
            }
        }

        updateHeight() {
            var teaserHeight = this.teaser.getBoundingClientRect().height,
                teaserOverflow = this.rootStyle.getPropertyValue('--hero-gradient-teaser-overflow'),
                heroGradientSize = this.rootStyle.getPropertyValue('--hero-gradient-size');

            if (teaserOverflow == 'true') {
                this.heroMedia.style.setProperty('height', 'calc(100vh + ' + heroGradientSize + ' + ' + teaserHeight + 'px)');
            } else {
                this.heroMedia.style.setProperty('height', 'calc(100vh + ' + heroGradientSize);
            }
        }
    }

    // Init
    if (window.innerWidth > 640) {
        const woodyComponent = document.getElementsByClassName('woody-component-hero fadingHero');
        if (woodyComponent.length > 0) {
            new Hero(woodyComponent[0]);
        }
    }

}());
