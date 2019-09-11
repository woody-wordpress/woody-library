import $ from 'jquery';

function rangeSliderFilter($el) {
    var rangeSlider = $el.find('.rangeSlider'),
        rangeMin = rangeSlider.data('min'),
        rangeMax = rangeSlider.data('max'),
        start = rangeSlider.data('start'),
        stop = rangeSlider.data('stop'),
        rangeEl = rangeSlider.get(0);
    noUiSlider.create(rangeEl, {
        range: {
            'min': rangeMin - 1,
            'max': rangeMax
        },
        step: $el.data('step'),
        start: [start, stop],
        connect: true,
        behaviour: 'tap-drag',
        tooltips: true,
        format: {
            to: function(value) {
                return '<span>' + Math.round(value) + '</span><span class="caption">' + $el.data('caption') + '</span>';
            },
            from: function(value) {
                return value;
            }
        }
    });

    rangeEl.noUiSlider.on('change', updateInputs);
    rangeEl.noUiSlider.on('slide', updateInputs);

    function updateInputs(values, handle) {
        var type = $(rangeEl).data('type'),
            input_min = $(rangeEl).siblings('.' + type + '_min'),
            input_max = $(rangeEl).siblings('.' + type + '_max');
        if (handle == 0) {
            $(input_min).val(values[0].replace(/\D/g, ''));
        }

        if (handle == 1) {
            $(input_max).val(values[1].replace(/\D/g, ''));
        }
    }
}

$('.woody-component-list-full .woody-component-list-filter.type-rangeSlider').each(function() {
    var $this = $(this);
    rangeSliderFilter($this);
});

$('.woody-component-filters-wrapper').each(function() {
    var $form = $(this);

    $("input:submit", $form).bind("click keypress", function() {
        $form.data("submittedId", this.id);
    });

    $form.on('submit', function(e) {
        let str = $(this).data("submittedId");
        let pos = str.indexOf("-");
        let section_reset = str.substr(0, pos);
        let res = str.substr(pos + 1);
        let send_data = "";
        if (res == "reset") {
            send_data = $(this).serialize() + "&reset=1&section_reset=" + section_reset;
        } else {
            send_data = $(this).serialize() + "&reset=0";
        }

        var params = { filters: {}};
        // Filters param
        $('form.woody-component-filters-wrapper').each(function(){
            let submitId = $(this).find('input[name="submit"').attr("id");
            let pos = submitId.indexOf("-");
            let uniqid = submitId.substr(0, pos);
            params.filters[uniqid] = $(this).serialize();
        });
        send_data = send_data + "&" + $.param(params);

        $('body').addClass('ajaxload');
        e.preventDefault();
        $.ajax({
            url: $form.attr('action'),
            data: send_data,
            method: "POST",
            dataType: "html",
            success: function(data) {
                // Reset selected or checked values of all form input
                if (res == "reset") {
                    $form.find("input[type='checkbox']").each(function() {
                        $(this).prop("checked", false);
                    });
                    $form.find(".rangeSlider").each(function() {
                        let range = $(this);
                        let min = range.data('min');
                        let max = range.data('max');
                        range[0].noUiSlider.set([min, max]);
                    });
                    $form.find("select").each(function() {
                        $(this).find("option").first().attr("selected", true);
                        $(this).find("option").attr("selected", false);
                    });
                }
                var $currentList = $($form.parents('.woody-component-list-full'));
                var listId = $currentList.attr('id');
                var itemsCount = $currentList.find('.the_filter .items-count');
                $('#' + listId + ' .the_grid').html($(data).find('#' + listId + ' .the_grid').html());
                $('#' + listId + ' .the_filter .items-count').html($(data).find('#' + listId + ' .the_filter .items-count').html());
                $('#' + listId + ' .woody-component-geomap').html($(data).find('#' + listId + ' .woody-component-geomap').html());
                if ($(data).find('#' + listId + ' .the_pager').length == 0) {
                    $('#' + listId + ' .the_pager').html('');
                } else {
                    $('#' + listId + ' .the_pager').html($(data).find('#' + listId + ' .the_pager').html());
                }

                // Need : find all pager of content list from other wrapper and set their link.
                $('.woody-component-list-full').each(function(){
                    let id = $(this).attr('id');
                    if(id != listId){
                        if ($(data).find('#' + listId + ' .the_pager').length == 0) {
                            $('#' + id + ' .the_pager').html('');
                        } else {
                            $('#' + id + ' .the_pager').html($(data).find('#' + id + ' .the_pager').html());
                        }
                    }
                });

                rcModule.rcTouristicMap.initialize();

                $('body').removeClass('ajaxload');
            },
            error: function(xhr, status, error) {
                console.log('Submission failed: ' + error);
                $('body').removeClass('ajaxload');
            }
        });
    });
});
