
// ---- TABS ------------------------------------------------------------------
$(document).on("pageshow", function() {
    $(".nw_tab-header").each(function(idx) {
        var height = $(this).parent().innerHeight() - $(this).outerHeight();
        $(this).siblings(".nw_tab-content").css('height', height);
    });
});

$(document).on("pagecreate", function() {
    $(".nw_tab-header ul li").on("click",function(){
        $(this).parent().find(".ui-btn-active").removeClass("ui-btn-active");
        $(this).addClass("ui-btn-active");
        var newSelection = $(this).children("a").attr("data-tab-class");
        var prevSelection = $(this).parent().parent().attr("data-tab-selection");
        $("."+prevSelection).addClass("ui-screen-hidden");
        $("."+newSelection).removeClass("ui-screen-hidden");
        $(this).parent().parent().attr("data-tab-selection", newSelection);
    });
});

// idleTimer() takes an optional argument that defines the idle timeout
// timeout is in milliseconds; defaults to 30000
$(document).on('pageinit', function() {
    if (jQuery().idleTimer) {
	alert("IDLE")
    //if (jQuery().idleTimer && navigator.userAgent.match(/iPad/i) != null) {
        $.idleTimer(3 * 1000);
    }
});

$(document).bind('idle.idleTimer', function() {
    $.mobile.changePage("index.php?page=qlock");
});

$(document).bind('active.idleTimer', function() {
    parent.history.back();
});

// idle timer for the door camera
$(document).delegate("#aa_tuerkamera", "pageshow", function() {
    if (jQuery().idleTimer) {
        $('#aa_tuerkamera').idleTimer(120 * 1000);
        $('#aa_tuerkamera').bind('idle.idleTimer', function() {
            parent.history.back();
        });
    }
});
$(document).delegate("#aa_tuerkamera", "pagehide", function() {
    if (jQuery().idleTimer) {
        $('#aa_tuerkamera').idleTimer('destroy');
    }
});

// CUSTOM plot.popup --------------------------------------------------------------

//$(document).on("pageinit", function(){
//    $(".nw_plot-popup").on("popupafteropen", function() {
//	$(".nw_plot-popup").find('[data-widget^="plot.period"]').each(function(idx) {
//        if ($('#' + this.id).highcharts()) {
//		$('#' + this.id).highcharts().destroy(); 
//                var values = widget.get(widget.explode($(this).attr('data-item')));
//                if (widget.check(values))
//                $(this).trigger('update', [values]);
//		}
//        });
//    });
//});

// ----- t r a n s -------------------------------------------------------------

Number.prototype.transExSecondsToHours = function() {
    return (this / (60 * 60)).toFixed(1);
};

Number.prototype.transExKwhToMwh = function() {
    return (this / (1000)).toFixed(2);
};

Number.prototype.transExSecondsToHMS = function() {
    var H = Math.floor(this / (60 * 60));
    var M = Math.floor((this / 60) % 60);
    var S = Math.floor(this % (60 * 60));
    return ('0' + H).slice(-2) + ':' + ('0' + M).slice(-2) + ':' + ('0' + S).slice(-2);
};

Number.prototype.transExByteToMegabyte = function() {
    return (this / (1024 * 1024)).toFixed(1);
};

// -----------------------------------------------------------------------------
// W I D G E T   D E L E G A T E   F U N C T I O N S
// -----------------------------------------------------------------------------



// ----- v i s u ---------------------------------------------------------------
// -----------------------------------------------------------------------------


// ----- visu.flip -----------------------------------------------------------
$(document).delegate('select[data-widget="visu.flip"]', {
	'update': function (event, response) {
		$(this).val(response > 0 ? 'on' : 'off').slider('refresh');
	},

	'change': function (event) {
		// DEBUG: console.log("[basic.flip] change '" + this.id + "':", $(this).val());  
		io.write($(this).attr('data-item'), ($(this).val() == 'on' ? 1 : 0));
	}
});

// ----- visu.format -----------------------------------------------------------
$(document).delegate('[data-widget="visu.format"]', {
    'update': function (event, response) {
        $('#' + this.id).html(parseFloat(response)[$(this).attr('data-format')]() + ' ' + $(this).attr('data-unit'));
    }
});

// ----- visu.percent ----------------------------------------------------------
$(document).delegate('[data-widget="visu.percent"]', {
        'update': function(event, response) {
                $('#' + this.id).html(Math.round(parseInt(response)) + ' %');
    }
});


// ----- visu.shutter ----------------------------------------------------------
$(document).delegate('[data-widget="visu.button"]', {
        'vmousedown': function(event) { // Short/Long Button
            event.preventDefault();
        var items = widget.explode($(this).attr('data-item'));
            var obj = this;
            $(obj).attr('data-timer',
                setTimeout(function() {
                    $(obj).attr('data-long', true);
                    io.write(items[1], $(obj).attr('data-val'));
                }, 400)
            );
        },
        'vmouseup': function() { // Short/Long Button
            clearTimeout($(this).attr('data-timer'))
        var items = widget.explode($(this).attr('data-item'));
            if ($(this).attr('data-long') == 'true') {
                $(this).attr('data-long', false);
            } else {
            io.write(items[0], $(this).attr('data-val'));
            }
        },
        'click': function(event) {

    }
});

// ----- visu.shifter ----------------------------------------------------------
$(document).delegate('span[data-widget="visu.shifter"]', { 
        'update': function(event, response) {
        var step = Math.min((response / $(this).attr('data-max') * 10 + 0.49).toFixed(0) * 10, 100);
        $('#' + this.id + ' img').attr('src', $(this).attr('data-pic').replace('00', step));
    }
});

// ----- visu.map --------------------------------------------------------------
$(document).delegate('[data-widget="visu.map"]', {
    'update': function(event, response) {
        var val = parseFloat(response).toFixed(2);
        
        var str_map = $(this).attr('data-map-str').explode();
        var min_map = $(this).attr('data-map-min').explode();
        var max_map = $(this).attr('data-map-max').explode();

        for (var i = 0; i < str_map.length; i++) {
            var min = parseFloat(min_map[i]).toFixed(2);
            var max = parseFloat(max_map[i]).toFixed(2);
            if (min <= val && max >= val) {
                $('#' + this.id).html(str_map[i]);
                return;
            }
        }
        
        $('#' + this.id).html("invalid mapping");
    }
});

// ----- visu.uzsu_icon --------------------------------------------------------
$(document).delegate('[data-widget="visu.uzsu_icon"]', {
    'update': function(event, response) {
        var active = response.length > 0 ? response[0].active : false;
        $('#' + this.id + ' img').attr('src', (active ? $(this).attr('data-pic-on') : $(this).attr('data-pic-off')));
        console.log(response);

        if (response.length == 0)
            return;

		if (response[0].list instanceof Array) {
            $(this).data('uzsu', response[0]);
		} else {
            $(this).data('uzsu', { active: true, list: [] });
        }
    },
    'click': function(event) {
        var response = $(this).data('uzsu');
        if (response === undefined) {
        	console.log('config item not defined');
        	alert('config item not defined');
        } else {
        	var type = $(this).attr('data-type');
        	var min = $(this).attr('data-min');
        	var max = $(this).attr('data-max');
        	var items = widget.explode($(this).attr('data-item'))
        
        	$('#' + $.mobile.activePage.attr('id')).data('uzsu').open(type, response.active, response.list, items, min, max);
        }
	}
});

$(document).on('pagecreate',function(event){
    if (event.target.id != 'qlock')
        $('#' + event.target.id).data('uzsu', new UzsuPopup('#' + event.target.id));
});

var UzsuPopup = function(id) {
    this.init(id);
}

UzsuPopup.prototype = {
    // true, if the UZSU is active, false otherwise
    active: true,

    // list of the backend items
    items: [],

    // the list of all uzsu entries
    list: [],

    // dialog history
    history: [],

    img: {
        active: '',
        inactive: ''
    },

    // the value type
    type: 'bool',

    current: {
        // the current visible panel 
        panel: '',

        // the current list entry
        entry: {},

        // if the current entry is new
        isNew: false,

        // the list index of the current entry
        // only valid if isNew is false
        index: 0
    },

    // variable names from the HTML structure
    vars: {
        id: '',
        popup: '.popupUZSU',
        main: '.panel_list',
        list: '.uzsu-items',
        dateType: '.panel_date_type',
        timeType: '.panel_time_type',
        time: '.panel_time',
        valuePanelPrefix: '.panel_value_',
    },

    init: function(id) {
        this.vars.id = id;
        this.vars.popup = id + ' .popupUZSU';
        this.vars.main = id + ' .panel_list';
        this.vars.list = id + ' .uzsu-items';
        this.vars.dateType = id + ' .panel_date_type';
        this.vars.timeType = id + ' .panel_time_type';
        this.vars.time = id + ' .panel_time';
        this.vars.valuePanelPrefix = id + ' .panel_value_';

        // add events
        $(this.vars.main + ' .close').on('click', $.proxy(this.close, this));
        $(this.vars.main + ' .ok').on('click', $.proxy(this.save, this));
        $(this.vars.main + ' .add').on('click', $.proxy(this.add, this));
        $(this.vars.popup + ' .prev').on('click', $.proxy(this.prev, this));
        $(this.vars.main + ' .activate').on('click', $.proxy(this.activate, this));

        $(this.vars.main).on('click', 'li', $.proxy(function(e) {
            if ($(e.target).closest('div.split-custom-wrapper') == undefined)
                this.change($(this.vars.main + ' li').index($(e.target).closest('li')));
        }, this));
        $(this.vars.main).on('click', 'a.delete', $.proxy(function(e) {
            element = $(e.target).closest('li');
            this.delete($(this.vars.main + ' li').index(element), element);
        }, this));
        $(this.vars.main).on('click', 'a.enable', $.proxy(function(e) {
            this.enable($(this.vars.main + ' li').index($(e.target).closest('li')), true);
        }, this));
        $(this.vars.main).on('click', 'a.disable', $.proxy(function(e) {
            this.enable($(this.vars.main + ' li').index($(e.target).closest('li')), false);
        }, this));

        $(this.vars.popup).on('popupbeforeposition', $.proxy(this.next, this));

        // init panels
        $.proxy(this.panels.time.init, this)();
        $.proxy(this.panels.dateType.init, this)();
        $.proxy(this.panels.timeType.init, this)();
        $.proxy(this.panels.values.percent.init, this)();
        $.proxy(this.panels.values.boolean.init, this)();
    },

    open: function(type, active, list, items, min, max) {
        this.min = min.length > 0 ? parseInt(min) : 0;
        this.max = max.length > 0 ? parseInt(max) : 255;
        this.list = list;
        this.type = type;
        this.active = active;
        this.history = [];
        this.current.panel = '';

        if (items instanceof Array) {
            this.items = items;
        } else {
            this.items = [ items ];
        }
        
        $(this.vars.popup).popup();
        $(this.vars.popup).popup('open');
    },

    close: function() {
        $(this.vars.popup).popup('close');
    },

    refresh: function() {
        var ret = '', line = '';

        // clear the list
        $(this.vars.list).empty();

	    for (var i = 0; i < this.list.length; i++) {
            var item = this.list[i];
            ret = '';
            // ret += '<img class="icon ui-li-thumb" src="' + (item.active ? this.img.active : this.img.inactive) + '" />';
            ret += '<a><h3>';
            if (item.rrule) {
                if (item.rrule == 'FREQ=DAILY')
                    ret += 'Täglich';
                else if (item.rrule == 'FREQ=WEEKLY;WKST=SU;BYDAY=MO,TU,WE,TH,FR')
                    ret += 'Werktage';
                else if (item.rrule == 'FREQ=WEEKLY;WKST=SU;BYDAY=SA,SU')
                    ret += 'Wochenende';
                else
                    ret += 'Benutzerdefiniert'
            }
            ret += ' um ' + item.time.replace('<','&lt') + ' Uhr</h3></a>';
            ret += '<div class="split-custom-wrapper">'
            ret += '<a data-role="button" class="split-custom-button delete" data-icon="minus" data-iconpos="notext"></a>'
            if (item.active)
                ret += '<a data-role="button" class="split-custom-button disable" data-icon="delete" data-iconpos="notext"></a>' 
            else
                ret += '<a data-role="button" class="split-custom-button enable" data-icon="check" data-iconpos="notext"></a>' 
            ret += '</div>'
		    //ret += '<a href="#delete">Löschen</a>';
            line += '<li data-icon="false">' + ret + '</li>';
        }

        // set the actual content
	    $(this.vars.list).html(line).trigger('prepare').listview('refresh').trigger('redraw').trigger('create');
        
        $(this.vars.main + ' .activate').buttonMarkup({ icon: (this.active ? 'delete' : 'check') });
    },

    save: function() {
        for (var i = 0; i < this.items.length; i++) {
            io.write(this.items[i], { active: this.active, list: this.list });
        }
        this.close();
    },

    next: function(value) {
        var panel = this.vars.main;

        switch (this.current.panel) {
            case this.vars.main:
                panel = this.vars.valuePanelPrefix + this.type;
                break;

            // result of the date type chooser
            case this.vars.dateType:
                switch (value) {
                    case 0:
                        this.current.entry.rrule = 'FREQ=DAILY';
                        panel = this.vars.timeType;
                        break;
                    case 1:
                        this.current.entry.rrule = 'FREQ=WEEKLY;WKST=SU;BYDAY=MO,TU,WE,TH,FR';
                        panel = this.vars.timeType;
                        break;
                    case 2:
                        this.current.entry.rrule = 'FREQ=WEEKLY;WKST=SU;BYDAY=SA,SU';
                        panel = this.vars.timeType;
                        break;
                }
                break;

            // result of the time type chooser
            case this.vars.timeType:
                switch (value) {
                    case 0:
                        panel = this.vars.time;
                        break;
                }
                break;

            // result of the time chooser
            case this.vars.time:
                var value = this.current.entry.time;
                if (value.length != 4)
                    return;
                this.current.entry.time = value.substr(0,2) + ':' + value.substr(2,2);
                if (this.current.isNew) {
                    this.list.push(this.current.entry);
                } else {
                    this.list[this.current.index] = this.current.entry;
                }                
                break;

            // result of a value panel
            case this.panels.values.percent.id:
            case this.panels.values.boolean.id:
                panel = this.vars.dateType;
                break;
        }

        $(this.vars.popup + ' > div').hide();

        // if the next panel ist the main panel
        // a new entry was added to the list
        if (panel == this.vars.main) {
            this.history = [];
            this.refresh();
        } else {
            this.history.push(this.current.panel);
        }

        // show the panel
        $(panel).show().trigger('change');
        
        // remember the current panel
        this.current.panel = panel;
    },

    prev: function() {
        panel = this.history.pop();
        if (panel) {
            $(this.vars.popup + ' > div').hide();
            $(panel).show().trigger('change');
            this.current.panel = panel;
        }
    },

    change: function(index) {
        this.current.isNew = false;
        this.current.index = index;
        this.current.entry = $.extend({}, this.list[index]);
        this.next();
    },

    delete: function(index, element) {
        this.list.splice(index, 1);
        element.remove();
        $(this.vars.list).listview('refresh');
    },

    activate: function() {
        var el = $(this.vars.main + ' .activate');
        this.active = el.attr('data-icon') == 'check';
        el.buttonMarkup({ icon: ( this.active ? 'delete' : 'check') });
    },

    enable: function(index, active) {
        this.list[index].active = active;
        this.refresh();
    },

    add: function() {
        this.current.isNew = true;
        this.current.entry = { value: 0, time: '', active: true, rrule: '' };
        this.next();
    },

    panels: {
        dateType: {
            init: function() {
                $(this.vars.dateType).on('click', 'li', $.proxy(function(e) {
                    this.next.call(this, $(this.vars.dateType + ' li').index($(e.target)));
                }, this));
            }
        },

        timeType: {
            init: function() {
                $(this.vars.timeType).on('click', 'li', $.proxy(function(e) {
                    this.next.call(this, $(this.vars.timeType + ' li').index($(e.target)));
                }, this));
            }
        },

        time: {
            init: function() {
                $(this.vars.time).on('change', $.proxy(this.panels.time.refresh, this));
                $(this.vars.time + ' .next').on('click', $.proxy(this.next, this));
                $(this.vars.time + ' .number_button').on('click', $.proxy(function(e) {
                    this.panels.time.btnClicked.call(this, $(e.target).text());
                }, this));
            },

            btnClicked: function(txt) {
                var value = this.current.entry.time;

                if (txt == 'AC')
                    value = '';
                else if (txt == 'C')
                    value = value.substring(0, value.length - 1);
                else {
                    switch (value.length) {
                        case 0:
                            if (parseInt(txt) <= 2)
                                value += txt;
                            break;
                        case 1:
                            if (parseInt(value) <= 1)
                                value += txt;
                            else if (parseInt(txt) <= 3)
                                value += txt;
                            break;
                        case 2:
                            if (parseInt(txt) <= 5)
                                value += txt;
                            break;
                        case 3:
                            value += txt;
                            break;
                    }
                }

                this.current.entry.time = value;
                $(this.vars.time).trigger('change');
            },

            refresh: function() {
                var value = this.current.entry.time;
                var text = '__:__';
                switch (value.length) {
                    case 1: text = value + '_:__'; break;
                    case 2: text = value + ':__'; break;
                    case 3: text = value.substr(0,2) + ':' + value.substr(2,1) + '_'; break;
                    case 4: text = value.substr(0,2) + ':' + value.substr(2,2); break;
                    case 5: text = value; this.current.entry.time = value.substr(0,2) + value.substr(3,2); break;
                }
                $(this.vars.time + ' .numpad_value span:first').text(text + ' Uhr');
            }
        },

        values: {
            percent: {
                init: function() {
                    this.panels.values.percent.id = this.vars.valuePanelPrefix + 'percent';
                    $(this.panels.values.percent.id).on('change', $.proxy(this.panels.values.percent.refresh, this));
                    $(this.panels.values.percent.id + ' .next').on('click', $.proxy(this.next, this));
                    $(this.panels.values.percent.id + ' .number_button').on('click', $.proxy(function(e) {
                        this.panels.values.percent.btnClicked.call(this, $(e.target).text());
                    }, this));
                },

                btnClicked: function(txt) {
                    var value = this.current.entry.value == 0 ? 0 : Math.round(this.current.entry.value / this.max * 100);
                    value = value.toString();

                    if (txt == 'AC')
                        value = '0';
                    else if (txt == 'C')
                        value = Math.round(value / 10);
                    else if (value == '0')
                        value = txt;
                    else
                        value += txt;
                    
                    // validation checks
                    if (parseInt(value) > 100)
                        value = value.substring(0, value.length - 1);
                    
                    this.current.entry.value = Math.round(this.max / 100 * parseInt(value));
                    $(this.panels.values.percent.id).trigger('change');
                },

                refresh: function() {
                    var value = Math.round(this.current.entry.value / this.max * 100)
                    $(this.panels.values.percent.id + ' .numpad_value span:first').text(value + " %");
                }
            },

            boolean: {
                init: function() {
                    this.panels.values.boolean.id = this.vars.valuePanelPrefix + 'bool';
                    $(this.panels.values.boolean.id).on('change', $.proxy(this.panels.values.boolean.refresh, this));
                    $(this.panels.values.boolean.id + ' select').on('slidestop', $.proxy(this.panels.values.boolean.slidestop, this));
                    $(this.panels.values.boolean.id + ' .next').on('click', $.proxy(this.next, this));
                },

                refresh: function(e) {
                    if ($(e.target).is($(this.panels.values.boolean.id)))                    
                        $(this.panels.values.boolean.id + ' > div > select').val(this.current.entry.value).slider("refresh");
                },

                slidestop: function() {
                    this.current.entry.value = $(this.panels.values.boolean.id + ' > div > select').val();
                }
            }
        }
    }
};

// ----- M U L T I S T A T E - B U T T O N---------------------------------------------------
// ----- buttons.multistate_button ----------------------------------------------------------

var multistate_debug = "zZz";

$(document).delegate('span[data-widget="buttons.multistate_button"]', { 
	'update': function(event, response) {
		var pics = $(this).attr('data-pics').explode();
		var vals = $(this).attr('data-vals').explode();
		var txts = $(this).attr('data-txts').explode();
		var anz = parseInt($(this).attr('data-anz'));

		var num = 0;
		var found = 0;
		
		do {
			if (response.toString() == vals[num]) {
				found = 1;
				break;
			}
			num = num + 1;
		} while ((found == 0) && (num < anz));
		
		if (found == 1) {
			$('#' + this.id + ' img').attr('src', pics[num]);
			$('#' + this.id + ' img').attr('title', txts[num]);
			if (multistate_debug.search( 'zZz' + this.id + 'debugzZz' ) != -1) {
				$('#' + this.id + 'debug').html($('#' + this.id + 'debug').html() + '<b>Update: </b>' + response + '<font color="green">  &nbsp &nbsp [OK]</font><br>');
			}
		}
		else {
			if (multistate_debug.search( 'zZz' + this.id + 'debugzZz') != -1) {
				$('#' + this.id + 'debug').html($('#' + this.id + 'debug').html() + '<b>Update: </b>' + response + '<font color="red">  &nbsp &nbsp [unknown value]</font><br>');
			}
			$('#' + this.id + ' img').attr('src', 'icons/or/message_attention.png');
			$('#' + this.id + ' img').attr('title', 'Unknown value: ' + response.toString());
		}
	},

	'click': function(event) {
		var vals = $(this).attr('data-vals').explode();
		var anz = parseInt($(this).attr('data-anz'));

		var num = 0;
		var found = 0;
		
		do {
			var wert_alt = widget.get($(this).attr('data-item'));
			if ( wert_alt == vals[num]) {
				found = 1;
				break;
			}
			num = num + 1;
		} while ((found == 0) && (num < anz));
		
		
		if ((found == 0) || (num == anz-1)) {
			wert_neu = vals[0];
		}
		else {
			wert_neu = vals[num+1];
		}

		if (multistate_debug.search('zZz' + this.id + 'debugzZz') != -1) {
			$('#' + this.id + 'debug').html($('#' + this.id + 'debug').html() + '<b>Click: </b> old value: ' + wert_alt + ' new value: ' + wert_neu + '<br>');
		}
		
		io.write($(this).attr('data-item'), wert_neu);
	}
});

var multi_debug = "zZz";

// ----- buttons.switch_button ----------------------------------------------------------
$(document).delegate('span[data-widget="buttons.switch_button"]', { 
	'update': function(event, response) {
		if (response == $(this).attr('data-val')) {
			$('#' + this.id + ' img').attr('src', $(this).attr('data-pic-on'));
		}
		else {
			$('#' + this.id + ' img').attr('src', $(this).attr('data-pic-off'));
		}
		if (multi_debug.search( 'zZz' + this.id + 'debugzZz' ) != -1) {
			$('#' + this.id + 'debug').html($('#' + this.id + 'debug').html() + '<b>Update: </b>' + response + '<br>');
		}
    },

	'click': function(event) {
		var thisId = this.id;
		thisId = thisId.substring(0,thisId.lastIndexOf('_'));
		thisId = thisId + '_0debug';
		if (multi_debug.search( 'zZz' + thisId + 'zZz' ) != -1) {
			$('#' + thisId ).html($('#' + thisId ).html() + '<b>Click: </b>' + $(this).attr('data-val') + '<br>');
		}
		if ($(this).attr('data-val') != '') {
			io.write($(this).attr('data-item'), $(this).attr('data-val'));  
		}
	}
});

$(document).delegate('span[data-widget="buttons.switch_button"] > a > img', 'hover', function( event ) {
    if( event.type === 'mouseenter' )  
        $(this).addClass("ui-focus");
    else
        $(this).removeClass("ui-focus");  
});

// ----- buttons.check_item ----------------------------------------------------------
$(document).delegate('span[data-widget="buttons.check_item"]', { 
	'update': function(event, response) {
		if (widget.get($(this).attr('data-item')) == 'undefined') {
			$('#' + this.id + ' a').html('<font color="red">  &nbsp &nbsp [Error]</font>');
		}
		else {
			$('#' + this.id + ' a').html('<font color="green">  &nbsp &nbsp [OK]</font>');
		}
    }
});

// ----- buttons.check_set_data ----------------------------------------------------------

var check_set_data_active = 'zZz';
$(document).delegate('span[data-widget="buttons.check_set_data"]', { 
	'update': function(event, response) {
		if (check_set_data_active.search('zZz' + this.id + 'zZz') == -1) {
			check_set_data_active = check_set_data_active + this.id + 'zZz';
			
			var vals = $(this).attr('data-vals').explode();
			var anz = parseInt($(this).attr('data-anz'));
		
			$('#' + this.id + ' a').html('<br>');
			var num = 0;
			
			do {
				$('#' + this.id + ' a').html($('#' + this.id + ' a').html() + 'write: ' + vals[num]);
				io.write($(this).attr('data-item'), vals[num]);
				wert = widget.get($(this).attr('data-item'));
				if ( wert == vals[num]) {
					$('#' + this.id + ' a').html($('#' + this.id + ' a').html() + ' / read: ' + wert + '<font color="green">  &nbsp &nbsp [OK]</font><br>');
				}
				else {
					$('#' + this.id + ' a').html($('#' + this.id + ' a').html() + ' / read: ' + wert + '<font color="red">  &nbsp &nbsp [Error]</font><br>');
				}
				num = num + 1;
			} while (num < anz);
		}
	}
});

// ----- buttons.multi_state_debug ----------------------------------------------------------
$(document).delegate('span[data-widget="buttons.multi_state_debug"]', { 
	'update': function(event, response) {
		if (multistate_debug.search('zZz' + this.id + 'zZz') == -1) {
			multistate_debug = multistate_debug + this.id + 'zZz';
		}
	}
});

// ----- buttons.multi_debug ----------------------------------------------------------
$(document).delegate('span[data-widget="buttons.multi_debug"]', { 
	'update': function(event, response) {
		if (multi_debug.search('zZz' + this.id + 'zZz') == -1) {
			multi_debug = multi_debug + this.id + 'zZz';
		}
	}
});

// ----- visu.silder ---------------------------------------------------------
// The slider had to be handled in a more complex manner. A 'lock' is used
// to stop the change after a refresh. And a timer is used to fire the trigger
// only every 400ms if it was been moved. There should be no trigger on init.
$(document).delegate('input[data-widget="visu.slider"]', {
	'update': function (event, response) {
		// DEBUG: console.log("[basic.slider] update '" + this.id + "': " + response + " timer: " + $(this).attr('timer') + " lock: " + $(this).attr('lock'));   
		$(this).attr('lock', 1);
		$('#' + this.id).val(response).slider('refresh').attr('mem', $(this).val());
	},

	'slidestop': function (event) {
		if ($(this).val() != $(this).attr('mem')) {
			io.write($(this).attr('data-item'), $(this).val());
		}
	},

	'change': function (event) {
		// DEBUG: console.log("[basic.slider] change '" + this.id + "': " + $(this).val() + " timer: " + $(this).attr('timer') + " lock: " + $(this).attr('lock'));   
		if (( $(this).attr('timer') === undefined || $(this).attr('timer') == 0 && $(this).attr('lock') == 0 )
			&& ($(this).val() != $(this).attr('mem'))) {

			if ($(this).attr('timer') !== undefined) {
				$(this).trigger('click');
			}

			$(this).attr('timer', 1);
			setTimeout("$('#" + this.id + "').attr('timer', 0);", 400);
		}

		$(this).attr('lock', 0);
	},

	'click': function (event) {
		// $('#' + this.id).attr('mem', $(this).val());       
		io.write($(this).attr('data-item'), $(this).val());
	}
});

// ----- visu.maptext -----------------------------------------------------------
$(document).delegate('[data-widget="visu.maptext"]', {
	'update': function (event, response) {
		var txt_arr = widget.explode($(this).attr('data-txt'));
		var val_arr = widget.explode($(this).attr('data-val'));
		var match;
		var index;
		for (index = 0; index < val_arr.length; index++) {
			if (val_arr[index] == response) {
				match = txt_arr[index];
			}
		}
		$('#' + this.id).html(match);
	}
});

// ----- visu.activelist -----------------------------------------------------------
$(document).delegate('span[data-widget="visu.activelist"]',{
    update:function(d,a){
         $("#"+this.id+"  img").attr("src",a==$(this).attr("data-val-on")?$(this).attr("data-pic-on"):$(this).attr("data-pic-off"));
        if (a == $(this).attr('data-val-on')) {
            $('#' + this.id).show();
        } else {
            $('#' + this.id).hide();
        }
    },
    click:function(d){
         $("#"+this.id+"  img").attr("src")==$(this).attr("data-pic-off")?io.write($(this).attr("data-item"),$(this).attr("data-val-on")):io.write($(this).attr("data-item"),$(this).attr("data-val-off"))
    }
});

// ----- visu.notifybadge -------------------------------------------------------
$(document).delegate('span[data-widget="visu.notifybadge"]', {
	'update': function (event, response) {
		$('#' + this.id).attr('data-notifications', response);
	},
	'change': function (event) {
		$('#' + this.id).attr('data-notifications', response);
	}
});


// ----- visu.sound --------------------------------------------------------------

$(document).delegate('[data-widget="visu.sound"]', {
	'update': function (event, response) {
		//var sound = $(this).attr('soundfile');
		var volume = $(this).attr('volume');
		if ($(this).attr('match') == response) {
			if (document.getElementById(this.id).getAttribute('active') != 1){
				document.getElementById(this.id).volume = volume/100;
				document.getElementById(this.id).play();
				document.getElementById(this.id).setAttribute('active','1');
				if ($(this).attr('title')){ notify.info($(this).attr('title'), $(this).attr('message')); }
			}
		}else {
			document.getElementById(this.id).setAttribute('active','0');
		}
	}
});
