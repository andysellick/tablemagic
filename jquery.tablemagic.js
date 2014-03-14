
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

                //now pull required cells out of original table
                var $frozentable = $('<table/>');
                var count = settings.freezeitems;

                $table.find('tr').each(function(){
                    var $col = $('<tr/>').css('height',maxheight);
                    $col.append($(this).find('td,th').slice(0, settings.freezeitems));
                    $frozentable.append($col);
                });

                //create panel that will be 'fixed' and fill with extracted cells
                $frozenpane = $('<div/>').addClass('frozen');
                $frozenpane.append($frozentable);
                $parent.append($frozenpane);

                //create scrolling panel and fill with remainder of table
                scrollpanewidth = $parent.outerWidth() - $frozentable.width(); //for some reason outerWidth on frozentable miscalculates width
                $scrollpane = $('<div/>').addClass('scrollpane').css('width',scrollpanewidth);
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

            //apply scrollyness
            if(settings.scrollType == "arrows"){
                if($scrollpane.outerHeight() < $table.outerHeight()){
                    $down = $('<a/>').html(settings.arrowDownHTML).addClass('scroll down active').attr('data-dir','down').appendTo($parent);
                    $up = $('<a/>').html(settings.arrowUpHTML).addClass('scroll up active').attr('data-dir','up').appendTo($parent);

                    $(this).on('click','.scroll.active',function(e){
                        e.preventDefault();
                        var $this = $(this);
                        $this.removeClass('active');
                        var thisobj = $(this).closest('.tablemagic');
                        $scrolltable = thisobj.find('.scrollpane table');
                        p = $scrolltable.position();

                        scr = scrollDirections(String($this.attr('data-dir')),p);
                        scrolltableh = $scrolltable.outerHeight();
                        scrollpaneh = thisobj.find('.scrollpane').outerHeight()

                        if(scr > 0){ //if too far up
                            scr = 0;
                        }
                        else if(scrolltableh + scr < scrollpaneh){ //if too far down
                            scr = -(scrolltableh - scrollpaneh);
                        }
                        $scrolltable.animate({
                            'top': scr
                        },function(){
                            thisobj.find('.scroll').addClass('active');
                        });
                    });
                }

                if($scrollpane.outerWidth() < $scrollpane.find('table').outerWidth()){
                    $left = $('<a/>').html(settings.arrowLeftHTML).addClass('scroll left active').attr('data-dir','left').appendTo($parent);
                    $right = $('<a/>').html(settings.arrowRightHTML).addClass('scroll right active').attr('data-dir','right').appendTo($parent);
    
                    $(this).on('click','.scroll.active',function(e){
                        e.preventDefault();
                        var $this = $(this);
                        $this.removeClass('active');
                        var thisobj = $(this).closest('.tablemagic');
                        $scrolltable = thisobj.find('.scrollpane table');
                        p = $scrolltable.position();
                        scr = scrollDirections(String($this.attr('data-dir')),p);
                        scrolltablew = $scrolltable.outerWidth();
                        scrollpanew = thisobj.find('.scrollpane').outerWidth()

                        if(scr > 0){ //if too far left
                            scr = 0;
                        }
                        else if(scrolltablew + scr < scrollpanew){ //if too far right
                            scr = -(scrolltablew - scrollpanew);
                        }
                        $scrolltable.animate({
                            'left': scr
                        },function(){
                            thisobj.find('.scroll').addClass('active');
                        });
                    });
                }
            }
        });
    };
}(jQuery));