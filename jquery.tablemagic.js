
(function($){
    $.fn.tablemagic = function( options ){
        var settings = $.extend({
            type: 'columns',
            freezeitems: 1,
            height: 'auto',
            scrollbyVert: 100,
            scrollbyHorz: 200,
            scrollType: "arrows",
            arrowUpHTML: "&#9650;",
            arrowDownHTML: "&#9660;",
            arrowLeftHTML: "&#9668;",
            arrowRightHTML: "&#9658;"
        },options);

        //apply height stylings
        function fixParentHeight($parent,$table){
            var tableHeight = settings.height;
            if(tableHeight == 'auto' || settings.type != 'rows'){ //only allow height option when freezing rows
                $parent.addClass('auto');
                tableHeight = $table.outerHeight();
            }
            else {
                $parent.addClass('fixed');
            }
            $parent.css('height',tableHeight);
        }

        //resize a table set to 'columns'
        function resizeColumnTable(thisel){
            var $frozentable = thisel.find('.frozen');
            var $scrollpane = thisel.find('.scrollpane');
            scrollpanewidth = thisel.outerWidth() - $frozentable.width();
            $scrollpane.css('width',scrollpanewidth);
        }
        
        //apply scrollyness for non-touch devices
        if(settings.scrollType == "arrows"){
            $('body').on('click','.scroll.active',function(e){
                e.preventDefault();
                var $this = $(this);
                $this.removeClass('active');
                var thisobj = $(this).closest('.tablemagic');
                if($(this).hasClass('up') || $(this).hasClass('down')){
                    doScrollMagic(thisobj,String($this.attr('data-dir')));
                }
                else {
                    doScrollMagic(thisobj,String($this.attr('data-dir')));
                }
            });
        }

        //check for screen resizing
        $(window).resize(function(){
            $('.tablemagic').each(function(){
                //we can only make the columned table responsive owing to the way table cell widths are generated
                //realistically if your table is wider than the intended width the column option should be used rather than the row option
                if($(this).hasClass('columns')){
                    resizeColumnTable($(this));
                }
            });
        });
        
        //determine scrolling directions based on passed attribute
        function scrollDirections(attr,obj){
            var scr = 0;
            switch(attr){
                case 'up':
                    scr = obj.top + settings.scrollbyVert
                    break;
                case 'down':
                    scr = obj.top - settings.scrollbyVert
                    break;
                case 'left':
                    scr = obj.left + settings.scrollbyHorz
                    break;
                case 'right':
                    scr = obj.left - settings.scrollbyHorz
                    break;
            }
            return scr;
        }

        //animates scrollpane either left right or up down
        function doScrollMagic(thisobj,direction){
            $scrolltable = thisobj.find('.scrollpane table');
            p = $scrolltable.position();
            var scrtop = 0, scrleft = 0;
            scr = scrollDirections(direction,p);
            if(scr > 0){ //if too far left or up
                scr = 0;
            }
            if(direction == 'left' || direction == 'right'){
                direction = 'left';
                scrolltablew = $scrolltable.outerWidth();
                scrollpanew = thisobj.find('.scrollpane').outerWidth();
                scrleft = scr;
                if(scrolltablew + scrleft < scrollpanew){ //if too far right
                    scrleft = -(scrolltablew - scrollpanew);
                }
            }
            else {
                direction = 'top';
                scrolltableh = $scrolltable.outerHeight();
                scrollpaneh = thisobj.find('.scrollpane').outerHeight();
                scrtop = scr;
                if(scrolltableh + scrtop < scrollpaneh){ //if too far down
                    scrtop = -(scrolltableh - scrollpaneh);
                }
            }
            $scrolltable.animate({
                'top': scrtop,
                'left': scrleft
            },function(){
                thisobj.find('.scroll').addClass('active');
            });
        }

        var lastX, lastY;
        
        //reset touch events so scrolling is smooth
        $('.tablemagic').on('touchstart','.scrollpane',function(e){
            lastX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
            lastY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
        });

        //perform scrolling for touch
        $('.tablemagic').on('touchmove','.scrollpane',function(e){
            e.stopPropagation();
            var touched = $(e.target).closest('.tablemagic');
            var currentX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
            var currentY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
            var $scrolltable = touched.find('.scrollpane table');
            var p = $scrolltable.position();
            //find sizes of elements
            scrolltablew = $scrolltable.outerWidth();
            scrolltableh = $scrolltable.outerHeight();
            scrollpanew = touched.find('.scrollpane').outerWidth();
            scrollpaneh = touched.find('.scrollpane').outerHeight();
            
            if(touched.hasClass('columns')){
                if (currentX > lastX + 10) { //moving right
                    e.preventDefault(); //preventDefault is only called in specific places to prevent disabling of scroll
                    scrollby = p.left + (currentX - lastX);
                    if(scrollby > 0) scrollby = 0; //check not too far right
                    $scrolltable.css('left',scrollby + 'px');
                }
                if (currentX < lastX - 10) { //moving left
                    e.preventDefault();
                    scrollby = p.left - (lastX - currentX);
                    if(scrolltablew + scrollby < scrollpanew) scrollby = -(scrolltablew - scrollpanew); //check not too far left
                    $scrolltable.css('left',scrollby + 'px');
                }
            }
            if(touched.hasClass('rows')){ //only do up and down
                if (currentY > lastY) { //down
                    scrollby = p.top + (currentY - lastY);
                    //if at the top, allow normal touch scroll
                    if(scrollby > 0){
                        scrollby = 0;
                    }
                    else {
                        e.preventDefault();
                    }
                    $scrolltable.css('top',scrollby + 'px');
                }
                else { //up
                    scrollby = p.top - (lastY - currentY);
                    //if at the bottom, allow normal touch scroll
                    if(scrolltableh + scrollby < scrollpaneh){
                        scrollby = -(scrolltableh - scrollpaneh);
                    }
                    else {
                        e.preventDefault();
                    }
                    $scrolltable.css('top',scrollby + 'px');
                }
            }
            lastX = currentX;
            lastY = currentY;
        });

        //reset the current position to the current position, if that makes sense
        $(document).on('touchend',function(e){
            lastX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
            lastY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
        });

        //do main functionality of plugin
        return this.each(function(){
            $parent = $(this);
            var $table = $parent.find('table');

            if(settings.type == 'columns'){
                $parent.addClass('columns');

                //first find table row height in order to fix manually from here on
                var maxheight = 0;
                $table.find('tr').each(function(){
                    var newheight = $(this).outerHeight();
                    if(newheight > maxheight){
                        maxheight = newheight;
                    }
                });
                $table.find('tr').css('height',maxheight);

                //now pull required cells out of original table. We do it this way to preserve exactly the original html, including thead and tbody, as this may impact table styling
                var $frozentable = $('<table/>').html($table.html());
                $frozentable.find('tr').each(function(){
                    $(this).find('th,td').slice(settings.freezeitems).remove(); //remove everything after the first n cells as determined in the settings
                });
                $frozentable.addClass($table.attr('class')); //preserve original table classes

                //create panel that will be 'fixed' and fill with extracted cells
                $frozenpane = $('<div/>').addClass('frozen');
                $frozenpane.append($frozentable);
                $parent.append($frozenpane);

                //create scrolling panel and fill with remainder of table
                scrollpanewidth = $parent.outerWidth() - $frozentable.width(); //for some reason outerWidth on frozentable miscalculates width
                $scrollpane = $('<div/>').addClass('scrollpane').css('width',scrollpanewidth);
                $table.find('tr').each(function(){
                    $(this).find('th,td').slice(0,settings.freezeitems).remove();
                });
                $scrollpane.append($table);
                $parent.append($scrollpane);
                fixParentHeight($parent,$table); //need to call this after this kind of table
            }

            else if(settings.type == 'rows'){
                $parent.addClass('rows');
                fixParentHeight($parent,$table); //need to call this before this kind of table

                //first find table cell width in order to fix manually from here on
                $table.find('td,th').each(function(){
                    $(this).css('width',$(this).width());
                });

                //now pull required cells out of original table
                var $frozentable = $('<table/>');
                var $row = $table.find('tr').slice(0, settings.freezeitems);
                $frozentable.append($row);
                //create panel that will be 'fixed' and fill with extracted cells
                $frozenpane = $('<div/>').addClass('frozen');
                $frozenpane.append($frozentable);
                $parent.append($frozenpane);

                //create scrolling panel and fill with remainder of table
                $scrollpane = $('<div/>').addClass('scrollpane').css({
                    'top': $frozentable.outerHeight(),
                    'height': $parent.outerHeight() - $frozentable.outerHeight()
                });
                $scrollpane.append($table);
                $parent.append($scrollpane);
            }

            //http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
            var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
            if(!supportsTouch){
                //apply arrow controls for scrolling
                if(settings.scrollType == "arrows"){
                    //scroll up and down
                    if(settings.type == 'rows'){
                        $('<a/>').html(settings.arrowDownHTML).addClass('scroll down active').attr('data-dir','down').appendTo($parent);
                        $('<a/>').html(settings.arrowUpHTML).addClass('scroll up active').attr('data-dir','up').appendTo($parent);
                    }
                    //scroll left and right
                    else if(settings.type == 'columns'){
                        $('<a/>').html(settings.arrowLeftHTML).addClass('scroll left active').attr('data-dir','left').appendTo($parent);
                        $('<a/>').html(settings.arrowRightHTML).addClass('scroll right active').attr('data-dir','right').appendTo($parent);
                    }
                }
            }
        });
    };
}(jQuery));
