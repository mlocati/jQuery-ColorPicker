(function ($) {
	var ColorPicker = function () {
		var
			charMin = 65,
			tpl = '<div class="colorpicker ui-datepicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><label for="hex">#</label><input type="text" maxlength="6" size="6" id="hex" /></div><div class="colorpicker_rgb_r colorpicker_field"><label for="rbg_r">R</label><input type="text" maxlength="3" size="3" id="rgb_r" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><label for="rbg_g">G</label><input type="text" maxlength="3" size="3" id="rgb_g" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><label for="rbg_b">B</label><input type="text" maxlength="3" size="3" id="rgb_b" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><label for="hsb_h">H</label><input type="text" maxlength="3" size="3" id="hsb_h" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><label for="hsb_s">S</label><input type="text" maxlength="3" size="3" id="hsb_s" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><label for="hsb_b">B</label><input type="text" maxlength="3" size="3" id="hsb_b" /><span></span></div><div class="colorpicker_list"></div><div class="colorpicker_none"></div><div class="colorpicker_submit"></div></div>',
			defaults = {
				eventName: 'click',
				onShow: function () {},
				onBeforeShow: function(){},
				onHide: function () {},
				onChange: function () {},
				onSubmit: function () {},
				color: 'ff0000',
				livePreview: true,
				flat: false,
				showNone: false,
				fixColors: ["#ffffff", "#ffccc9", "#ffce93", "#fffc9e", "#ffffc7", "#9aff99", "#96fffb", "#cdffff", "#cbcefb", "#cfcfcf", "#fd6864", "#fe996b", "#fffe65", "#fcff2f", "#67fd9a", "#38fff8", "#68fdff", "#9698ed", "#c0c0c0", "#fe0000", "#f8a102", "#ffcc67", "#f8ff00", "#34ff34", "#68cbd0", "#34cdf9", "#6665cd", "#9b9b9b", "#cb0000", "#f56b00", "#ffcb2f", "#ffc702", "#32cb00", "#00d2cb", "#3166ff", "#6434fc", "#656565", "#9a0000", "#ce6301", "#cd9934", "#999903", "#009901", "#329a9d", "#3531ff", "#6200c9", "#343434", "#680100", "#963400", "#986536", "#646809", "#036400", "#34696d", "#00009b", "#303498", "#000000", "#330001", "#643403", "#663234", "#343300", "#013300", "#003532", "#010066", "#340096"]
			},
			fillRGBFields = function  (hsb, cal) {
				var rgb = HSBToRGB(hsb);
				$(cal).data('colorpicker').fields
					.eq(1).val(rgb.r).end()
					.eq(2).val(rgb.g).end()
					.eq(3).val(rgb.b).end();
			},
			fillHSBFields = function  (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(4).val(Math.round(hsb.h)).end()
					.eq(5).val(Math.round(hsb.s)).end()
					.eq(6).val(Math.round(hsb.b)).end();
			},
			fillHexFields = function (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(0).val(HSBToHex(hsb)).end();
			},
			setSelector = function (hsb, cal) {
				$(cal).data('colorpicker').selector.css('backgroundColor', '#' + HSBToHex({h: hsb.h, s: 100, b: 100}));
				$(cal).data('colorpicker').selectorIndic.css({
					left: parseInt(150 * hsb.s/100, 10),
					top: parseInt(150 * (100-hsb.b)/100, 10)
				});
			},
			setHue = function (hsb, cal) {
				$(cal).data('colorpicker').hue.css('top', parseInt(150 - 150 * hsb.h/360, 10));
			},
			setCurrentColor = function (hsb, cal) {
				$(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			setNewColor = function (hsb, cal) {
				$(cal).data('colorpicker').newColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			keyDown = function (ev) {
				var pressedKey = ev.charCode || ev.keyCode || -1;
				if ((pressedKey > charMin && pressedKey <= 90) || pressedKey === 32) {
					return false;
				}
				var cal = $(this).parent().parent();
				if (cal.data('colorpicker').livePreview === true) {
					change.apply(this);
				}
			},
			change = function (ev) {
				var cal = $(this).parent().parent(), col;
				if (this.parentNode.className.indexOf('_hex') > 0) {
					cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
				} else if (this.parentNode.className.indexOf('_hsb') > 0) {
					cal.data('colorpicker').color = col = fixHSB({
						h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
						s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
					});
				} else {
					cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
						r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
						g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
					}));
				}
				if (ev) {
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
				}
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
				cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col),  cal.data('colorpicker').parent ]);
			},
			blur = function (ev) {
				var cal = $(this).parent().parent();
				cal.data('colorpicker').fields.parent().removeClass('colorpicker_focus');
			},
			focus = function () {
				charMin = this.parentNode.className.indexOf('_hex') > 0 ? 70 : 65;
				$(this).parent().parent().data('colorpicker').fields.parent().removeClass('colorpicker_focus');
				$(this).parent().addClass('colorpicker_focus');
			},
			downIncrement = function (ev) {
				var field = $(this).parent().find('input').focus();
				var current = {
					el: $(this).parent().addClass('colorpicker_slider'),
					max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
					y: ev.pageY,
					field: field,
					val: parseInt(field.val(), 10),
					preview: $(this).parent().parent().data('colorpicker').livePreview
				};
				$(document).on('mouseup', current, upIncrement);
				$(document).on('mousemove', current, moveIncrement);
				return stopHighlight(ev);
			},
			moveIncrement = function (ev) {
				ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val - (ev.pageY - ev.data.y), 10))));
				if (ev.data.preview) {
					change.apply(ev.data.field.get(0), [true]);
				}
				return false;
			},
			upIncrement = function (ev) {
				change.apply(ev.data.field.get(0), [true]);
				ev.data.el.removeClass('colorpicker_slider').find('input').focus();
				$(document).off('mouseup', upIncrement);
				$(document).off('mousemove', moveIncrement);
				return false;
			},
			downHue = function (ev) {
				var current = {
					cal: $(this).parent(),
					y: $(this).offset().top
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).on('mouseup', current, upHue);
				$(document).on('mousemove', current, moveHue);
				return stopHighlight(ev);
			},
			moveHue = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(4)
						.val(parseInt(360*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.y))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upHue = function (ev) {
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).off('mouseup', upHue);
				$(document).off('mousemove', moveHue);
				return false;
			},
			changeHue = function(ev) {
				var y = $(this).offset().top, preview = ev.data.cal.data('colorpicker').livePreview;
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(4)
						.val(parseInt(360*(150 - Math.max(0,Math.min(150,(ev.pageY - y))))/150, 10))
						.get(0),
					[preview]
				);
			},
			downSelector = function (ev) {
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset()
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).on('mouseup', current, upSelector);
				$(document).on('mousemove', current, moveSelector);
				$(".colorpicker_color").one('click', current, moveSelector);
				ev.data = current;
				moveSelector(ev);
				return stopHighlight(ev);
			},
			moveSelector = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(6)
						.val(parseInt(100*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.pos.top))))/150, 10))
						.end()
						.eq(5)
						.val(parseInt(100*(Math.max(0,Math.min(150,(ev.pageX - ev.data.pos.left))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upSelector = function (ev) {
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset()
				};
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).off('mouseup', upSelector);
				$(document).off('mousemove', moveSelector);
				return false;
			},
			enterNone = function (ev) {
				$(this).addClass('colorpicker_focus');
			},
			leaveNone = function (ev) {
				$(this).removeClass('colorpicker_focus');
			},
			enterSubmit = function (ev) {
				$(this).addClass('colorpicker_focus');
			},
			leaveSubmit = function (ev) {
				$(this).removeClass('colorpicker_focus');
			},
			clickNone = function (ev) {
				var cal = $(this).parent();
				cal.data('colorpicker').onSubmit(null, "", null, cal.data('colorpicker').el, cal.data('colorpicker').parent);
			},
			clickSubmit = function (ev) {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').color;
				cal.data('colorpicker').origColor = col;
				setCurrentColor(col, cal.get(0));
				cal.data('colorpicker').onSubmit(col, HSBToHex(col), HSBToRGB(col), cal.data('colorpicker').el, cal.data('colorpicker').parent);
			},
			show = function (ev) {
				var cal = $('#' + $(this).data('colorpickerId'));
				cal.data('colorpicker').onBeforeShow.apply(this, [cal.get(0)]);
				var pos = $(this).offset();
				var viewPort = getViewport();
				var top = pos.top + this.offsetHeight;
				var left = pos.left;
				if (top + 176 > viewPort.t + viewPort.h) {
					top -= this.offsetHeight + 176;
				}
				if (left + (6 + 350 + 180) > viewPort.l + viewPort.w) {
					left -= (6 + 350 + 180 - 25);
				}
				cal.css({left: left + 'px', top: top + 'px'});
				if (cal.data('colorpicker').onShow.apply(this, [cal.get(0)]) != false) {
					cal.show();
				}
				$(document).on('mousedown', {cal: cal}, hide);
				return false;
			},
			hide = function (ev) {
				if (!isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
					if (ev.data.cal.data('colorpicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
						ev.data.cal.hide();
					}
					$(document).off('mousedown', hide);
				}
			},
			isChildOf = function(parentEl, el, container) {
				if (parentEl === el) {
					return true;
				}
				if (parentEl.contains) {
					return parentEl.contains(el);
				}
				if ( parentEl.compareDocumentPosition ) {
					return !!(parentEl.compareDocumentPosition(el) & 16);
				}
				var prEl = el.parentNode;
				while(prEl && prEl !== container) {
					if (prEl === parentEl){
                        return true;
                    }
					prEl = prEl.parentNode;
				}
				return false;
			},
			getViewport = function () {
				var m = document.compatMode == 'CSS1Compat';
				return {
					l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
					t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
					w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
					h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
				};
			},
			fixHSB = function (hsb) {
				return {
					h: Math.min(360, Math.max(0, hsb.h)),
					s: Math.min(100, Math.max(0, hsb.s)),
					b: Math.min(100, Math.max(0, hsb.b))
				};
			},
			fixRGB = function (rgb) {
				return {
					r: Math.min(255, Math.max(0, rgb.r)),
					g: Math.min(255, Math.max(0, rgb.g)),
					b: Math.min(255, Math.max(0, rgb.b))
				};
			},
			fixHex = function (hex) {
				var len = 6 - hex.length;
				if (len > 0) {
					var o = [];
					for (var i=0; i<len; i++) {
						o.push('0');
					}
					o.push(hex);
					hex = o.join('');
				}
				return hex;
			},
			HexToRGB = function (hex) {
				hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
				return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
			},
			HexToHSB = function (hex) {
				return RGBToHSB(HexToRGB(hex));
			},
			RGBToHSB = function (rgb) {
				var hsb = {
					h: 0,
					s: 0,
					b: 0
				};
				var min = Math.min(rgb.r, rgb.g, rgb.b);
				var max = Math.max(rgb.r, rgb.g, rgb.b);
				var delta = max - min;
				hsb.b = max;

				hsb.s = max != 0 ? 255 * delta / max : 0;
				if (hsb.s != 0) {
					if (rgb.r === max) {
						hsb.h = (rgb.g - rgb.b) / delta;
					} else if (rgb.g === max) {
						hsb.h = 2 + (rgb.b - rgb.r) / delta;
					} else {
						hsb.h = 4 + (rgb.r - rgb.g) / delta;
					}
				} else {
					hsb.h = -1;
				}
				hsb.h *= 60;
				if (hsb.h < 0) {
					hsb.h += 360;
				}
				hsb.s *= 100/255;
				hsb.b *= 100/255;
				return hsb;
			},
			HSBToRGB = function (hsb) {
				var rgb = {};
				var h = Math.round(hsb.h);
				var s = Math.round(hsb.s*255/100);
				var v = Math.round(hsb.b*255/100);
				if(s == 0) {
					rgb.r = rgb.g = rgb.b = v;
				} else {
					var t1 = v;
					var t2 = (255-s)*v/255;
					var t3 = (t1-t2)*(h%60)/60;
					if(h===360) {h = 0;}
					if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3;}
					else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3;}
					else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3;}
					else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3;}
					else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3;}
					else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3;}
					else {rgb.r=0; rgb.g=0;	rgb.b=0}
				}
				return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
			},
			RGBToHex = function (rgb) {
				var hex = [
					rgb.r.toString(16),
					rgb.g.toString(16),
					rgb.b.toString(16)
				];
				$.each(hex, function (nr, val) {
					if (val.length === 1) {
						hex[nr] = '0' + val;
					}
				});
				return hex.join('');
			},
			RGBstringToHex = function(rgb)
			{
				if (!rgb) {
					return '#FFFFFF';
				}
				var hex_rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				function hex(x) {
					return ("0" + parseInt(x,10).toString(16)).slice(-2);
				}
				if (hex_rgb) {
					return "#" + hex(hex_rgb[1]) + hex(hex_rgb[2]) + hex(hex_rgb[3]);
				} else {
					return rgb; //ie8 returns background-color in hex
				}
			},
			HSBToHex = function (hsb) {
				return RGBToHex(HSBToRGB(hsb));
			},
			restoreOriginal = function () {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').origColor;
				cal.data('colorpicker').color = col;
				fillRGBFields(col, cal.get(0));
				fillHexFields(col, cal.get(0));
				fillHSBFields(col, cal.get(0));
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
				cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col),  cal.data('colorpicker').parent]);
			},
			parseColor = function(color) {
				if (typeof color == 'string') {
					if(color.substring(0, 4) == "rgb(") {
						return HexToHSB(RGBstringToHex(color));
					} else {
						return HexToHSB(color);
					}
				} else if (color.r !== undefined && color.g !== undefined && color.b !== undefined) {
					return RGBToHSB(color);
				} else if (color.h !== undefined && color.s !== undefined && color.b !== undefined) {
					return fixHSB(color);
				} else {
					return null;
				}
			},
			setFixColor = function(color) {
				var col;
				if((col = parseColor($(this).css("background-color"))) !== null) {
					var cal = $(this).parent().parent();
					cal.data('colorpicker').color = col;
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
					setSelector(col, cal.get(0));
					setHue(col, cal.get(0));
					setNewColor(col, cal.get(0));
					cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col),  cal.data('colorpicker').parent]);
				}
				return false;
			};
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt||{});
				if((opt.color = parseColor(opt.color)) === null) {
					return this;
				}
				return this.each(function () {
					if (!$(this).data('colorpickerId')) {
						var options = $.extend({}, opt);
						options.origColor = opt.color;
						var idOk,
						    idCounter = 0;
						idOk = $('#colorpicker_' + idCounter).length === 0;
						while (!idOk){
							idCounter = parseInt(Math.random() * 10000);
							idOk = $('#colorpicker_' + idCounter).length === 0;
						}
						var id = 'colorpicker_' + idCounter;
						$(this).data('colorpickerId', id);
						options.parent = $(this);
						var cal = $(tpl);
						cal.attr('id', id).attr('data-parent', $(this).attr('id'));
						if (options.flat) {
							cal.appendTo(this).show();
						}
						else {
							cal.appendTo(document.body);
						}
						options.fields = cal
							.find('input')
								.on('keyup', keyDown)
								.on('change', change)
								.on('blur', blur)
								.on('focus', focus);
						cal
							.find('span').on('mousedown', downIncrement).end()
							.find('>div.colorpicker_current_color').on('click', restoreOriginal);
						options.selector = cal.find('div.colorpicker_color').on('mousedown', downSelector);
						options.selectorIndic = options.selector.find('div div');
						options.el = this;
						options.hue = cal.find('div.colorpicker_hue div');
						cal.find('div.colorpicker_hue').on('mousedown', downHue);
						cal.find('div.colorpicker_hue').on('mousedown', {cal: cal}, changeHue);
						options.newColor = cal.find('div.colorpicker_new_color');
						options.currentColor = cal.find('div.colorpicker_current_color');
						cal.data('colorpicker', options);
						if(options.showNone) {
							cal.find('div.colorpicker_none')
								.on('mouseenter', enterNone)
								.on('mouseleave', leaveNone)
								.on('click', clickNone);
						}
						else {
							cal.find('div.colorpicker_none').hide();
						}
						cal.find('div.colorpicker_submit')
							.on('mouseenter', enterSubmit)
							.on('mouseleave', leaveSubmit)
							.on('click', clickSubmit);
						fillRGBFields(options.color, cal.get(0));
						fillHSBFields(options.color, cal.get(0));
						fillHexFields(options.color, cal.get(0));
						if(options.fixColors) {
							var $list = cal.find(".colorpicker_list");
							$.each(options.fixColors, function(i, h) {
								$list.append($('<a href="#"></a>')
									.css("background-color", h)
									.on("click", setFixColor)
								)
							});
						}
						setHue(options.color, cal.get(0));
						setSelector(options.color, cal.get(0));
						setCurrentColor(options.color, cal.get(0));
						setNewColor(options.color, cal.get(0));
						if (options.flat) {
							cal.css({
								position: 'relative',
								display: 'block'
							});
						} else {
							$(this).on(options.eventName, show);
						}
					}
				});
			},
			showPicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						show.apply(this);
					}
				});
			},
			hidePicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						$('#' + $(this).data('colorpickerId')).hide();
					}
				});
			},
			destroyPicker: function() {
				return this.each( function () {
					var $this, id, cal, options;
					$this = $(this);
					id = $this.data("colorpickerId");
					if(id) {
						$this.ColorPickerHide();
						$(document)
							.off('mouseup', upHue)
							.off('mousemove', moveHue)
							.off('mouseup', upIncrement)
							.off('mousemove', moveIncrement)
							.off('mouseup', upSelector)
							.off('mousemove', moveSelector)
							.off('mousedown', hide);
						cal = $("#" + id);
						var options = cal.data("colorpicker");
						if(!options.flat) {
							$this.off(options.eventName, show);
						}
						$this.removeData("colorpickerId");
						cal.remove();
					}
				});
			},
			setColor: function(col) {
				if (typeof col == 'string') {
					if (col.substring(0, 4) == "rgb(") {
						col = HexToHSB(RGBstringToHex(col));
					} else {
						col = HexToHSB(col);
					}
				} else if (col.r !== undefined && col.g !== undefined && col.b !== undefined) {
					col = RGBToHSB(col);
				} else if (col.h !== undefined && col.s !== undefined && col.b !== undefined) {
					col = fixHSB(col);
				} else {
					return this;
				}
				return this.each(function(){
					if ($(this).data('colorpickerId')) {
						var cal = $('#' + $(this).data('colorpickerId'));
						cal.data('colorpicker').color = col;
						cal.data('colorpicker').origColor = col;
						fillRGBFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
						fillHexFields(col, cal.get(0));
						setHue(col, cal.get(0));
						setSelector(col, cal.get(0));
						setCurrentColor(col, cal.get(0));
						setNewColor(col, cal.get(0));
					}
				});
			}
		};
		function stopHighlight(e) {
			if (e.originalEvent.preventDefault)
				e.originalEvent.preventDefault();
			return false;
		}
	}();
	$.fn.extend({
		ColorPicker: ColorPicker.init,
		ColorPickerHide: ColorPicker.hidePicker,
		ColorPickerShow: ColorPicker.showPicker,
		ColorPickerSetColor: ColorPicker.setColor,
		ColorPickerDestroy: ColorPicker.destroyPicker
	});
})(jQuery);
