(function() {
    class CircularProgressBar {
        constructor(element) {
            this.element = element;
            this.fill = this.element.getElementsByClassName('circle-fill')[0];
            this.fillLength = this.getProgressBarFillLength(this);
            this.label = this.element.getElementsByClassName('open');
            this.value = parseInt(this.element.getAttribute('data-progress'));
            this.open = parseInt(this.element.getAttribute('data-open'));
            this.total = parseInt(this.element.getAttribute('data-total'));
            this.animate = this.element.hasAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on';
            this.animationDuration = this.element.hasAttribute('data-duration') ? this.element.getAttribute('data-duration') : 1000;
            this.animationId = false;

            this.initProgressBar(this);
        }

        initProgressBar(progressBar) {
            // Init dashOffset
            this.setShapeOffset(progressBar);

            // Init progressBar color
            this.animateProgressBar(progressBar);
            setTimeout(function() { progressBar.element.classList.add('init'); }, 30);

            // Update progressBar
            progressBar.element.addEventListener('updateProgress', function(event) {
                var start = this.getProgressBarValue(progressBar),
                    final = event.detail.value,
                    duration = (event.detail.duration) ? event.detail.duration : progressBar.animationDuration;

                this.updateProgressBar(progressBar, start, final, duration);
            });
        };

        updateProgressBar(progressBar, start, to, duration) {
            var change = to - start,
                currentTime = null;

            var animateFill = function(timestamp) {
                if (!currentTime) currentTime = timestamp;
                var progress = timestamp - currentTime;
                var val = parseInt((progress / duration) * change + start);

                if (change > 0 && val > to) val = to;
                if (change < 0 && val < to) val = to;

                progressBar.setProgressBarValue(progressBar, val);
                if (progress < duration) {
                    progressBar.animationId = window.requestAnimationFrame(animateFill);
                } else {
                    progressBar.animationId = false;
                }
            };
            if (window.requestAnimationFrame) {
                progressBar.animationId = window.requestAnimationFrame(animateFill);
            } else {
                progressBar.setProgressBarValue(progressBar, to);
            }
        };

        setShapeOffset(progressBar) {
            var center = progressBar.fill.getAttribute('cx');
            progressBar.fill.setAttribute('transform', "rotate(-90 " + center + " " + center + ")");
            progressBar.fill.setAttribute('stroke-dashoffset', progressBar.fillLength);
            progressBar.fill.setAttribute('stroke-dasharray', progressBar.fillLength);
        };

        animateProgressBar(progressBar) {
            // Reset
            progressBar.setProgressBarValue(progressBar, 0);

            // Launch the animation when it is visible
            var observer = new IntersectionObserver(progressBar.progressBarObserve.bind(progressBar), { threshold: [0, 0.1] });
            observer.observe(progressBar.element);
        };

        progressBarObserve(entries) {
            if (entries[0].intersectionRatio.toFixed(1) > 0 && !this.animationTriggered) {
                this.updateProgressBar(this, 0, this.open, this.animationDuration);
            }
        };

        getProgressBarFillLength(progressBar) {
            return parseFloat(2 * Math.PI * progressBar.fill.getAttribute('r')).toFixed(2);
        };

        getProgressBarValue(progressBar) {
            return (100 - Math.round((parseFloat(progressBar.fill.getAttribute('stroke-dashoffset')) / progressBar.fillLength) * 100));
        };

        setProgressBarValue(progressBar, value) {
            var percent = value / progressBar.total * 100,
                offset = ((100 - percent) * progressBar.fillLength / 100).toFixed(2);

            progressBar.fill.setAttribute('stroke-dashoffset', offset);
            if (progressBar.label.length > 0) progressBar.label[0].textContent = value;
        };
    }

    // Init CircularProgressBar objects
    var circularProgressBars = document.getElementsByClassName('circular-progressbar');

    if (circularProgressBars.length > 0) {
        for (var i = 0; i < circularProgressBars.length; i++) {
            (function(i) { new CircularProgressBar(circularProgressBars[i]); })(i);
        }
    }
}());
