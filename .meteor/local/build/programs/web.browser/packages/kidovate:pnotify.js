//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;

/* Package-scope variables */
var PNotify;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/kidovate:pnotify/lib/js/jquery.pnotify.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*                                                                                                                     // 1
PNotify 2.0.0 sciactive.com/pnotify/                                                                                   // 2
(C) 2014 Hunter Perrin                                                                                                 // 3
license GPL/LGPL/MPL                                                                                                   // 4
*/                                                                                                                     // 5
/*                                                                                                                     // 6
 * ====== PNotify ======                                                                                               // 7
 *                                                                                                                     // 8
 * http://sciactive.com/pnotify/                                                                                       // 9
 *                                                                                                                     // 10
 * Copyright 2009-2014 Hunter Perrin                                                                                   // 11
 *                                                                                                                     // 12
 * Triple licensed under the GPL, LGPL, and MPL.                                                                       // 13
 * 	http://gnu.org/licenses/gpl.html                                                                                   // 14
 * 	http://gnu.org/licenses/lgpl.html                                                                                  // 15
 * 	http://mozilla.org/MPL/MPL-1.1.html                                                                                // 16
 */                                                                                                                    // 17
                                                                                                                       // 18
// Uses AMD or browser globals to create a jQuery plugin.                                                              // 19
(function (factory) {                                                                                                  // 20
    if (typeof define === 'function' && define.amd) {                                                                  // 21
        // AMD. Register as an anonymous module.                                                                       // 22
        define(['jquery'], factory);                                                                                   // 23
    } else {                                                                                                           // 24
        // Browser globals                                                                                             // 25
        factory(jQuery);                                                                                               // 26
    }                                                                                                                  // 27
}(function($) {                                                                                                        // 28
	var default_stack = {                                                                                                 // 29
		dir1: "down",                                                                                                        // 30
		dir2: "left",                                                                                                        // 31
		push: "bottom",                                                                                                      // 32
		spacing1: 25,                                                                                                        // 33
		spacing2: 25,                                                                                                        // 34
		context: $("body")                                                                                                   // 35
	};                                                                                                                    // 36
	var timer, // Position all timer.                                                                                     // 37
		body,                                                                                                                // 38
		jwindow = $(window);                                                                                                 // 39
	// Set global variables.                                                                                              // 40
	var do_when_ready = function(){                                                                                       // 41
		body = $("body");                                                                                                    // 42
		PNotify.prototype.options.stack.context = body;                                                                      // 43
		jwindow = $(window);                                                                                                 // 44
		// Reposition the notices when the window resizes.                                                                   // 45
		jwindow.bind('resize', function(){                                                                                   // 46
			if (timer)                                                                                                          // 47
				clearTimeout(timer);                                                                                               // 48
			timer = setTimeout(function(){ PNotify.positionAll(true) }, 10);                                                    // 49
		});                                                                                                                  // 50
	};                                                                                                                    // 51
	PNotify = function(options){                                                                                          // 52
		this.parseOptions(options);                                                                                          // 53
		this.init();                                                                                                         // 54
	};                                                                                                                    // 55
	$.extend(PNotify.prototype, {                                                                                         // 56
		// The current version of PNotify.                                                                                   // 57
		version: "2.0.0",                                                                                                    // 58
                                                                                                                       // 59
		// === Options ===                                                                                                   // 60
                                                                                                                       // 61
		// Options defaults.                                                                                                 // 62
		options: {                                                                                                           // 63
			// The notice's title.                                                                                              // 64
			title: false,                                                                                                       // 65
			// Whether to escape the content of the title. (Not allow HTML.)                                                    // 66
			title_escape: false,                                                                                                // 67
			// The notice's text.                                                                                               // 68
			text: false,                                                                                                        // 69
			// Whether to escape the content of the text. (Not allow HTML.)                                                     // 70
			text_escape: false,                                                                                                 // 71
			// What styling classes to use. (Can be either jqueryui or bootstrap.)                                              // 72
			styling: "bootstrap3",                                                                                              // 73
			// Additional classes to be added to the notice. (For custom styling.)                                              // 74
			addclass: "",                                                                                                       // 75
			// Class to be added to the notice for corner styling.                                                              // 76
			cornerclass: "",                                                                                                    // 77
			// Display the notice when it is created.                                                                           // 78
			auto_display: true,                                                                                                 // 79
			// Width of the notice.                                                                                             // 80
			width: "300px",                                                                                                     // 81
			// Minimum height of the notice. It will expand to fit content.                                                     // 82
			min_height: "16px",                                                                                                 // 83
			// Type of the notice. "notice", "info", "success", or "error".                                                     // 84
			type: "notice",                                                                                                     // 85
			// Set icon to true to use the default icon for the selected                                                        // 86
			// style/type, false for no icon, or a string for your own icon class.                                              // 87
			icon: true,                                                                                                         // 88
			// Opacity of the notice.                                                                                           // 89
			opacity: 1,                                                                                                         // 90
			// The animation to use when displaying and hiding the notice. "none",                                              // 91
			// "show", "fade", and "slide" are built in to jQuery. Others require jQuery                                        // 92
			// UI. Use an object with effect_in and effect_out to use different effects.                                        // 93
			animation: "fade",                                                                                                  // 94
			// Speed at which the notice animates in and out. "slow", "def" or "normal",                                        // 95
			// "fast" or number of milliseconds.                                                                                // 96
			animate_speed: "slow",                                                                                              // 97
			// Specify a specific duration of position animation                                                                // 98
			position_animate_speed: 500,                                                                                        // 99
			// Display a drop shadow.                                                                                           // 100
			shadow: true,                                                                                                       // 101
			// After a delay, remove the notice.                                                                                // 102
			hide: true,                                                                                                         // 103
			// Delay in milliseconds before the notice is removed.                                                              // 104
			delay: 8000,                                                                                                        // 105
			// Reset the hide timer if the mouse moves over the notice.                                                         // 106
			mouse_reset: true,                                                                                                  // 107
			// Remove the notice's elements from the DOM after it is removed.                                                   // 108
			remove: true,                                                                                                       // 109
			// Change new lines to br tags.                                                                                     // 110
			insert_brs: true,                                                                                                   // 111
			// Whether to remove notices from the global array.                                                                 // 112
			destroy: true,                                                                                                      // 113
			// The stack on which the notices will be placed. Also controls the                                                 // 114
			// direction the notices stack.                                                                                     // 115
			stack: default_stack                                                                                                // 116
		},                                                                                                                   // 117
                                                                                                                       // 118
		// === Modules ===                                                                                                   // 119
                                                                                                                       // 120
		// This object holds all the PNotify modules. They are used to provide                                               // 121
		// additional functionality.                                                                                         // 122
		modules: {},                                                                                                         // 123
		// This runs an event on all the modules.                                                                            // 124
		runModules: function(event, arg){                                                                                    // 125
			var curArg;                                                                                                         // 126
			for (var module in this.modules) {                                                                                  // 127
				curArg = ((typeof arg === "object" && module in arg) ? arg[module] : arg);                                         // 128
				if (typeof this.modules[module][event] === 'function')                                                             // 129
					this.modules[module][event](this, typeof this.options[module] === 'object' ? this.options[module] : {}, curArg);  // 130
			}                                                                                                                   // 131
		},                                                                                                                   // 132
                                                                                                                       // 133
		// === Class Variables ===                                                                                           // 134
                                                                                                                       // 135
		state: "initializing", // The state can be "initializing", "opening", "open", "closing", and "closed".               // 136
		timer: null, // Auto close timer.                                                                                    // 137
		styles: null,                                                                                                        // 138
		elem: null,                                                                                                          // 139
		container: null,                                                                                                     // 140
		title_container: null,                                                                                               // 141
		text_container: null,                                                                                                // 142
		animating: false, // Stores what is currently being animated (in or out).                                            // 143
		timerHide: false, // Stores whether the notice was hidden by a timer.                                                // 144
                                                                                                                       // 145
		// === Events ===                                                                                                    // 146
                                                                                                                       // 147
		init: function(){                                                                                                    // 148
			var that = this;                                                                                                    // 149
                                                                                                                       // 150
			// First and foremost, we don't want our module objects all referencing the prototype.                              // 151
			this.modules = {};                                                                                                  // 152
			$.extend(true, this.modules, PNotify.prototype.modules);                                                            // 153
                                                                                                                       // 154
			// Get our styling object.                                                                                          // 155
			if (typeof this.options.styling === "object") {                                                                     // 156
				this.styles = this.options.styling;                                                                                // 157
			} else {                                                                                                            // 158
				this.styles = PNotify.styling[this.options.styling];                                                               // 159
			}                                                                                                                   // 160
                                                                                                                       // 161
			// Create our widget.                                                                                               // 162
			// Stop animation, reset the removal timer when the user mouses over.                                               // 163
			this.elem = $("<div />", {                                                                                          // 164
				"class": "ui-pnotify "+this.options.addclass,                                                                      // 165
				"css": {"display": "none"},                                                                                        // 166
				"mouseenter": function(e){                                                                                         // 167
					if (that.options.mouse_reset && that.animating === "out") {                                                       // 168
						if (!that.timerHide)                                                                                             // 169
							return;                                                                                                         // 170
						// If it's animating out, animate back in really quickly.                                                        // 171
						that.elem.stop(true);                                                                                            // 172
						that.state = "open";                                                                                             // 173
						that.animating = "in";                                                                                           // 174
						that.elem.css("height", "auto").animate({"width": that.options.width, "opacity": that.options.opacity}, "fast"); // 175
					}                                                                                                                 // 176
					// Stop the close timer.                                                                                          // 177
					if (that.options.hide && that.options.mouse_reset) that.cancelRemove();                                           // 178
				},                                                                                                                 // 179
				"mouseleave": function(e){                                                                                         // 180
					// Start the close timer.                                                                                         // 181
					if (that.options.hide && that.options.mouse_reset) that.queueRemove();                                            // 182
					PNotify.positionAll();                                                                                            // 183
				}                                                                                                                  // 184
			});                                                                                                                 // 185
			// Create a container for the notice contents.                                                                      // 186
			this.container = $("<div />", {"class": this.styles.container+" ui-pnotify-container "+(this.options.type === "error" ? this.styles.error : (this.options.type === "info" ? this.styles.info : (this.options.type === "success" ? this.styles.success : this.styles.notice)))})
			.appendTo(this.elem);                                                                                               // 188
			if (this.options.cornerclass !== "")                                                                                // 189
				this.container.removeClass("ui-corner-all").addClass(this.options.cornerclass);                                    // 190
			// Create a drop shadow.                                                                                            // 191
			if (this.options.shadow)                                                                                            // 192
				this.container.addClass("ui-pnotify-shadow");                                                                      // 193
                                                                                                                       // 194
                                                                                                                       // 195
			// Add the appropriate icon.                                                                                        // 196
			if (this.options.icon !== false) {                                                                                  // 197
				$("<div />", {"class": "ui-pnotify-icon"})                                                                         // 198
				.append($("<span />", {"class": this.options.icon === true ? (this.options.type === "error" ? this.styles.error_icon : (this.options.type === "info" ? this.styles.info_icon : (this.options.type === "success" ? this.styles.success_icon : this.styles.notice_icon))) : this.options.icon}))
				.prependTo(this.container);                                                                                        // 200
			}                                                                                                                   // 201
                                                                                                                       // 202
			// Add a title.                                                                                                     // 203
			this.title_container = $("<h4 />", {                                                                                // 204
				"class": "ui-pnotify-title"                                                                                        // 205
			})                                                                                                                  // 206
			.appendTo(this.container);                                                                                          // 207
			if (this.options.title === false)                                                                                   // 208
				this.title_container.hide();                                                                                       // 209
			else if (this.options.title_escape)                                                                                 // 210
				this.title_container.text(this.options.title);                                                                     // 211
			else                                                                                                                // 212
				this.title_container.html(this.options.title);                                                                     // 213
                                                                                                                       // 214
			// Add text.                                                                                                        // 215
			this.text_container = $("<div />", {                                                                                // 216
				"class": "ui-pnotify-text"                                                                                         // 217
			})                                                                                                                  // 218
			.appendTo(this.container);                                                                                          // 219
			if (this.options.text === false)                                                                                    // 220
				this.text_container.hide();                                                                                        // 221
			else if (this.options.text_escape)                                                                                  // 222
				this.text_container.text(this.options.text);                                                                       // 223
			else                                                                                                                // 224
				this.text_container.html(this.options.insert_brs ? String(this.options.text).replace(/\n/g, "<br />") : this.options.text);
                                                                                                                       // 226
			// Set width and min height.                                                                                        // 227
			if (typeof this.options.width === "string")                                                                         // 228
				this.elem.css("width", this.options.width);                                                                        // 229
			if (typeof this.options.min_height === "string")                                                                    // 230
				this.container.css("min-height", this.options.min_height);                                                         // 231
                                                                                                                       // 232
                                                                                                                       // 233
			// Add the notice to the notice array.                                                                              // 234
			if (this.options.stack.push === "top")                                                                              // 235
				PNotify.notices = $.merge([this], PNotify.notices);                                                                // 236
			else                                                                                                                // 237
				PNotify.notices = $.merge(PNotify.notices, [this]);                                                                // 238
			// Now position all the notices if they are to push to the top.                                                     // 239
			if (this.options.stack.push === "top")                                                                              // 240
				this.queuePosition(false, 1);                                                                                      // 241
                                                                                                                       // 242
                                                                                                                       // 243
                                                                                                                       // 244
                                                                                                                       // 245
			// Mark the stack so it won't animate the new notice.                                                               // 246
			this.options.stack.animation = false;                                                                               // 247
                                                                                                                       // 248
			// Run the modules.                                                                                                 // 249
			this.runModules('init');                                                                                            // 250
                                                                                                                       // 251
			// Display the notice.                                                                                              // 252
			if (this.options.auto_display)                                                                                      // 253
				this.open();                                                                                                       // 254
			return this;                                                                                                        // 255
		},                                                                                                                   // 256
                                                                                                                       // 257
		// This function is for updating the notice.                                                                         // 258
		update: function(options){                                                                                           // 259
			// Save old options.                                                                                                // 260
			var oldOpts = this.options;                                                                                         // 261
			// Then update to the new options.                                                                                  // 262
			this.parseOptions(oldOpts, options);                                                                                // 263
			// Update the corner class.                                                                                         // 264
			if (this.options.cornerclass !== oldOpts.cornerclass)                                                               // 265
				this.container.removeClass("ui-corner-all "+oldOpts.cornerclass).addClass(this.options.cornerclass);               // 266
			// Update the shadow.                                                                                               // 267
			if (this.options.shadow !== oldOpts.shadow) {                                                                       // 268
				if (this.options.shadow)                                                                                           // 269
					this.container.addClass("ui-pnotify-shadow");                                                                     // 270
				else                                                                                                               // 271
					this.container.removeClass("ui-pnotify-shadow");                                                                  // 272
			}                                                                                                                   // 273
			// Update the additional classes.                                                                                   // 274
			if (this.options.addclass === false)                                                                                // 275
				this.elem.removeClass(oldOpts.addclass);                                                                           // 276
			else if (this.options.addclass !== oldOpts.addclass)                                                                // 277
				this.elem.removeClass(oldOpts.addclass).addClass(this.options.addclass);                                           // 278
			// Update the title.                                                                                                // 279
			if (this.options.title === false)                                                                                   // 280
				this.title_container.slideUp("fast");                                                                              // 281
			else if (this.options.title !== oldOpts.title) {                                                                    // 282
				if (this.options.title_escape)                                                                                     // 283
					this.title_container.text(this.options.title);                                                                    // 284
				else                                                                                                               // 285
					this.title_container.html(this.options.title);                                                                    // 286
				if (oldOpts.title === false)                                                                                       // 287
					this.title_container.slideDown(200)                                                                               // 288
			}                                                                                                                   // 289
			// Update the text.                                                                                                 // 290
			if (this.options.text === false) {                                                                                  // 291
				this.text_container.slideUp("fast");                                                                               // 292
			} else if (this.options.text !== oldOpts.text) {                                                                    // 293
				if (this.options.text_escape)                                                                                      // 294
					this.text_container.text(this.options.text);                                                                      // 295
				else                                                                                                               // 296
					this.text_container.html(this.options.insert_brs ? String(this.options.text).replace(/\n/g, "<br />") : this.options.text);
				if (oldOpts.text === false)                                                                                        // 298
					this.text_container.slideDown(200)                                                                                // 299
			}                                                                                                                   // 300
			// Change the notice type.                                                                                          // 301
			if (this.options.type !== oldOpts.type)                                                                             // 302
				this.container.removeClass(                                                                                        // 303
					this.styles.error+" "+this.styles.notice+" "+this.styles.success+" "+this.styles.info                             // 304
				).addClass(this.options.type === "error" ?                                                                         // 305
					this.styles.error :                                                                                               // 306
					(this.options.type === "info" ?                                                                                   // 307
						this.styles.info :                                                                                               // 308
						(this.options.type === "success" ?                                                                               // 309
							this.styles.success :                                                                                           // 310
							this.styles.notice                                                                                              // 311
						)                                                                                                                // 312
					)                                                                                                                 // 313
				);                                                                                                                 // 314
			if (this.options.icon !== oldOpts.icon || (this.options.icon === true && this.options.type !== oldOpts.type)) {     // 315
				// Remove any old icon.                                                                                            // 316
				this.container.find("div.ui-pnotify-icon").remove();                                                               // 317
				if (this.options.icon !== false) {                                                                                 // 318
					// Build the new icon.                                                                                            // 319
					$("<div />", {"class": "ui-pnotify-icon"})                                                                        // 320
					.append($("<span />", {"class": this.options.icon === true ? (this.options.type === "error" ? this.styles.error_icon : (this.options.type === "info" ? this.styles.info_icon : (this.options.type === "success" ? this.styles.success_icon : this.styles.notice_icon))) : this.options.icon}))
					.prependTo(this.container);                                                                                       // 322
				}                                                                                                                  // 323
			}                                                                                                                   // 324
			// Update the width.                                                                                                // 325
			if (this.options.width !== oldOpts.width)                                                                           // 326
				this.elem.animate({width: this.options.width});                                                                    // 327
			// Update the minimum height.                                                                                       // 328
			if (this.options.min_height !== oldOpts.min_height)                                                                 // 329
				this.container.animate({minHeight: this.options.min_height});                                                      // 330
			// Update the opacity.                                                                                              // 331
			if (this.options.opacity !== oldOpts.opacity)                                                                       // 332
				this.elem.fadeTo(this.options.animate_speed, this.options.opacity);                                                // 333
			// Update the timed hiding.                                                                                         // 334
			if (!this.options.hide)                                                                                             // 335
				this.cancelRemove();                                                                                               // 336
			else if (!oldOpts.hide)                                                                                             // 337
				this.queueRemove();                                                                                                // 338
			this.queuePosition(true);                                                                                           // 339
                                                                                                                       // 340
			// Run the modules.                                                                                                 // 341
			this.runModules('update', oldOpts);                                                                                 // 342
			return this;                                                                                                        // 343
		},                                                                                                                   // 344
                                                                                                                       // 345
		// Display the notice.                                                                                               // 346
		open: function(){                                                                                                    // 347
			this.state = "opening";                                                                                             // 348
			// Run the modules.                                                                                                 // 349
			this.runModules('beforeOpen');                                                                                      // 350
                                                                                                                       // 351
			var that = this;                                                                                                    // 352
			// If the notice is not in the DOM, append it.                                                                      // 353
			if (!this.elem.parent().length)                                                                                     // 354
				this.elem.appendTo(this.options.stack.context ? this.options.stack.context : body);                                // 355
			// Try to put it in the right position.                                                                             // 356
			if (this.options.stack.push !== "top")                                                                              // 357
				this.position(true);                                                                                               // 358
			// First show it, then set its opacity, then hide it.                                                               // 359
			if (this.options.animation === "fade" || this.options.animation.effect_in === "fade") {                             // 360
				// If it's fading in, it should start at 0.                                                                        // 361
				this.elem.show().fadeTo(0, 0).hide();                                                                              // 362
			} else {                                                                                                            // 363
				// Or else it should be set to the opacity.                                                                        // 364
				if (this.options.opacity !== 1)                                                                                    // 365
					this.elem.show().fadeTo(0, this.options.opacity).hide();                                                          // 366
			}                                                                                                                   // 367
			this.animateIn(function(){                                                                                          // 368
				that.queuePosition(true);                                                                                          // 369
                                                                                                                       // 370
				// Now set it to hide.                                                                                             // 371
				if (that.options.hide)                                                                                             // 372
					that.queueRemove();                                                                                               // 373
                                                                                                                       // 374
				that.state = "open";                                                                                               // 375
                                                                                                                       // 376
				// Run the modules.                                                                                                // 377
				that.runModules('afterOpen');                                                                                      // 378
			});                                                                                                                 // 379
                                                                                                                       // 380
			return this;                                                                                                        // 381
		},                                                                                                                   // 382
                                                                                                                       // 383
		// Remove the notice.                                                                                                // 384
		remove: function(timer_hide) {                                                                                       // 385
			this.state = "closing";                                                                                             // 386
			this.timerHide = !!timer_hide; // Make sure it's a boolean.                                                         // 387
			// Run the modules.                                                                                                 // 388
			this.runModules('beforeClose');                                                                                     // 389
                                                                                                                       // 390
			var that = this;                                                                                                    // 391
			if (this.timer) {                                                                                                   // 392
				window.clearTimeout(this.timer);                                                                                   // 393
				this.timer = null;                                                                                                 // 394
			}                                                                                                                   // 395
			this.animateOut(function(){                                                                                         // 396
				that.state = "closed";                                                                                             // 397
				// Run the modules.                                                                                                // 398
				that.runModules('afterClose');                                                                                     // 399
				that.queuePosition(true);                                                                                          // 400
				// If we're supposed to remove the notice from the DOM, do it.                                                     // 401
				if (that.options.remove)                                                                                           // 402
					that.elem.detach();                                                                                               // 403
				// Run the modules.                                                                                                // 404
				that.runModules('beforeDestroy');                                                                                  // 405
				// Remove object from PNotify.notices to prevent memory leak (issue #49)                                           // 406
				// unless destroy is off                                                                                           // 407
				if (that.options.destroy) {                                                                                        // 408
					if (PNotify.notices !== null) {                                                                                   // 409
						var idx = $.inArray(that,PNotify.notices);                                                                       // 410
						if (idx !== -1) {                                                                                                // 411
							PNotify.notices.splice(idx,1);                                                                                  // 412
						}                                                                                                                // 413
					}                                                                                                                 // 414
				}                                                                                                                  // 415
				// Run the modules.                                                                                                // 416
				that.runModules('afterDestroy');                                                                                   // 417
			});                                                                                                                 // 418
                                                                                                                       // 419
			return this;                                                                                                        // 420
		},                                                                                                                   // 421
                                                                                                                       // 422
		// === Class Methods ===                                                                                             // 423
                                                                                                                       // 424
		// Get the DOM element.                                                                                              // 425
		get: function(){ return this.elem; },                                                                                // 426
                                                                                                                       // 427
		// Put all the options in the right places.                                                                          // 428
		parseOptions: function(options, moreOptions){                                                                        // 429
			this.options = $.extend(true, {}, PNotify.prototype.options);                                                       // 430
			// This is the only thing that *should* be copied by reference.                                                     // 431
			this.options.stack = PNotify.prototype.options.stack;                                                               // 432
			var optArray = [options, moreOptions], curOpts;                                                                     // 433
			for (var curIndex in optArray) {                                                                                    // 434
				curOpts = optArray[curIndex];                                                                                      // 435
				if (typeof curOpts == "undefined")                                                                                 // 436
					break;                                                                                                            // 437
				if (typeof curOpts !== 'object') {                                                                                 // 438
					this.options.text = curOpts;                                                                                      // 439
				} else {                                                                                                           // 440
					for (var option in curOpts) {                                                                                     // 441
						if (this.modules[option]) {                                                                                      // 442
							// Avoid overwriting module defaults.                                                                           // 443
							$.extend(true, this.options[option], curOpts[option]);                                                          // 444
						} else {                                                                                                         // 445
							this.options[option] = curOpts[option];                                                                         // 446
						}                                                                                                                // 447
					}                                                                                                                 // 448
				}                                                                                                                  // 449
			}                                                                                                                   // 450
		},                                                                                                                   // 451
                                                                                                                       // 452
		// Animate the notice in.                                                                                            // 453
		animateIn: function(callback){                                                                                       // 454
			// Declare that the notice is animating in. (Or has completed animating in.)                                        // 455
			this.animating = "in";                                                                                              // 456
			var animation;                                                                                                      // 457
			if (typeof this.options.animation.effect_in !== "undefined")                                                        // 458
				animation = this.options.animation.effect_in;                                                                      // 459
			else                                                                                                                // 460
				animation = this.options.animation;                                                                                // 461
			if (animation === "none") {                                                                                         // 462
				this.elem.show();                                                                                                  // 463
				callback();                                                                                                        // 464
			} else if (animation === "show")                                                                                    // 465
				this.elem.show(this.options.animate_speed, callback);                                                              // 466
			else if (animation === "fade")                                                                                      // 467
				this.elem.show().fadeTo(this.options.animate_speed, this.options.opacity, callback);                               // 468
			else if (animation === "slide")                                                                                     // 469
				this.elem.slideDown(this.options.animate_speed, callback);                                                         // 470
			else if (typeof animation === "function")                                                                           // 471
				animation("in", callback, this.elem);                                                                              // 472
			else                                                                                                                // 473
				this.elem.show(animation, (typeof this.options.animation.options_in === "object" ? this.options.animation.options_in : {}), this.options.animate_speed, callback);
		},                                                                                                                   // 475
                                                                                                                       // 476
		// Animate the notice out.                                                                                           // 477
		animateOut: function(callback){                                                                                      // 478
			// Declare that the notice is animating out. (Or has completed animating out.)                                      // 479
			this.animating = "out";                                                                                             // 480
			var animation;                                                                                                      // 481
			if (typeof this.options.animation.effect_out !== "undefined")                                                       // 482
				animation = this.options.animation.effect_out;                                                                     // 483
			else                                                                                                                // 484
				animation = this.options.animation;                                                                                // 485
			if (animation === "none") {                                                                                         // 486
				this.elem.hide();                                                                                                  // 487
				callback();                                                                                                        // 488
			} else if (animation === "show")                                                                                    // 489
				this.elem.hide(this.options.animate_speed, callback);                                                              // 490
			else if (animation === "fade")                                                                                      // 491
				this.elem.fadeOut(this.options.animate_speed, callback);                                                           // 492
			else if (animation === "slide")                                                                                     // 493
				this.elem.slideUp(this.options.animate_speed, callback);                                                           // 494
			else if (typeof animation === "function")                                                                           // 495
				animation("out", callback, this.elem);                                                                             // 496
			else                                                                                                                // 497
				this.elem.hide(animation, (typeof this.options.animation.options_out === "object" ? this.options.animation.options_out : {}), this.options.animate_speed, callback);
		},                                                                                                                   // 499
                                                                                                                       // 500
		// Position the notice. dont_skip_hidden causes the notice to                                                        // 501
		// position even if it's not visible.                                                                                // 502
		position: function(dontSkipHidden){                                                                                  // 503
			// Get the notice's stack.                                                                                          // 504
			var s = this.options.stack;                                                                                         // 505
			if (typeof s.context === "undefined")                                                                               // 506
				s.context = body;                                                                                                  // 507
			if (!s) return;                                                                                                     // 508
			if (typeof s.nextpos1 !== "number")                                                                                 // 509
				s.nextpos1 = s.firstpos1;                                                                                          // 510
			if (typeof s.nextpos2 !== "number")                                                                                 // 511
				s.nextpos2 = s.firstpos2;                                                                                          // 512
			if (typeof s.addpos2 !== "number")                                                                                  // 513
				s.addpos2 = 0;                                                                                                     // 514
			var hidden = this.elem.css("display") === "none";                                                                   // 515
			// Skip this notice if it's not shown.                                                                              // 516
			if (!hidden || dontSkipHidden) {                                                                                    // 517
				var curpos1, curpos2;                                                                                              // 518
				// Store what will need to be animated.                                                                            // 519
				var animate = {};                                                                                                  // 520
				// Calculate the current pos1 value.                                                                               // 521
				var csspos1;                                                                                                       // 522
				switch (s.dir1) {                                                                                                  // 523
					case "down":                                                                                                      // 524
						csspos1 = "top";                                                                                                 // 525
						break;                                                                                                           // 526
					case "up":                                                                                                        // 527
						csspos1 = "bottom";                                                                                              // 528
						break;                                                                                                           // 529
					case "left":                                                                                                      // 530
						csspos1 = "right";                                                                                               // 531
						break;                                                                                                           // 532
					case "right":                                                                                                     // 533
						csspos1 = "left";                                                                                                // 534
						break;                                                                                                           // 535
				}                                                                                                                  // 536
				curpos1 = parseInt(this.elem.css(csspos1).replace(/(?:\..*|[^0-9.])/g, ''));                                       // 537
				if (isNaN(curpos1))                                                                                                // 538
					curpos1 = 0;                                                                                                      // 539
				// Remember the first pos1, so the first visible notice goes there.                                                // 540
				if (typeof s.firstpos1 === "undefined" && !hidden) {                                                               // 541
					s.firstpos1 = curpos1;                                                                                            // 542
					s.nextpos1 = s.firstpos1;                                                                                         // 543
				}                                                                                                                  // 544
				// Calculate the current pos2 value.                                                                               // 545
				var csspos2;                                                                                                       // 546
				switch (s.dir2) {                                                                                                  // 547
					case "down":                                                                                                      // 548
						csspos2 = "top";                                                                                                 // 549
						break;                                                                                                           // 550
					case "up":                                                                                                        // 551
						csspos2 = "bottom";                                                                                              // 552
						break;                                                                                                           // 553
					case "left":                                                                                                      // 554
						csspos2 = "right";                                                                                               // 555
						break;                                                                                                           // 556
					case "right":                                                                                                     // 557
						csspos2 = "left";                                                                                                // 558
						break;                                                                                                           // 559
				}                                                                                                                  // 560
				curpos2 = parseInt(this.elem.css(csspos2).replace(/(?:\..*|[^0-9.])/g, ''));                                       // 561
				if (isNaN(curpos2))                                                                                                // 562
					curpos2 = 0;                                                                                                      // 563
				// Remember the first pos2, so the first visible notice goes there.                                                // 564
				if (typeof s.firstpos2 === "undefined" && !hidden) {                                                               // 565
					s.firstpos2 = curpos2;                                                                                            // 566
					s.nextpos2 = s.firstpos2;                                                                                         // 567
				}                                                                                                                  // 568
				// Check that it's not beyond the viewport edge.                                                                   // 569
				if ((s.dir1 === "down" && s.nextpos1 + this.elem.height() > (s.context.is(body) ? jwindow.height() : s.context.prop('scrollHeight')) ) ||
					(s.dir1 === "up" && s.nextpos1 + this.elem.height() > (s.context.is(body) ? jwindow.height() : s.context.prop('scrollHeight')) ) ||
					(s.dir1 === "left" && s.nextpos1 + this.elem.width() > (s.context.is(body) ? jwindow.width() : s.context.prop('scrollWidth')) ) ||
					(s.dir1 === "right" && s.nextpos1 + this.elem.width() > (s.context.is(body) ? jwindow.width() : s.context.prop('scrollWidth')) ) ) {
					// If it is, it needs to go back to the first pos1, and over on pos2.                                             // 574
					s.nextpos1 = s.firstpos1;                                                                                         // 575
					s.nextpos2 += s.addpos2 + (typeof s.spacing2 === "undefined" ? 25 : s.spacing2);                                  // 576
					s.addpos2 = 0;                                                                                                    // 577
				}                                                                                                                  // 578
				// Animate if we're moving on dir2.                                                                                // 579
				if (s.animation && s.nextpos2 < curpos2) {                                                                         // 580
					switch (s.dir2) {                                                                                                 // 581
						case "down":                                                                                                     // 582
							animate.top = s.nextpos2+"px";                                                                                  // 583
							break;                                                                                                          // 584
						case "up":                                                                                                       // 585
							animate.bottom = s.nextpos2+"px";                                                                               // 586
							break;                                                                                                          // 587
						case "left":                                                                                                     // 588
							animate.right = s.nextpos2+"px";                                                                                // 589
							break;                                                                                                          // 590
						case "right":                                                                                                    // 591
							animate.left = s.nextpos2+"px";                                                                                 // 592
							break;                                                                                                          // 593
					}                                                                                                                 // 594
				} else {                                                                                                           // 595
					if(typeof s.nextpos2 === "number")                                                                                // 596
						this.elem.css(csspos2, s.nextpos2+"px");                                                                         // 597
				}                                                                                                                  // 598
				// Keep track of the widest/tallest notice in the column/row, so we can push the next column/row.                  // 599
				switch (s.dir2) {                                                                                                  // 600
					case "down":                                                                                                      // 601
					case "up":                                                                                                        // 602
						if (this.elem.outerHeight(true) > s.addpos2)                                                                     // 603
							s.addpos2 = this.elem.height();                                                                                 // 604
						break;                                                                                                           // 605
					case "left":                                                                                                      // 606
					case "right":                                                                                                     // 607
						if (this.elem.outerWidth(true) > s.addpos2)                                                                      // 608
							s.addpos2 = this.elem.width();                                                                                  // 609
						break;                                                                                                           // 610
				}                                                                                                                  // 611
				// Move the notice on dir1.                                                                                        // 612
				if (typeof s.nextpos1 === "number") {                                                                              // 613
					// Animate if we're moving toward the first pos.                                                                  // 614
					if (s.animation && (curpos1 > s.nextpos1 || animate.top || animate.bottom || animate.right || animate.left)) {    // 615
						switch (s.dir1) {                                                                                                // 616
							case "down":                                                                                                    // 617
								animate.top = s.nextpos1+"px";                                                                                 // 618
								break;                                                                                                         // 619
							case "up":                                                                                                      // 620
								animate.bottom = s.nextpos1+"px";                                                                              // 621
								break;                                                                                                         // 622
							case "left":                                                                                                    // 623
								animate.right = s.nextpos1+"px";                                                                               // 624
								break;                                                                                                         // 625
							case "right":                                                                                                   // 626
								animate.left = s.nextpos1+"px";                                                                                // 627
								break;                                                                                                         // 628
						}                                                                                                                // 629
					} else                                                                                                            // 630
						this.elem.css(csspos1, s.nextpos1+"px");                                                                         // 631
				}                                                                                                                  // 632
				// Run the animation.                                                                                              // 633
				if (animate.top || animate.bottom || animate.right || animate.left)                                                // 634
					this.elem.animate(animate, {duration: this.options.position_animate_speed, queue: false});                        // 635
				// Calculate the next dir1 position.                                                                               // 636
				switch (s.dir1) {                                                                                                  // 637
					case "down":                                                                                                      // 638
					case "up":                                                                                                        // 639
						s.nextpos1 += this.elem.height() + (typeof s.spacing1 === "undefined" ? 25 : s.spacing1);                        // 640
						break;                                                                                                           // 641
					case "left":                                                                                                      // 642
					case "right":                                                                                                     // 643
						s.nextpos1 += this.elem.width() + (typeof s.spacing1 === "undefined" ? 25 : s.spacing1);                         // 644
						break;                                                                                                           // 645
				}                                                                                                                  // 646
			}                                                                                                                   // 647
			return this;                                                                                                        // 648
		},                                                                                                                   // 649
		// Queue the position all function so it doesn't run repeatedly and                                                  // 650
		// use up resources.                                                                                                 // 651
		queuePosition: function(animate, milliseconds){                                                                      // 652
			if (timer)                                                                                                          // 653
				clearTimeout(timer);                                                                                               // 654
			if (!milliseconds)                                                                                                  // 655
				milliseconds = 10;                                                                                                 // 656
			timer = setTimeout(function(){ PNotify.positionAll(animate) }, milliseconds);                                       // 657
			return this;                                                                                                        // 658
		},                                                                                                                   // 659
                                                                                                                       // 660
                                                                                                                       // 661
		// Cancel any pending removal timer.                                                                                 // 662
		cancelRemove: function(){                                                                                            // 663
			if (this.timer)                                                                                                     // 664
				window.clearTimeout(this.timer);                                                                                   // 665
			return this;                                                                                                        // 666
		},                                                                                                                   // 667
		// Queue a removal timer.                                                                                            // 668
		queueRemove: function(){                                                                                             // 669
			var that = this;                                                                                                    // 670
			// Cancel any current removal timer.                                                                                // 671
			this.cancelRemove();                                                                                                // 672
			this.timer = window.setTimeout(function(){                                                                          // 673
				that.remove(true);                                                                                                 // 674
			}, (isNaN(this.options.delay) ? 0 : this.options.delay));                                                           // 675
			return this;                                                                                                        // 676
		}                                                                                                                    // 677
	});                                                                                                                   // 678
	// These functions affect all notices.                                                                                // 679
	$.extend(PNotify, {                                                                                                   // 680
		// This holds all the notices.                                                                                       // 681
		notices: [],                                                                                                         // 682
		removeAll: function () {                                                                                             // 683
			$.each(PNotify.notices, function(){                                                                                 // 684
				if (this.remove)                                                                                                   // 685
					this.remove();                                                                                                    // 686
			});                                                                                                                 // 687
		},                                                                                                                   // 688
		positionAll: function (animate) {                                                                                    // 689
			// This timer is used for queueing this function so it doesn't run                                                  // 690
			// repeatedly.                                                                                                      // 691
			if (timer)                                                                                                          // 692
				clearTimeout(timer);                                                                                               // 693
			timer = null;                                                                                                       // 694
			// Reset the next position data.                                                                                    // 695
			$.each(PNotify.notices, function(){                                                                                 // 696
				var s = this.options.stack;                                                                                        // 697
				if (!s) return;                                                                                                    // 698
				s.nextpos1 = s.firstpos1;                                                                                          // 699
				s.nextpos2 = s.firstpos2;                                                                                          // 700
				s.addpos2 = 0;                                                                                                     // 701
				s.animation = animate;                                                                                             // 702
			});                                                                                                                 // 703
			$.each(PNotify.notices, function(){                                                                                 // 704
				this.position();                                                                                                   // 705
			});                                                                                                                 // 706
		},                                                                                                                   // 707
		styling: {                                                                                                           // 708
			jqueryui: {                                                                                                         // 709
				container: "ui-widget ui-widget-content ui-corner-all",                                                            // 710
				notice: "ui-state-highlight",                                                                                      // 711
				// (The actual jQUI notice icon looks terrible.)                                                                   // 712
				notice_icon: "ui-icon ui-icon-info",                                                                               // 713
				info: "",                                                                                                          // 714
				info_icon: "ui-icon ui-icon-info",                                                                                 // 715
				success: "ui-state-default",                                                                                       // 716
				success_icon: "ui-icon ui-icon-circle-check",                                                                      // 717
				error: "ui-state-error",                                                                                           // 718
				error_icon: "ui-icon ui-icon-alert"                                                                                // 719
			},                                                                                                                  // 720
			bootstrap2: {                                                                                                       // 721
				container: "alert",                                                                                                // 722
				notice: "",                                                                                                        // 723
				notice_icon: "icon-exclamation-sign",                                                                              // 724
				info: "alert-info",                                                                                                // 725
				info_icon: "icon-info-sign",                                                                                       // 726
				success: "alert-success",                                                                                          // 727
				success_icon: "icon-ok-sign",                                                                                      // 728
				error: "alert-error",                                                                                              // 729
				error_icon: "icon-warning-sign"                                                                                    // 730
			},                                                                                                                  // 731
			bootstrap3: {                                                                                                       // 732
				container: "alert",                                                                                                // 733
				notice: "alert-warning",                                                                                           // 734
				notice_icon: "glyphicon glyphicon-exclamation-sign",                                                               // 735
				info: "alert-info",                                                                                                // 736
				info_icon: "glyphicon glyphicon-info-sign",                                                                        // 737
				success: "alert-success",                                                                                          // 738
				success_icon: "glyphicon glyphicon-ok-sign",                                                                       // 739
				error: "alert-danger",                                                                                             // 740
				error_icon: "glyphicon glyphicon-warning-sign"                                                                     // 741
			}                                                                                                                   // 742
		}                                                                                                                    // 743
	});                                                                                                                   // 744
	/*                                                                                                                    // 745
	 * uses icons from http://fontawesome.io/                                                                             // 746
	 * version 4.0.3                                                                                                      // 747
	 */                                                                                                                   // 748
	PNotify.styling.fontawesome = $.extend({}, PNotify.styling.bootstrap3);                                               // 749
	$.extend(PNotify.styling.fontawesome, {                                                                               // 750
		notice_icon: "fa fa-exclamation-circle",                                                                             // 751
		info_icon: "fa fa-info",                                                                                             // 752
		success_icon: "fa fa-check",                                                                                         // 753
		error_icon: "fa fa-warning"                                                                                          // 754
	});                                                                                                                   // 755
                                                                                                                       // 756
	if (document.body)                                                                                                    // 757
		do_when_ready();                                                                                                     // 758
	else                                                                                                                  // 759
		$(do_when_ready);                                                                                                    // 760
}));                                                                                                                   // 761
// Buttons                                                                                                             // 762
(function($){                                                                                                          // 763
	PNotify.prototype.options.buttons = {                                                                                 // 764
		// Provide a button for the user to manually close the notice.                                                       // 765
		closer: true,                                                                                                        // 766
		// Only show the closer button on hover.                                                                             // 767
		closer_hover: true,                                                                                                  // 768
		// Provide a button for the user to manually stick the notice.                                                       // 769
		sticker: true,                                                                                                       // 770
		// Only show the sticker button on hover.                                                                            // 771
		sticker_hover: true,                                                                                                 // 772
		// The various displayed text, helps facilitating internationalization.                                              // 773
		labels: {                                                                                                            // 774
			close: "Close",                                                                                                     // 775
			stick: "Stick"                                                                                                      // 776
		}                                                                                                                    // 777
	};                                                                                                                    // 778
	PNotify.prototype.modules.buttons = {                                                                                 // 779
		// This lets us update the options available in the closures.                                                        // 780
		myOptions: null,                                                                                                     // 781
                                                                                                                       // 782
		closer: null,                                                                                                        // 783
		sticker: null,                                                                                                       // 784
                                                                                                                       // 785
		init: function(notice, options){                                                                                     // 786
			var that = this;                                                                                                    // 787
			this.myOptions = options;                                                                                           // 788
			notice.elem.on({                                                                                                    // 789
				"mouseenter": function(e){                                                                                         // 790
					// Show the buttons.                                                                                              // 791
					if (that.myOptions.sticker && !(notice.options.nonblock && notice.options.nonblock.nonblock)) that.sticker.trigger("pnotify_icon").css("visibility", "visible");
					if (that.myOptions.closer && !(notice.options.nonblock && notice.options.nonblock.nonblock)) that.closer.css("visibility", "visible");
				},                                                                                                                 // 794
				"mouseleave": function(e){                                                                                         // 795
					// Hide the buttons.                                                                                              // 796
					if (that.myOptions.sticker_hover)                                                                                 // 797
						that.sticker.css("visibility", "hidden");                                                                        // 798
					if (that.myOptions.closer_hover)                                                                                  // 799
						that.closer.css("visibility", "hidden");                                                                         // 800
				}                                                                                                                  // 801
			});                                                                                                                 // 802
                                                                                                                       // 803
			// Provide a button to stick the notice.                                                                            // 804
			this.sticker = $("<div />", {                                                                                       // 805
				"class": "ui-pnotify-sticker",                                                                                     // 806
				"css": {"cursor": "pointer", "visibility": options.sticker_hover ? "hidden" : "visible"},                          // 807
				"click": function(){                                                                                               // 808
					notice.options.hide = !notice.options.hide;                                                                       // 809
					if (notice.options.hide)                                                                                          // 810
						notice.queueRemove();                                                                                            // 811
					else                                                                                                              // 812
						notice.cancelRemove();                                                                                           // 813
					$(this).trigger("pnotify_icon");                                                                                  // 814
				}                                                                                                                  // 815
			})                                                                                                                  // 816
			.bind("pnotify_icon", function(){                                                                                   // 817
				$(this).children().removeClass(notice.styles.pin_up+" "+notice.styles.pin_down).addClass(notice.options.hide ? notice.styles.pin_up : notice.styles.pin_down);
			})                                                                                                                  // 819
			.append($("<span />", {"class": notice.styles.pin_up, "title": options.labels.stick}))                              // 820
			.prependTo(notice.container);                                                                                       // 821
			if (!options.sticker || (notice.options.nonblock && notice.options.nonblock.nonblock))                              // 822
				this.sticker.css("display", "none");                                                                               // 823
                                                                                                                       // 824
			// Provide a button to close the notice.                                                                            // 825
			this.closer = $("<div />", {                                                                                        // 826
				"class": "ui-pnotify-closer",                                                                                      // 827
				"css": {"cursor": "pointer", "visibility": options.closer_hover ? "hidden" : "visible"},                           // 828
				"click": function(){                                                                                               // 829
					notice.remove(false);                                                                                             // 830
					that.sticker.css("visibility", "hidden");                                                                         // 831
					that.closer.css("visibility", "hidden");                                                                          // 832
				}                                                                                                                  // 833
			})                                                                                                                  // 834
			.append($("<span />", {"class": notice.styles.closer, "title": options.labels.close}))                              // 835
			.prependTo(notice.container);                                                                                       // 836
			if (!options.closer || (notice.options.nonblock && notice.options.nonblock.nonblock))                               // 837
				this.closer.css("display", "none");                                                                                // 838
		},                                                                                                                   // 839
		update: function(notice, options){                                                                                   // 840
			this.myOptions = options;                                                                                           // 841
			// Update the sticker and closer buttons.                                                                           // 842
			if (!options.closer || (notice.options.nonblock && notice.options.nonblock.nonblock))                               // 843
				this.closer.css("display", "none");                                                                                // 844
			else if (options.closer)                                                                                            // 845
				this.closer.css("display", "block");                                                                               // 846
			if (!options.sticker || (notice.options.nonblock && notice.options.nonblock.nonblock))                              // 847
				this.sticker.css("display", "none");                                                                               // 848
			else if (options.sticker)                                                                                           // 849
				this.sticker.css("display", "block");                                                                              // 850
			// Update the sticker icon.                                                                                         // 851
			this.sticker.trigger("pnotify_icon");                                                                               // 852
			// Update the hover status of the buttons.                                                                          // 853
			if (options.sticker_hover)                                                                                          // 854
				this.sticker.css("visibility", "hidden");                                                                          // 855
			else if (!(notice.options.nonblock && notice.options.nonblock.nonblock))                                            // 856
				this.sticker.css("visibility", "visible");                                                                         // 857
			if (options.closer_hover)                                                                                           // 858
				this.closer.css("visibility", "hidden");                                                                           // 859
			else if (!(notice.options.nonblock && notice.options.nonblock.nonblock))                                            // 860
				this.closer.css("visibility", "visible");                                                                          // 861
		}                                                                                                                    // 862
	};                                                                                                                    // 863
	$.extend(PNotify.styling.jqueryui, {                                                                                  // 864
		closer: "ui-icon ui-icon-close",                                                                                     // 865
		pin_up: "ui-icon ui-icon-pin-w",                                                                                     // 866
		pin_down: "ui-icon ui-icon-pin-s"                                                                                    // 867
	});                                                                                                                   // 868
	$.extend(PNotify.styling.bootstrap2, {                                                                                // 869
		closer: "icon-remove",                                                                                               // 870
		pin_up: "icon-pause",                                                                                                // 871
		pin_down: "icon-play"                                                                                                // 872
	});                                                                                                                   // 873
	$.extend(PNotify.styling.bootstrap3, {                                                                                // 874
		closer: "glyphicon glyphicon-remove",                                                                                // 875
		pin_up: "glyphicon glyphicon-pause",                                                                                 // 876
		pin_down: "glyphicon glyphicon-play"                                                                                 // 877
	});                                                                                                                   // 878
	$.extend(PNotify.styling.fontawesome, {                                                                               // 879
		closer: "fa fa-times",                                                                                               // 880
		pin_up: "fa fa-pause",                                                                                               // 881
		pin_down: "fa fa-play"                                                                                               // 882
	});                                                                                                                   // 883
})(jQuery);                                                                                                            // 884
// Callbacks                                                                                                           // 885
(function($){                                                                                                          // 886
	var _init   = PNotify.prototype.init,                                                                                 // 887
		_open   = PNotify.prototype.open,                                                                                    // 888
		_remove = PNotify.prototype.remove;                                                                                  // 889
	PNotify.prototype.init = function(){                                                                                  // 890
		if (this.options.before_init) {                                                                                      // 891
			this.options.before_init(this.options);                                                                             // 892
		}                                                                                                                    // 893
		_init.apply(this, arguments);                                                                                        // 894
		if (this.options.after_init) {                                                                                       // 895
			this.options.after_init(this);                                                                                      // 896
		}                                                                                                                    // 897
	};                                                                                                                    // 898
	PNotify.prototype.open = function(){                                                                                  // 899
		var ret;                                                                                                             // 900
		if (this.options.before_open) {                                                                                      // 901
			ret = this.options.before_open(this);                                                                               // 902
		}                                                                                                                    // 903
		if (ret !== false) {                                                                                                 // 904
			_open.apply(this, arguments);                                                                                       // 905
			if (this.options.after_open) {                                                                                      // 906
				this.options.after_open(this);                                                                                     // 907
			}                                                                                                                   // 908
		}                                                                                                                    // 909
	};                                                                                                                    // 910
	PNotify.prototype.remove = function(timer_hide){                                                                      // 911
		var ret;                                                                                                             // 912
		if (this.options.before_close) {                                                                                     // 913
			ret = this.options.before_close(this, timer_hide);                                                                  // 914
		}                                                                                                                    // 915
		if (ret !== false) {                                                                                                 // 916
			_remove.apply(this, arguments);                                                                                     // 917
			if (this.options.after_close) {                                                                                     // 918
				this.options.after_close(this, timer_hide);                                                                        // 919
			}                                                                                                                   // 920
		}                                                                                                                    // 921
	};                                                                                                                    // 922
})(jQuery);                                                                                                            // 923
// Confirm                                                                                                             // 924
(function($){                                                                                                          // 925
	PNotify.prototype.options.confirm = {                                                                                 // 926
		// Make a confirmation box.                                                                                          // 927
		confirm: false,                                                                                                      // 928
		// Where to align the buttons. (right, center, left, justify)                                                        // 929
		align: "right",                                                                                                      // 930
		// The buttons to display, and their callbacks.                                                                      // 931
		buttons: [                                                                                                           // 932
			{                                                                                                                   // 933
				text: "Ok",                                                                                                        // 934
				addClass: "",                                                                                                      // 935
				click: function(notice){                                                                                           // 936
					notice.get().trigger("pnotify.confirm");                                                                          // 937
					notice.remove();                                                                                                  // 938
				}                                                                                                                  // 939
			},                                                                                                                  // 940
			{                                                                                                                   // 941
				text: "Cancel",                                                                                                    // 942
				addClass: "",                                                                                                      // 943
				click: function(notice){                                                                                           // 944
					notice.get().trigger("pnotify.cancel");                                                                           // 945
					notice.remove();                                                                                                  // 946
				}                                                                                                                  // 947
			}                                                                                                                   // 948
		]                                                                                                                    // 949
	};                                                                                                                    // 950
	PNotify.prototype.modules.confirm = {                                                                                 // 951
		// The div that contains the buttons.                                                                                // 952
		buttonContainer: null,                                                                                               // 953
                                                                                                                       // 954
		init: function(notice, options){                                                                                     // 955
			this.buttonContainer = $('<div style="margin-top:5px;clear:both;text-align:'+options.align+';" />').appendTo(notice.container);
                                                                                                                       // 957
			if (options.confirm)                                                                                                // 958
				this.makeButtons(notice, options);                                                                                 // 959
			else                                                                                                                // 960
				this.buttonContainer.hide();                                                                                       // 961
		},                                                                                                                   // 962
                                                                                                                       // 963
		update: function(notice, options){                                                                                   // 964
			if (options.confirm) {                                                                                              // 965
				this.makeButtons(notice, options);                                                                                 // 966
				this.buttonContainer.show();                                                                                       // 967
			} else {                                                                                                            // 968
				this.buttonContainer.hide().empty();                                                                               // 969
			}                                                                                                                   // 970
		},                                                                                                                   // 971
                                                                                                                       // 972
		makeButtons: function(notice, options) {                                                                             // 973
			var already = false, btn, elem;                                                                                     // 974
			this.buttonContainer.empty();                                                                                       // 975
			for (var i in options.buttons) {                                                                                    // 976
				btn = options.buttons[i];                                                                                          // 977
				if (already)                                                                                                       // 978
					this.buttonContainer.append(' ');                                                                                 // 979
				else                                                                                                               // 980
					already = true;                                                                                                   // 981
				elem = $('<button type="button" class="'+notice.styles.btn+' '+btn.addClass+'">'+btn.text+'</button>')             // 982
				.appendTo(this.buttonContainer)                                                                                    // 983
				.on("click", (function(btn){ return function(){                                                                    // 984
					if (typeof btn.click == "function") {                                                                             // 985
						btn.click(notice);                                                                                               // 986
					}                                                                                                                 // 987
				}})(btn));                                                                                                         // 988
				if (notice.styles.text) {                                                                                          // 989
					elem.wrapInner('<span class="'+notice.styles.text+'"></span>');                                                   // 990
				}                                                                                                                  // 991
				if (notice.styles.btnhover) {                                                                                      // 992
					elem.hover((function(elem){ return function(){                                                                    // 993
						elem.addClass(notice.styles.btnhover);                                                                           // 994
					}})(elem), (function(elem){ return function(){                                                                    // 995
						elem.removeClass(notice.styles.btnhover);                                                                        // 996
					}})(elem));                                                                                                       // 997
				}                                                                                                                  // 998
				if (notice.styles.btnactive) {                                                                                     // 999
					elem.on("mousedown", (function(elem){ return function(){                                                          // 1000
						elem.addClass(notice.styles.btnactive);                                                                          // 1001
					}})(elem)).on("mouseup", (function(elem){ return function(){                                                      // 1002
						elem.removeClass(notice.styles.btnactive);                                                                       // 1003
					}})(elem));                                                                                                       // 1004
				}                                                                                                                  // 1005
				if (notice.styles.btnfocus) {                                                                                      // 1006
					elem.on("focus", (function(elem){ return function(){                                                              // 1007
						elem.addClass(notice.styles.btnfocus);                                                                           // 1008
					}})(elem)).on("blur", (function(elem){ return function(){                                                         // 1009
						elem.removeClass(notice.styles.btnfocus);                                                                        // 1010
					}})(elem));                                                                                                       // 1011
				}                                                                                                                  // 1012
			}                                                                                                                   // 1013
		}                                                                                                                    // 1014
	};                                                                                                                    // 1015
	$.extend(PNotify.styling.jqueryui, {                                                                                  // 1016
		btn: "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only",                                       // 1017
		btnhover: "ui-state-hover",                                                                                          // 1018
		btnactive: "ui-state-active",                                                                                        // 1019
		btnfocus: "ui-state-focus",                                                                                          // 1020
		text: "ui-button-text"                                                                                               // 1021
	});                                                                                                                   // 1022
	$.extend(PNotify.styling.bootstrap2, {                                                                                // 1023
		btn: "btn"                                                                                                           // 1024
	});                                                                                                                   // 1025
	$.extend(PNotify.styling.bootstrap3, {                                                                                // 1026
		btn: "btn btn-default"                                                                                               // 1027
	});                                                                                                                   // 1028
	$.extend(PNotify.styling.fontawesome, {                                                                               // 1029
		btn: "btn btn-default"                                                                                               // 1030
	});                                                                                                                   // 1031
})(jQuery);                                                                                                            // 1032
// Desktop                                                                                                             // 1033
(function($){                                                                                                          // 1034
	var permission;                                                                                                       // 1035
	var notify = function(title, options){                                                                                // 1036
		// Memoize based on feature detection.                                                                               // 1037
		if ("Notification" in window) {                                                                                      // 1038
			notify = function (title, options) {                                                                                // 1039
				return new Notification(title, options);                                                                           // 1040
			};                                                                                                                  // 1041
		} else if ("mozNotification" in navigator) {                                                                         // 1042
			notify = function (title, options) {                                                                                // 1043
				// Gecko < 22                                                                                                      // 1044
				return navigator.mozNotification                                                                                   // 1045
					.createNotification(title, options.body, options.icon)                                                            // 1046
					.show();                                                                                                          // 1047
			};                                                                                                                  // 1048
		} else if ("webkitNotifications" in window) {                                                                        // 1049
			notify = function (title, options) {                                                                                // 1050
				return window.webkitNotifications.createNotification(                                                              // 1051
					options.icon,                                                                                                     // 1052
					title,                                                                                                            // 1053
					options.body                                                                                                      // 1054
				);                                                                                                                 // 1055
			};                                                                                                                  // 1056
		} else {                                                                                                             // 1057
			notify = function (title, options) {                                                                                // 1058
				return null;                                                                                                       // 1059
			};                                                                                                                  // 1060
		}                                                                                                                    // 1061
		return notify(title, options);                                                                                       // 1062
	};                                                                                                                    // 1063
                                                                                                                       // 1064
                                                                                                                       // 1065
	PNotify.prototype.options.desktop = {                                                                                 // 1066
		// Display the notification as a desktop notification.                                                               // 1067
		desktop: false,                                                                                                      // 1068
		// The URL of the icon to display. If false, no icon will show. If null, a default icon will show.                   // 1069
		icon: null                                                                                                           // 1070
	};                                                                                                                    // 1071
	PNotify.prototype.modules.desktop = {                                                                                 // 1072
		init: function(notice, options){                                                                                     // 1073
			if (!options.desktop)                                                                                               // 1074
				return;                                                                                                            // 1075
			permission = PNotify.desktop.checkPermission();                                                                     // 1076
			if (permission != 0)                                                                                                // 1077
				return;                                                                                                            // 1078
			if (options.icon === null) {                                                                                        // 1079
				options.icon = "http://sciactive.com/pnotify/includes/desktop/"+notice.options.type+".png";                        // 1080
			} else if (options.icon === false) {                                                                                // 1081
				options.icon = null;                                                                                               // 1082
			}                                                                                                                   // 1083
			notice.desktop = notify(notice.options.title, {                                                                     // 1084
				icon: options.icon,                                                                                                // 1085
				body: notice.options.text                                                                                          // 1086
			});                                                                                                                 // 1087
			if (!("close" in notice.desktop)) {                                                                                 // 1088
				notice.desktop = function(){                                                                                       // 1089
					notice.desktop.cancel();                                                                                          // 1090
				};                                                                                                                 // 1091
			}                                                                                                                   // 1092
			notice.desktop.onclick = function(){                                                                                // 1093
				notice.elem.trigger("click");                                                                                      // 1094
			};                                                                                                                  // 1095
			notice.desktop.onclose = function(){                                                                                // 1096
				if (notice.state !== "closing" && notice.state !== "closed") {                                                     // 1097
					notice.remove();                                                                                                  // 1098
				}                                                                                                                  // 1099
			};                                                                                                                  // 1100
		},                                                                                                                   // 1101
		update: function(notice, options, oldOpts){                                                                          // 1102
			if (permission != 0 || !options.desktop)                                                                            // 1103
				return;                                                                                                            // 1104
		},                                                                                                                   // 1105
		beforeOpen: function(notice, options){                                                                               // 1106
			if (permission != 0 || !options.desktop)                                                                            // 1107
				return;                                                                                                            // 1108
			notice.elem.css({'left': '-10000px', 'display': 'none'});                                                           // 1109
		},                                                                                                                   // 1110
		afterOpen: function(notice, options){                                                                                // 1111
			if (permission != 0 || !options.desktop)                                                                            // 1112
				return;                                                                                                            // 1113
			notice.elem.css({'left': '-10000px', 'display': 'none'});                                                           // 1114
			if ("show" in notice.desktop) {                                                                                     // 1115
				notice.desktop.show();                                                                                             // 1116
			}                                                                                                                   // 1117
		},                                                                                                                   // 1118
		beforeClose: function(notice, options){                                                                              // 1119
			if (permission != 0 || !options.desktop)                                                                            // 1120
				return;                                                                                                            // 1121
			notice.elem.css({'left': '-10000px', 'display': 'none'});                                                           // 1122
		},                                                                                                                   // 1123
		afterClose: function(notice, options){                                                                               // 1124
			if (permission != 0 || !options.desktop)                                                                            // 1125
				return;                                                                                                            // 1126
			notice.elem.css({'left': '-10000px', 'display': 'none'});                                                           // 1127
			notice.desktop.close();                                                                                             // 1128
		}                                                                                                                    // 1129
	};                                                                                                                    // 1130
	PNotify.desktop = {                                                                                                   // 1131
		permission: function(){                                                                                              // 1132
			if (typeof Notification !== "undefined" && "requestPermission" in Notification) {                                   // 1133
				Notification.requestPermission();                                                                                  // 1134
			} else if ("webkitNotifications" in window) {                                                                       // 1135
				window.webkitNotifications.requestPermission();                                                                    // 1136
			}                                                                                                                   // 1137
		},                                                                                                                   // 1138
		checkPermission: function(){                                                                                         // 1139
			if (typeof Notification !== "undefined" && "permission" in Notification) {                                          // 1140
				return (Notification.permission == "granted" ? 0 : 1);                                                             // 1141
			} else if ("webkitNotifications" in window) {                                                                       // 1142
				return window.webkitNotifications.checkPermission();                                                               // 1143
			} else {                                                                                                            // 1144
				return 1;                                                                                                          // 1145
			}                                                                                                                   // 1146
		}                                                                                                                    // 1147
	};                                                                                                                    // 1148
	permission = PNotify.desktop.checkPermission()                                                                        // 1149
})(jQuery);                                                                                                            // 1150
// History                                                                                                             // 1151
(function($){                                                                                                          // 1152
	var history_menu,                                                                                                     // 1153
		history_handle_top;                                                                                                  // 1154
	$(function(){                                                                                                         // 1155
		$("body").on("pnotify.history-all", function(){                                                                      // 1156
			// Display all notices. (Disregarding non-history notices.)                                                         // 1157
			$.each(PNotify.notices, function(){                                                                                 // 1158
				if (this.modules.history.inHistory) {                                                                              // 1159
					if (this.elem.is(":visible")) {                                                                                   // 1160
						// The hide variable controls whether the history pull down should                                               // 1161
						// queue a removal timer.                                                                                        // 1162
						if (this.options.hide)                                                                                           // 1163
							this.queueRemove();                                                                                             // 1164
					} else if (this.open)                                                                                             // 1165
						this.open();                                                                                                     // 1166
				}                                                                                                                  // 1167
			});                                                                                                                 // 1168
		}).on("pnotify.history-last", function(){                                                                            // 1169
			var pushTop = (PNotify.prototype.options.stack.push === "top");                                                     // 1170
                                                                                                                       // 1171
			// Look up the last history notice, and display it.                                                                 // 1172
			var i = (pushTop ? 0 : -1);                                                                                         // 1173
                                                                                                                       // 1174
			var notice;                                                                                                         // 1175
			do {                                                                                                                // 1176
				if (i === -1)                                                                                                      // 1177
					notice = PNotify.notices.slice(i);                                                                                // 1178
				else                                                                                                               // 1179
					notice = PNotify.notices.slice(i, i+1);                                                                           // 1180
				if (!notice[0])                                                                                                    // 1181
					return false;                                                                                                     // 1182
                                                                                                                       // 1183
				i = (pushTop ? i + 1 : i - 1);                                                                                     // 1184
			} while (!notice[0].modules.history.inHistory || notice[0].elem.is(":visible"));                                    // 1185
			if (notice[0].open)                                                                                                 // 1186
				notice[0].open();                                                                                                  // 1187
		});                                                                                                                  // 1188
	});                                                                                                                   // 1189
	PNotify.prototype.options.history = {                                                                                 // 1190
		// Place the notice in the history.                                                                                  // 1191
		history: true,                                                                                                       // 1192
		// Display a pull down menu to redisplay previous notices.                                                           // 1193
		menu: false,                                                                                                         // 1194
		// Make the pull down menu fixed to the top of the viewport.                                                         // 1195
		fixed: true,                                                                                                         // 1196
		// Maximum number of notifications to have onscreen.                                                                 // 1197
		maxonscreen: Infinity,                                                                                               // 1198
		// The various displayed text, helps facilitating internationalization.                                              // 1199
		labels: {                                                                                                            // 1200
			redisplay: "Redisplay",                                                                                             // 1201
			all: "All",                                                                                                         // 1202
			last: "Last"                                                                                                        // 1203
		}                                                                                                                    // 1204
	};                                                                                                                    // 1205
	PNotify.prototype.modules.history = {                                                                                 // 1206
		// The history variable controls whether the notice gets redisplayed                                                 // 1207
		// by the history pull down.                                                                                         // 1208
		inHistory: false,                                                                                                    // 1209
                                                                                                                       // 1210
		init: function(notice, options){                                                                                     // 1211
			// Make sure that no notices get destroyed.                                                                         // 1212
			notice.options.destroy = false;                                                                                     // 1213
                                                                                                                       // 1214
			this.inHistory = options.history;                                                                                   // 1215
                                                                                                                       // 1216
			if (options.menu) {                                                                                                 // 1217
				// If there isn't a history pull down, create one.                                                                 // 1218
				if (typeof history_menu === "undefined") {                                                                         // 1219
					history_menu = $("<div />", {                                                                                     // 1220
						"class": "ui-pnotify-history-container "+notice.styles.hi_menu,                                                  // 1221
						"mouseleave": function(){                                                                                        // 1222
							history_menu.animate({top: "-"+history_handle_top+"px"}, {duration: 100, queue: false});                        // 1223
						}                                                                                                                // 1224
					})                                                                                                                // 1225
					.append($("<div />", {"class": "ui-pnotify-history-header", "text": options.labels.redisplay}))                   // 1226
					.append($("<button />", {                                                                                         // 1227
							"class": "ui-pnotify-history-all "+notice.styles.hi_btn,                                                        // 1228
							"text": options.labels.all,                                                                                     // 1229
							"mouseenter": function(){                                                                                       // 1230
								$(this).addClass(notice.styles.hi_btnhov);                                                                     // 1231
							},                                                                                                              // 1232
							"mouseleave": function(){                                                                                       // 1233
								$(this).removeClass(notice.styles.hi_btnhov);                                                                  // 1234
							},                                                                                                              // 1235
							"click": function(){                                                                                            // 1236
								$(this).trigger("pnotify.history-all");                                                                        // 1237
								return false;                                                                                                  // 1238
							}                                                                                                               // 1239
					}))                                                                                                               // 1240
					.append($("<button />", {                                                                                         // 1241
							"class": "ui-pnotify-history-last "+notice.styles.hi_btn,                                                       // 1242
							"text": options.labels.last,                                                                                    // 1243
							"mouseenter": function(){                                                                                       // 1244
								$(this).addClass(notice.styles.hi_btnhov);                                                                     // 1245
							},                                                                                                              // 1246
							"mouseleave": function(){                                                                                       // 1247
								$(this).removeClass(notice.styles.hi_btnhov);                                                                  // 1248
							},                                                                                                              // 1249
							"click": function(){                                                                                            // 1250
								$(this).trigger("pnotify.history-last");                                                                       // 1251
								return false;                                                                                                  // 1252
							}                                                                                                               // 1253
					}))                                                                                                               // 1254
					.appendTo("body");                                                                                                // 1255
                                                                                                                       // 1256
					// Make a handle so the user can pull down the history tab.                                                       // 1257
					var handle = $("<span />", {                                                                                      // 1258
						"class": "ui-pnotify-history-pulldown "+notice.styles.hi_hnd,                                                    // 1259
						"mouseenter": function(){                                                                                        // 1260
							history_menu.animate({top: "0"}, {duration: 100, queue: false});                                                // 1261
						}                                                                                                                // 1262
					})                                                                                                                // 1263
					.appendTo(history_menu);                                                                                          // 1264
                                                                                                                       // 1265
					// Get the top of the handle.                                                                                     // 1266
					console.log(handle.offset());                                                                                     // 1267
					history_handle_top = handle.offset().top + 2;                                                                     // 1268
					// Hide the history pull down up to the top of the handle.                                                        // 1269
					history_menu.css({top: "-"+history_handle_top+"px"});                                                             // 1270
                                                                                                                       // 1271
					// Apply the fixed styling.                                                                                       // 1272
					if (options.fixed) {                                                                                              // 1273
						history_menu.addClass('ui-pnotify-history-fixed');                                                               // 1274
					}                                                                                                                 // 1275
				}                                                                                                                  // 1276
			}                                                                                                                   // 1277
		},                                                                                                                   // 1278
		update: function(notice, options){                                                                                   // 1279
			// Update values for history menu access.                                                                           // 1280
			this.inHistory = options.history;                                                                                   // 1281
			if (options.fixed && history_menu) {                                                                                // 1282
				history_menu.addClass('ui-pnotify-history-fixed');                                                                 // 1283
			} else if (history_menu) {                                                                                          // 1284
				history_menu.removeClass('ui-pnotify-history-fixed');                                                              // 1285
			}                                                                                                                   // 1286
		},                                                                                                                   // 1287
		beforeOpen: function(notice, options){                                                                               // 1288
			// Remove oldest notifications leaving only options.maxonscreen on screen                                           // 1289
			if (PNotify.notices && (PNotify.notices.length > options.maxonscreen)) {                                            // 1290
				// Oldest are normally in front of array, or if stack.push=="top" then                                             // 1291
				// they are at the end of the array! (issue #98)                                                                   // 1292
				var el;                                                                                                            // 1293
				if (notice.options.stack.push !== "top")                                                                           // 1294
					el = PNotify.notices.slice(0, PNotify.notices.length - options.maxonscreen);                                      // 1295
				else                                                                                                               // 1296
					el = PNotify.notices.slice(options.maxonscreen, PNotify.notices.length);                                          // 1297
                                                                                                                       // 1298
				$.each(el, function(){                                                                                             // 1299
					if (this.remove)                                                                                                  // 1300
						this.remove();                                                                                                   // 1301
				});                                                                                                                // 1302
			}                                                                                                                   // 1303
		}                                                                                                                    // 1304
	};                                                                                                                    // 1305
	$.extend(PNotify.styling.jqueryui, {                                                                                  // 1306
		hi_menu: "ui-state-default ui-corner-bottom",                                                                        // 1307
		hi_btn: "ui-state-default ui-corner-all",                                                                            // 1308
		hi_btnhov: "ui-state-hover",                                                                                         // 1309
		hi_hnd: "ui-icon ui-icon-grip-dotted-horizontal"                                                                     // 1310
	});                                                                                                                   // 1311
	$.extend(PNotify.styling.bootstrap2, {                                                                                // 1312
		hi_menu: "well",                                                                                                     // 1313
		hi_btn: "btn",                                                                                                       // 1314
		hi_btnhov: "",                                                                                                       // 1315
		hi_hnd: "icon-chevron-down"                                                                                          // 1316
	});                                                                                                                   // 1317
	$.extend(PNotify.styling.bootstrap3, {                                                                                // 1318
		hi_menu: "well",                                                                                                     // 1319
		hi_btn: "btn btn-default",                                                                                           // 1320
		hi_btnhov: "",                                                                                                       // 1321
		hi_hnd: "glyphicon glyphicon-chevron-down"                                                                           // 1322
	});                                                                                                                   // 1323
	$.extend(PNotify.styling.fontawesome, {                                                                               // 1324
		hi_menu: "well",                                                                                                     // 1325
		hi_btn: "btn btn-default",                                                                                           // 1326
		hi_btnhov: "",                                                                                                       // 1327
		hi_hnd: "fa fa-chevron-down"                                                                                         // 1328
	});                                                                                                                   // 1329
})(jQuery);                                                                                                            // 1330
// Nonblock                                                                                                            // 1331
(function($){                                                                                                          // 1332
	// Some useful regexes.                                                                                               // 1333
	var re_on = /^on/,                                                                                                    // 1334
		re_mouse_events = /^(dbl)?click$|^mouse(move|down|up|over|out|enter|leave)$|^contextmenu$/,                          // 1335
		re_ui_events = /^(focus|blur|select|change|reset)$|^key(press|down|up)$/,                                            // 1336
		re_html_events = /^(scroll|resize|(un)?load|abort|error)$/;                                                          // 1337
	// Fire a DOM event.                                                                                                  // 1338
	var dom_event = function(e, orig_e){                                                                                  // 1339
		var event_object;                                                                                                    // 1340
		e = e.toLowerCase();                                                                                                 // 1341
		if (document.createEvent && this.dispatchEvent) {                                                                    // 1342
			// FireFox, Opera, Safari, Chrome                                                                                   // 1343
			e = e.replace(re_on, '');                                                                                           // 1344
			if (e.match(re_mouse_events)) {                                                                                     // 1345
				// This allows the click event to fire on the notice. There is                                                     // 1346
				// probably a much better way to do it.                                                                            // 1347
				$(this).offset();                                                                                                  // 1348
				event_object = document.createEvent("MouseEvents");                                                                // 1349
				event_object.initMouseEvent(                                                                                       // 1350
					e, orig_e.bubbles, orig_e.cancelable, orig_e.view, orig_e.detail,                                                 // 1351
					orig_e.screenX, orig_e.screenY, orig_e.clientX, orig_e.clientY,                                                   // 1352
					orig_e.ctrlKey, orig_e.altKey, orig_e.shiftKey, orig_e.metaKey, orig_e.button, orig_e.relatedTarget               // 1353
				);                                                                                                                 // 1354
			} else if (e.match(re_ui_events)) {                                                                                 // 1355
				event_object = document.createEvent("UIEvents");                                                                   // 1356
				event_object.initUIEvent(e, orig_e.bubbles, orig_e.cancelable, orig_e.view, orig_e.detail);                        // 1357
			} else if (e.match(re_html_events)) {                                                                               // 1358
				event_object = document.createEvent("HTMLEvents");                                                                 // 1359
				event_object.initEvent(e, orig_e.bubbles, orig_e.cancelable);                                                      // 1360
			}                                                                                                                   // 1361
			if (!event_object) return;                                                                                          // 1362
			this.dispatchEvent(event_object);                                                                                   // 1363
		} else {                                                                                                             // 1364
			// Internet Explorer                                                                                                // 1365
			if (!e.match(re_on)) e = "on"+e;                                                                                    // 1366
			event_object = document.createEventObject(orig_e);                                                                  // 1367
			this.fireEvent(e, event_object);                                                                                    // 1368
		}                                                                                                                    // 1369
	};                                                                                                                    // 1370
                                                                                                                       // 1371
                                                                                                                       // 1372
	// This keeps track of the last element the mouse was over, so                                                        // 1373
	// mouseleave, mouseenter, etc can be called.                                                                         // 1374
	var nonblock_last_elem;                                                                                               // 1375
	// This is used to pass events through the notice if it is non-blocking.                                              // 1376
	var nonblock_pass = function(notice, e, e_name){                                                                      // 1377
		notice.elem.css("display", "none");                                                                                  // 1378
		var element_below = document.elementFromPoint(e.clientX, e.clientY);                                                 // 1379
		notice.elem.css("display", "block");                                                                                 // 1380
		var jelement_below = $(element_below);                                                                               // 1381
		var cursor_style = jelement_below.css("cursor");                                                                     // 1382
		notice.elem.css("cursor", cursor_style !== "auto" ? cursor_style : "default");                                       // 1383
		// If the element changed, call mouseenter, mouseleave, etc.                                                         // 1384
		if (!nonblock_last_elem || nonblock_last_elem.get(0) != element_below) {                                             // 1385
			if (nonblock_last_elem) {                                                                                           // 1386
				dom_event.call(nonblock_last_elem.get(0), "mouseleave", e.originalEvent);                                          // 1387
				dom_event.call(nonblock_last_elem.get(0), "mouseout", e.originalEvent);                                            // 1388
			}                                                                                                                   // 1389
			dom_event.call(element_below, "mouseenter", e.originalEvent);                                                       // 1390
			dom_event.call(element_below, "mouseover", e.originalEvent);                                                        // 1391
		}                                                                                                                    // 1392
		dom_event.call(element_below, e_name, e.originalEvent);                                                              // 1393
		// Remember the latest element the mouse was over.                                                                   // 1394
		nonblock_last_elem = jelement_below;                                                                                 // 1395
	};                                                                                                                    // 1396
                                                                                                                       // 1397
                                                                                                                       // 1398
	PNotify.prototype.options.nonblock = {                                                                                // 1399
		// Create a non-blocking notice. It lets the user click elements underneath it.                                      // 1400
		nonblock: false,                                                                                                     // 1401
		// The opacity of the notice (if it's non-blocking) when the mouse is over it.                                       // 1402
		nonblock_opacity: .2                                                                                                 // 1403
	};                                                                                                                    // 1404
	PNotify.prototype.modules.nonblock = {                                                                                // 1405
		// This lets us update the options available in the closures.                                                        // 1406
		myOptions: null,                                                                                                     // 1407
                                                                                                                       // 1408
		init: function(notice, options){                                                                                     // 1409
			var that = this;                                                                                                    // 1410
			this.myOptions = options;                                                                                           // 1411
			notice.elem.on({                                                                                                    // 1412
				"mouseenter": function(e){                                                                                         // 1413
					if (that.myOptions.nonblock) e.stopPropagation();                                                                 // 1414
					if (that.myOptions.nonblock) {                                                                                    // 1415
						// If it's non-blocking, animate to the other opacity.                                                           // 1416
						notice.elem.stop().animate({"opacity": that.myOptions.nonblock_opacity}, "fast");                                // 1417
					}                                                                                                                 // 1418
				},                                                                                                                 // 1419
				"mouseleave": function(e){                                                                                         // 1420
					if (that.myOptions.nonblock) e.stopPropagation();                                                                 // 1421
					nonblock_last_elem = null;                                                                                        // 1422
					notice.elem.css("cursor", "auto");                                                                                // 1423
					// Animate back to the normal opacity.                                                                            // 1424
					if (that.myOptions.nonblock && notice.animating !== "out")                                                        // 1425
						notice.elem.stop().animate({"opacity": notice.options.opacity}, "fast");                                         // 1426
				},                                                                                                                 // 1427
				"mouseover": function(e){                                                                                          // 1428
					if (that.myOptions.nonblock) e.stopPropagation();                                                                 // 1429
				},                                                                                                                 // 1430
				"mouseout": function(e){                                                                                           // 1431
					if (that.myOptions.nonblock) e.stopPropagation();                                                                 // 1432
				},                                                                                                                 // 1433
				"mousemove": function(e){                                                                                          // 1434
					if (that.myOptions.nonblock) {                                                                                    // 1435
						e.stopPropagation();                                                                                             // 1436
						nonblock_pass(notice, e, "onmousemove");                                                                         // 1437
					}                                                                                                                 // 1438
				},                                                                                                                 // 1439
				"mousedown": function(e){                                                                                          // 1440
					if (that.myOptions.nonblock) {                                                                                    // 1441
						e.stopPropagation();                                                                                             // 1442
						e.preventDefault();                                                                                              // 1443
						nonblock_pass(notice, e, "onmousedown");                                                                         // 1444
					}                                                                                                                 // 1445
				},                                                                                                                 // 1446
				"mouseup": function(e){                                                                                            // 1447
					if (that.myOptions.nonblock) {                                                                                    // 1448
						e.stopPropagation();                                                                                             // 1449
						e.preventDefault();                                                                                              // 1450
						nonblock_pass(notice, e, "onmouseup");                                                                           // 1451
					}                                                                                                                 // 1452
				},                                                                                                                 // 1453
				"click": function(e){                                                                                              // 1454
					if (that.myOptions.nonblock) {                                                                                    // 1455
						e.stopPropagation();                                                                                             // 1456
						nonblock_pass(notice, e, "onclick");                                                                             // 1457
					}                                                                                                                 // 1458
				},                                                                                                                 // 1459
				"dblclick": function(e){                                                                                           // 1460
					if (that.myOptions.nonblock) {                                                                                    // 1461
						e.stopPropagation();                                                                                             // 1462
						nonblock_pass(notice, e, "ondblclick");                                                                          // 1463
					}                                                                                                                 // 1464
				}                                                                                                                  // 1465
			});                                                                                                                 // 1466
		},                                                                                                                   // 1467
		update: function(notice, options){                                                                                   // 1468
			this.myOptions = options;                                                                                           // 1469
		}                                                                                                                    // 1470
	};                                                                                                                    // 1471
})(jQuery);                                                                                                            // 1472
                                                                                                                       // 1473
$.pnotify = function(options){                                                                                         // 1474
  return new PNotify(options);                                                                                         // 1475
};                                                                                                                     // 1476
$.pnotify.defaults = PNotify.prototype.options;                                                                        // 1477
                                                                                                                       // 1478
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['kidovate:pnotify'] = {
  PNotify: PNotify
};

})();

//# sourceMappingURL=ea29144a5c51126c8c4bd875bec73afc4d56091b.map
