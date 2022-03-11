import Summary from './summary/summary.js';

document.querySelectorAll('.woody-component-summary').forEach(el => {
    el.summary = new Summary(el);
});
