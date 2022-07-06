import WoodyFilter from './filter';
import Forms from './modules/accessibility/forms.js';

if (WoodyFilter.apply('forms_accessibily_mode', false) === true) {
    new Forms;
}
