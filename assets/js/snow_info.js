import $ from 'jquery';

function drawCircle(e, hasLevel) {
    $(e).each(function() {
        var context = this.getContext('2d');
        var percentage = this.getAttribute('data-percentage');
        var color = this.getAttribute('data-color');
        var radius = this.getAttribute('data-radius');

        if (hasLevel) {
            // Convert
            var degrees = percentage * 360 / 100;
            var radians = degrees * Math.PI / 180;

            // startAngle
            var start = Math.PI * 1.5;
            // endAngle
            var end = start + radians;

            // Draw
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, Math.PI * 1.5, end, false);
        } else {
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2, false);
        }

        // Options
        context.lineWidth = 3;
        context.strokeStyle = color;
        context.stroke();
    })

}

// Init
$('.woody-component-snow-infos').each(function() {
    drawCircle('canvas.circle', true);
    drawCircle('canvas.bg-circle');
});
