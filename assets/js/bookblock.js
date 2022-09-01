import $ from 'jquery';
import flatpickr from "flatpickr";

$('.woody-component-bookblock').each(function () {

    var updateFromOption = function () {

        var $optionSelected = $('option:selected', $plSelect);

        if (typeof ($optionSelected.data('daterange')) !== 'undefined') {
            $dateRangeInput.show();

            if (dateSingle.length !== 0) {
                dateSingle.clear();
            }
        } else if (typeof ($optionSelected.data('singledate')) !== 'undefined') {
            $dateRangeInput.hide();

            if (datesRange.length !== 0) {
                datesRange.clear();
            }
        } else {
            $dateRangeInput.hide();
        }

        if (typeof ($optionSelected.data('singledate')) !== 'undefined') {
            $singleDateInput.add($periodInput).show();

            if (datesRange.length !== 0) {
                datesRange.clear();
            }

            var $options = $periodInput.find('option');
            $options.each(function () {
                if ($(this).data('plid') != $optionSelected.val()) {
                    $(this).remove();
                }
            });
        } else if (typeof ($optionSelected.data('daterange')) !== 'undefined') {
            $singleDateInput.add($periodInput).hide();

            if (dateSingle.length !== 0) {
                dateSingle.clear();
            }
        } else {
            $singleDateInput.add($periodInput).hide();
        }

        if (typeof ($optionSelected.data('adults')) !== 'undefined') {
            $adultsInput.show();
        } else {
            $adultsInput.hide();
        }

        if (typeof ($optionSelected.data('children')) !== 'undefined') {
            $childrenInput.show();
        } else {
            $childrenInput.hide();
        }

        if (!$optionSelected.data('facet')) {
            $submit.removeClass('disabled');
        } else if (!$submit.hasClass('disabled') && !$dateRangeInput.find('input').val() && !$singleDateInput.find('input').val()) {
            $submit.addClass('disabled');
        }

        $this.addClass('ready');
    };

    var tabulationForms = function () {
        var $tabulator = $this.find('.form-tabs .tabs-title button');
        $tabulator.each(function () {
            var $tab = $(this);
            $tab.on('click', function () {
                $tab.parents('.tabs-list').find('.is-active').removeClass('is-active');
                $tab.addClass('is-active');
                $plSelect.find('option').removeAttr('selected');
                $plSelect.find('option[value="' + $tab.data("plid") + '"]').attr('selected', 'selected');
                updateFromOption();
            });
        });
    }

    var flatpickrSingle = function ($e) {
        flatpickr.l10ns.default.firstDayOfWeek = 1; // Monday
        const bookingSingledate = flatpickr($e.find('.singledate-input'), {
            mode: 'single',
            minDate: "today",
            dateFormat: "d/m/Y",
            locale: window.globals.current_locale,
            onClose: function (selectedDates, dateStr, el) {
                $(el.input).parents('.woody-component-bookblock').find('.form-submit').removeData('tooltip').removeAttr('title').removeClass('disabled');
            }
        });

        return bookingSingledate;
    }

    var flatpickrRange = function ($e) {
        flatpickr.l10ns.default.firstDayOfWeek = 1; // Monday
        const bookingRangesdates = flatpickr($e.find('.daterange-input'), {
            mode: 'range',
            minDate: "today",
            dateFormat: "d/m/Y",
            locale: window.globals.current_locale,
            onClose: function (selectedDates, dateStr, el) {
                $(el.input).parents('.woody-component-bookblock').find('.form-submit').removeData('tooltip').removeAttr('title').removeClass('disabled');
            }
        });

        return bookingRangesdates;

    }

    var facetConstructor = function (adult_count, children_count, selectedDates, customValue, conf_id) {
        var facets = {};

        facets = {
            "start": moment(selectedDates[0]).format(),
            "end": moment(selectedDates[1]).endOf('day').milliseconds(0).format(),
            "persons": {
                "adults": parseInt(adult_count),
                "children": parseInt(children_count)
            },
            "childrenData": [],
            "availableOnly": true,
            "confId": conf_id,
            "customValue": {}
        }

        for (var i = 0; i < children_count; i++) {
            facets.childrenData.push({ "age": 5 });
        }

        if (customValue !== null && typeof customValue != 'undefined' && customValue.length != 0) {
            facets.customValue.value = customValue.val();
            facets.customValue.unit = customValue.data('unit');
        }

        return facets;
    }

    var $this = $(this);
    var $plSelect = $this.find('.pl-select'),
        $submit = $this.find('.form-submit'),
        $counterButton = $this.find('.item-counter-button'),
        $dateRangeInput = $this.find('.dates-input.range-dates'),
        $singleDateInput = $this.find('.dates-input.single-date'),
        datesRange = flatpickrRange($dateRangeInput),
        dateSingle = flatpickrSingle($singleDateInput),
        $periodInput = $this.find('.period-input'),
        $adultsInput = $this.find('.adults-input'),
        $childrenInput = $this.find('.children-input');

    updateFromOption();

    $plSelect.on('change', function () {
        updateFromOption();
    });

    if ($this.hasClass('tabulation')) {
        tabulationForms();
    }

    $counterButton.on('click', function () {
        var $target = $(this).parent().find('.item-counter-value');

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

    $submit.on('click', function (e) {
        e.preventDefault();

        var selectedDates = [];

        if (datesRange.selectedDates.length >= 1) {
            datesRange.selectedDates.forEach(element => {
                selectedDates.push(element);
            });

            var customValue = null;

        } else if (dateSingle.selectedDates.length >= 1) {
            dateSingle.selectedDates.forEach(element => {
                selectedDates.push(element);

                var $selected_period = $this.find('.period-input option:selected'),
                    selected_period_count = $selected_period.val(),
                    selected_unit = $selected_period.data('unit'),
                    endDate = moment(selectedDates[0]).add(selected_period_count, selected_unit).format();

                selectedDates.push(endDate);
            });

            var customValue = $('option:selected', $this.find('.period-input .select-input'));

        }

        var conf_id = $('option:selected', $plSelect).data('conf_id'),
            adult_count = $this.find('.adults-input .item-counter-value').val() || 0,
            children_count = $this.find('.children-input .item-counter-value').val() || 0,
            the_facets = facetConstructor(adult_count, children_count, selectedDates, customValue, conf_id),
            datesGlobal = [];

        if (selectedDates.length > 0) {
            var datesToStore = {
                date: moment().format(),
                data: the_facets
            };
            datesGlobal.push(datesToStore);
            sessionStorage.setItem('dates_global', JSON.stringify(datesGlobal));
        }

        $(this).attr('href', $('option:selected', $plSelect).data('permalink'));
        if (!$(this).hasClass('disabled')) {
            window.location = $(this).attr('href');
        }
    });

});
