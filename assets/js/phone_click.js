import $ from 'jquery';

$('.phone-number-action').each(function() {
    var $this = $(this);
    var phone_number = $this.data('phone');
    var post_title = $this.data('title');
    var post_id = $this.data('id');
    var page_type = $this.data('page-type');
    $this.click(function(e) {
        if ($this.hasClass('hidden')) {
            e.preventDefault();
            $this
                .removeClass('hidden')
                .find('.cta-phone-number').text(phone_number).end()
                .find('.cta-phone-tip').remove();
            ga('rc.send', 'event', 'page_' + page_type, 'click_phone', post_title + '(N° ' + post_id + ')');
        } else {
            ga('rc.send', 'event', 'page_' + page_type, 'call_phone', post_title + '(N° ' + post_id + ')');
        }
    });
});
