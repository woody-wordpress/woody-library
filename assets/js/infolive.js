import $ from 'jquery';

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

    class ZoneDisplay {
        constructor(element) {
            this.element = element; 
            this.zoneBtnList = this.element.getElementsByClassName('infolive-zones-select-wrapper');

            this.initZoneDisplay(this);
        }
        /**
         * @function each
         * @param {Array} elem Array of dom objects
         * @param {function} callback function
         */
        each(elem, callback) {
            for (let index = 0; index < elem.length; index++) {
                const element = elem[index];
                callback(element, this);                
            }
        }
        initZoneDisplay(zone) {    
            this.each(this.zoneBtnList, function(elem, zone) {
                zone.eventClick(elem, zone);                
            })
        }
        /**
         * @event eventClick On click a zone btn
         * @param {Array} btn Array of DOM Objects
         * @param {Object} zone The class Object
         */
        eventClick(btn, zone) {
            zone.each(btn.getElementsByClassName('infolive-zone'), function(btn, zone) {
                btn.onclick = function(el) {
                    if (!btn.classList.contains('active')) {
                        var displayzone = btn.getAttribute('data-zone');
                        var boards = zone.element.getElementsByClassName('infolive-infos-board');
                        var activeboard = zone.find(boards, 'active')[0];
                        var newboard = zone.find(boards, displayzone)[0];
                        var activebtn = zone.find(zone.zoneBtnList, 'active')[0];
                        //Toggling class
                        activeboard.classList.remove('active');
                        activeboard.classList.add('hide');
                        newboard.classList.remove('hide');
                        newboard.classList.add('active');
                        activebtn.classList.remove('active');
                        btn.classList.add('active');
                    } 
                }
            });
        }
        find(element, classstr) {
            var ret = [];
            var zone = this;
            this.each(element, function(elem) {
                if (elem.classList.contains(classstr)) {
                    ret.push(elem);
                }
            })
            if (ret.length == 0) {
                this.each(element, function(elems) {
                    ret = zone.find(elems.children, classstr);
                });      
            }
            return ret;
        }
    }

    // Init CircularProgressBar objects
    var circularProgressBars = document.getElementsByClassName('circular-progressbar');

    if (circularProgressBars.length > 0) {
        for (var i = 0; i < circularProgressBars.length; i++) {
            (function(i) { new CircularProgressBar(circularProgressBars[i]); })(i);
        }
    }

    // Init ZoneDisplay objects
    var ZoneDisplayLive = document.getElementsByClassName('woody-component-infolive');
    if ((ZoneDisplayLive.length > 0) && ZoneDisplayLive[0].classList.contains('tpl_03')) {
        for (var i = 0; i < ZoneDisplayLive.length; i++) {
            if (ZoneDisplayLive[i].classList.contains('tpl_03')) {
                (function(i) { new ZoneDisplay(ZoneDisplayLive[i]); })(i);
            }            
        }
    }

}());


/**
 * Cards collapses
 */
function infoliveCardsCollapses() {
    var $cell = $('.infolive-card');
    //open and close card when clicked on card
    $cell.find('.info-header').click(function() {
        var $thisCell = $(this).closest('.infolive-card');
        if ($thisCell.hasClass('is-collapsed')) {
            $cell.not($thisCell).removeClass('is-expanded').addClass('is-collapsed').addClass('is-inactive');
            $thisCell.removeClass('is-collapsed').addClass('is-expanded');
            /*var expander = $thisCell.find('.card__expander');
            console.log('expander', expander)
            var wHeight = $thisCell.height() * 1;
            $('html, body').animate({
                scrollTop: expander.offset().top - expander.height() / 2
            }, 250);*/
            if ($cell.not($thisCell).hasClass('is-inactive')) {
                //do nothing
            } else {
                $cell.not($thisCell).addClass('is-inactive');
            }
        } else {
            $thisCell.removeClass('is-expanded').addClass('is-collapsed');
            $cell.not($thisCell).removeClass('is-inactive');
        }
    });
    function closeCell(etarget) {
        var $thisCell = etarget.closest('.infolive-card');
        $thisCell.removeClass('is-expanded').addClass('is-collapsed');
        $cell.not($thisCell).removeClass('is-inactive');
    }

    //close card events
    $cell.find('.infolive-card .info-header').click(function() {   
        closeCell($(this));
    });
    $('.infolive-card').on('click', '.close-expander-btn', function() {   
        closeCell($(this));
    });
}
infoliveCardsCollapses();

