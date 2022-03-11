
//Set or Apply filters
/*
---- Inside Child Theme
The custom js file must be imported in main.js BEFORE the woody theme
-- MUST IMPORT FIRST :
import WoodyFilter from 'woody-library/assets/js/filter';
- Add filter with returning a var :
    WoodyFilter.add('name_of_the_filter', function(get_something) {
        return get_something + somethingelse;
    });

- Or Add a filter by applying a function :
    WoodyFilter.add('name_of_the_filter', function(get_something) {
        //Do something
    });

---- Inside Woody library
-- MUST IMPORT FIRST :
import WoodyFilter from './filter';
- Apply filter with :
    WoodyFilter.apply('name_of_the_filter', send_something);
*/
var WoodyFilter = {
    filters: {},
    add: function (tag, filter) {
        (this.filters[tag] || (this.filters[tag] = [])).push(filter);
    },
    apply: function (tag, val) {
        if(this.filters[tag]){
            var filters = this.filters[tag];
            for(var i = 0; i < filters.length; i++){
                val = filters[i](val);
            }
        }
        return val;
    }
}

export default WoodyFilter;
