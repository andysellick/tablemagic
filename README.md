tablemagic
==========

A jQuery plugin to handle overly large tables.

Overview
--------

For tabular data that produces a table either too wide or too tall for the page. This plugin enables you to 'freeze' any number of rows or columns, allowing the rest of the table to be scrolled independently and therefore making the whole table fit in the available space. For example, you can freeze the first row so that the table header is always visible.

The plugin comes with its own stylesheet that contains minimal styling. I leave you to implement your own additional flourishes.

Usage
-----

* Include the stylesheet and the js file
* Ensure jQuery is also loaded
* Wrap your table in a div with a named class
* On document ready, call ``$('.namedclass').tablemagic({ option: optionvalue });``

Options
-------

* type: sets whether a row or a column is frozen. Accepts either 'rows' or 'columns'. Defaults to 'columns'.
* freezeitems: sets the number of rows or columns to freeze. Defaults to 1.
* height: only used for 'rows'. Sets the height of the table. Accepts a positive integer. Defaults to 'auto'
* scrollbyVert and scrollbyHorz: sets the incremental scroll distance when arrows are clicked. Accepts a positive integer. Defaults to 100 and 200, respectively.
* arrowUpHTML, arrowDownHTML, arrowLeftHTML, arrowRightHTML: the HTML that will be inserted into the scroll action buttons. Defaults to HTML character codes for those arrow directions.

See example file for usage.

TODO
----

* The plugin is currently not responsive.
* I'd also like to add scrolling based on grab and drag as an option rather than little arrows to click on, or possibly some kind of custom scrollbars (to allow for things you might want to click on inside the table).
* Combining both aspects of the plugin to be able to provide a fixed height table that scrolls both horizontally and vertically might be useful.

