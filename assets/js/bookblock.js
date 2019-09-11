import $ from 'jquery';
import flatpickr from "flatpickr";

var updateFromOption = function(el, $parent) {
    var $optionSelected = $('option:selected', el),
        $dateRangeInput = $($parent.find('.dates-input')),
        $adultsInput = $($parent.find('.adults-input')),
        $childrenInput = $($parent.find('.children-input'));

    if (typeof($optionSelected.data('daterange')) !== 'undefined') {
        $dateRangeInput.show();
    } else {
        $dateRangeInput.hide();
    }

    if (typeof($optionSelected.data('adults')) !== 'undefined') {
        $adultsInput.show();
    } else {
        $adultsInput.hide();
    }

    if (typeof($optionSelected.data('children')) !== 'undefined') {
        $childrenInput.show();
    } else {
        $childrenInput.hide();
    }

};

var facetConstructor = function(facet_id, adult_count, children_count, selectedDates) {
    var facets = {};

    facets = {
        "start": moment(selectedDates[0]).format(),
        "end": moment(selectedDates[1]).endOf('day').milliseconds(0).format(),
        "persons": {
            "adults": parseInt(adult_count),
            "children": parseInt(children_count)
        },
        "childrenData": [],
        "availableOnly": true
    }

    for (var i = 0; i < children_count; i++) {
        facets.childrenData.push({ "age": 5 });
    }

    return facets;
}

var tabulationForms = function($el, $plSelect) {
    var $tabulator = $($el.find('.form-tabs .tabs-title button'));
    $tabulator.each(function() {
        var $tab = $(this);
        $tab.click(function() {
            $tab.parents('.tabs-list').find('.is-active').removeClass('is-active');
            $tab.addClass('is-active');
            $plSelect.find('option').removeAttr('selected');
            $plSelect.find('option[value="' + $tab.data("plid") + '"]').attr('selected', 'selected');
            updateFromOption($plSelect, $el);
        });
    });
}

var flatpickrInit = function($e) {
    flatpickr.l10ns.default.firstDayOfWeek = 1; // Monday

    var $mode = $e.hasClass('tpl_03') ? 'single' : 'range',
        $input = $e.hasClass('tpl_03') ? '.date-input' : '.daterange-input';

    const bookingdates = flatpickr($input, {
        mode: $mode,
        minDate: "today",
        dateFormat: "d/m/Y",
        locale: window.siteConfig.current_lang,
        onClose: function() {
            $e.find('.form-submit').removeData('tooltip').removeAttr('title').removeClass('disabled');
        }
    });

    return bookingdates;
}

$('.woody-component-bookblock').each(function() {
    var $this = $(this),
        $plSelect = $($this.find('.pl-select')),
        $submit = $($this.find('.form-submit')),
        $counterButton = $($this.find('.item-counter-button')),
        $dates = flatpickrInit($this);

    updateFromOption($plSelect, $this);

    if ($this.hasClass('tabulation')) {
        tabulationForms($this, $plSelect);
    }

    $plSelect.on('change', function() {
        updateFromOption(this, $this);
    });

    $counterButton.click(function() {
        var $target = $($(this).parent().find('.item-counter-value'));

        if ($(this).hasClass('incre')) {
            $target.val(+$target.val() + 1);
            if ($target.val() > $target.attr('min')) {
                $(this).parent().find('.decre').removeAttr('disabled');
            }
        } else if ($(this).hasClass('decre')) {
            $target.val(+$target.val() - 1);
            if ($target.val() > $target.attr('min')) {
                $(this).removeAttr('disabled');
            } else {
                $(this).attr('disabled', true);
            }
        }
    });

    $submit.click(function(e) {
        e.preventDefault();

        var selectedDates = [];

        if (Array.isArray($dates)) {
            $dates.forEach(element => {
                selectedDates.push(element.selectedDates[0]);
            });
        } else {
            selectedDates = $dates.selectedDates;
        }

        var facet_id = $('option:selected', $plSelect).data('facet'),
            adult_count = $this.find('.adults-input .item-counter-value').val() || 0,
            children_count = $this.find('.children-input .item-counter-value').val() || 0,
            the_facets = facetConstructor(facet_id, adult_count, children_count, selectedDates),
            datesGlobal = [],
            datesToStore = {
                date: moment().format(),
                data: the_facets
            };

        datesGlobal.push(datesToStore);
        sessionStorage.setItem('dates_global', JSON.stringify(datesGlobal));
        $(this).attr('href', $('option:selected', $plSelect).data('permalink'));
        if (!$(this).hasClass('disabled')) {
            window.location = $(this).attr('href');
        }
    });

});
