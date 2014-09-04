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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/tarang:select2/lib/select2/select2.js                                                                      //
// This file is in bare mode and is not in its own closure.                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*                                                                                                                     // 1
Copyright 2012 Igor Vaynberg                                                                                           // 2
                                                                                                                       // 3
Version: 3.4.5 Timestamp: Mon Nov  4 08:22:42 PST 2013                                                                 // 4
                                                                                                                       // 5
This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU                      // 6
General Public License version 2 (the "GPL License"). You may choose either license to govern your                     // 7
use of this software only upon the condition that you accept all of the terms of either the Apache                     // 8
License or the GPL License.                                                                                            // 9
                                                                                                                       // 10
You may obtain a copy of the Apache License and the GPL License at:                                                    // 11
                                                                                                                       // 12
    http://www.apache.org/licenses/LICENSE-2.0                                                                         // 13
    http://www.gnu.org/licenses/gpl-2.0.html                                                                           // 14
                                                                                                                       // 15
Unless required by applicable law or agreed to in writing, software distributed under the                              // 16
Apache License or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR                           // 17
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for                      // 18
the specific language governing permissions and limitations under the Apache License and the GPL License.              // 19
*/                                                                                                                     // 20
(function ($) {                                                                                                        // 21
    if(typeof $.fn.each2 == "undefined") {                                                                             // 22
        $.extend($.fn, {                                                                                               // 23
            /*                                                                                                         // 24
            * 4-10 times faster .each replacement                                                                      // 25
            * use it carefully, as it overrides jQuery context of element on each iteration                            // 26
            */                                                                                                         // 27
            each2 : function (c) {                                                                                     // 28
                var j = $([0]), i = -1, l = this.length;                                                               // 29
                while (                                                                                                // 30
                    ++i < l                                                                                            // 31
                    && (j.context = j[0] = this[i])                                                                    // 32
                    && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object                             // 33
                );                                                                                                     // 34
                return this;                                                                                           // 35
            }                                                                                                          // 36
        });                                                                                                            // 37
    }                                                                                                                  // 38
})(jQuery);                                                                                                            // 39
                                                                                                                       // 40
(function ($, undefined) {                                                                                             // 41
    "use strict";                                                                                                      // 42
    /*global document, window, jQuery, console */                                                                      // 43
                                                                                                                       // 44
    if (window.Select2 !== undefined) {                                                                                // 45
        return;                                                                                                        // 46
    }                                                                                                                  // 47
                                                                                                                       // 48
    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,                                             // 49
        lastMousePosition={x:0,y:0}, $document, scrollBarDimensions,                                                   // 50
                                                                                                                       // 51
    KEY = {                                                                                                            // 52
        TAB: 9,                                                                                                        // 53
        ENTER: 13,                                                                                                     // 54
        ESC: 27,                                                                                                       // 55
        SPACE: 32,                                                                                                     // 56
        LEFT: 37,                                                                                                      // 57
        UP: 38,                                                                                                        // 58
        RIGHT: 39,                                                                                                     // 59
        DOWN: 40,                                                                                                      // 60
        SHIFT: 16,                                                                                                     // 61
        CTRL: 17,                                                                                                      // 62
        ALT: 18,                                                                                                       // 63
        PAGE_UP: 33,                                                                                                   // 64
        PAGE_DOWN: 34,                                                                                                 // 65
        HOME: 36,                                                                                                      // 66
        END: 35,                                                                                                       // 67
        BACKSPACE: 8,                                                                                                  // 68
        DELETE: 46,                                                                                                    // 69
        isArrow: function (k) {                                                                                        // 70
            k = k.which ? k.which : k;                                                                                 // 71
            switch (k) {                                                                                               // 72
            case KEY.LEFT:                                                                                             // 73
            case KEY.RIGHT:                                                                                            // 74
            case KEY.UP:                                                                                               // 75
            case KEY.DOWN:                                                                                             // 76
                return true;                                                                                           // 77
            }                                                                                                          // 78
            return false;                                                                                              // 79
        },                                                                                                             // 80
        isControl: function (e) {                                                                                      // 81
            var k = e.which;                                                                                           // 82
            switch (k) {                                                                                               // 83
            case KEY.SHIFT:                                                                                            // 84
            case KEY.CTRL:                                                                                             // 85
            case KEY.ALT:                                                                                              // 86
                return true;                                                                                           // 87
            }                                                                                                          // 88
                                                                                                                       // 89
            if (e.metaKey) return true;                                                                                // 90
                                                                                                                       // 91
            return false;                                                                                              // 92
        },                                                                                                             // 93
        isFunctionKey: function (k) {                                                                                  // 94
            k = k.which ? k.which : k;                                                                                 // 95
            return k >= 112 && k <= 123;                                                                               // 96
        }                                                                                                              // 97
    },                                                                                                                 // 98
    MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>",                                      // 99
                                                                                                                       // 100
    DIACRITICS = {}; // {"\u24B6":"A","\uFF21":"A","\u00C0":"A","\u00C1":"A","\u00C2":"A","\u1EA6":"A","\u1EA4":"A","\u1EAA":"A","\u1EA8":"A","\u00C3":"A","\u0100":"A","\u0102":"A","\u1EB0":"A","\u1EAE":"A","\u1EB4":"A","\u1EB2":"A","\u0226":"A","\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00C5":"A","\u01FA":"A","\u01CD":"A","\u0200":"A","\u0202":"A","\u1EA0":"A","\u1EAC":"A","\u1EB6":"A","\u1E00":"A","\u0104":"A","\u023A":"A","\u2C6F":"A","\uA732":"AA","\u00C6":"AE","\u01FC":"AE","\u01E2":"AE","\uA734":"AO","\uA736":"AU","\uA738":"AV","\uA73A":"AV","\uA73C":"AY","\u24B7":"B","\uFF22":"B","\u1E02":"B","\u1E04":"B","\u1E06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010A":"C","\u010C":"C","\u00C7":"C","\u1E08":"C","\u0187":"C","\u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u1E0C":"D","\u1E10":"D","\u1E12":"D","\u1E0E":"D","\u0110":"D","\u018B":"D","\u018A":"D","\u0189":"D","\uA779":"D","\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz","\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0":"E","\u1EBE":"E","\u1EC4":"E","\u1EC2":"E","\u1EBC":"E","\u0112":"E","\u1E14":"E","\u1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E","\u1EBA":"E","\u011A":"E","\u0204":"E","\u0206":"E","\u1EB8":"E","\u1EC6":"E","\u0228":"E","\u1E1C":"E","\u0118":"E","\u1E18":"E","\u1E1A":"E","\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E1E":"F","\u0191":"F","\uA77B":"F","\u24BC":"G","\uFF27":"G","\u01F4":"G","\u011C":"G","\u1E20":"G","\u011E":"G","\u0120":"G","\u01E6":"G","\u0122":"G","\u01E4":"G","\u0193":"G","\uA7A0":"G","\uA77D":"G","\uA77E":"G","\u24BD":"H","\uFF28":"H","\u0124":"H","\u1E22":"H","\u1E26":"H","\u021E":"H","\u1E24":"H","\u1E28":"H","\u1E2A":"H","\u0126":"H","\u2C67":"H","\u2C75":"H","\uA78D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","\u1E2E":"I","\u1EC8":"I","\u01CF":"I","\u0208":"I","\u020A":"I","\u1ECA":"I","\u012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"J","\uFF2A":"J","\u0134":"J","\u0248":"J","\u24C0":"K","\uFF2B":"K","\u1E30":"K","\u01E8":"K","\u1E32":"K","\u0136":"K","\u1E34":"K","\u0198":"K","\u2C69":"K","\uA740":"K","\uA742":"K","\uA744":"K","\uA7A2":"K","\u24C1":"L","\uFF2C":"L","\u013F":"L","\u0139":"L","\u013D":"L","\u1E36":"L","\u1E38":"L","\u013B":"L","\u1E3C":"L","\u1E3A":"L","\u0141":"L","\u023D":"L","\u2C62":"L","\u2C60":"L","\uA748":"L","\uA746":"L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\u1E3E":"M","\u1E40":"M","\u1E42":"M","\u2C6E":"M","\u019C":"M","\u24C3":"N","\uFF2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N","\u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":"N","\uA790":"N","\uA7A4":"N","\u01CA":"NJ","\u01CB":"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u1ED4":"O","\u00D5":"O","\u1E4C":"O","\u022C":"O","\u1E4E":"O","\u014C":"O","\u1E50":"O","\u1E52":"O","\u014E":"O","\u022E":"O","\u0230":"O","\u00D6":"O","\u022A":"O","\u1ECE":"O","\u0150":"O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","\u1EE2":"O","\u1ECC":"O","\u1ED8":"O","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA74A":"O","\uA74C":"O","\u01A2":"OI","\uA74E":"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\u1E54":"P","\u1E56":"P","\u01A4":"P","\u2C63":"P","\uA750":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q","\uA758":"Q","\u024A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA7A6":"R","\uA782":"R","\u24C8":"S","\uFF33":"S","\u1E9E":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"S","\u1E66":"S","\u1E62":"S","\u1E68":"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":"S","\u24C9":"T","\uFF34":"T","\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1E6E":"T","\u0166":"T","\u01AC":"T","\u01AE":"T","\u023E":"T","\uA786":"T","\uA728":"TZ","\u24CA":"U","\uFF35":"U","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u0168":"U","\u1E78":"U","\u016A":"U","\u1E7A":"U","\u016C":"U","\u00DC":"U","\u01DB":"U","\u01D7":"U","\u01D5":"U","\u01D9":"U","\u1EE6":"U","\u016E":"U","\u0170":"U","\u01D3":"U","\u0214":"U","\u0216":"U","\u01AF":"U","\u1EEA":"U","\u1EE8":"U","\u1EEE":"U","\u1EEC":"U","\u1EF0":"U","\u1EE4":"U","\u1E72":"U","\u0172":"U","\u1E76":"U","\u1E74":"U","\u0244":"U","\u24CB":"V","\uFF36":"V","\u1E7C":"V","\u1E7E":"V","\u01B2":"V","\uA75E":"V","\u0245":"V","\uA760":"VY","\u24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W","\u0174":"W","\u1E86":"W","\u1E84":"W","\u1E88":"W","\u2C72":"W","\u24CD":"X","\uFF38":"X","\u1E8A":"X","\u1E8C":"X","\u24CE":"Y","\uFF39":"Y","\u1EF2":"Y","\u00DD":"Y","\u0176":"Y","\u1EF8":"Y","\u0232":"Y","\u1E8E":"Y","\u0178":"Y","\u1EF6":"Y","\u1EF4":"Y","\u01B3":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"Z","\uFF3A":"Z","\u0179":"Z","\u1E90":"Z","\u017B":"Z","\u017D":"Z","\u1E92":"Z","\u1E94":"Z","\u01B5":"Z","\u0224":"Z","\u2C7F":"Z","\u2C6B":"Z","\uA762":"Z","\u24D0":"a","\uFF41":"a","\u1E9A":"a","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u1EA7":"a","\u1EA5":"a","\u1EAB":"a","\u1EA9":"a","\u00E3":"a","\u0101":"a","\u0103":"a","\u1EB1":"a","\u1EAF":"a","\u1EB5":"a","\u1EB3":"a","\u0227":"a","\u01E1":"a","\u00E4":"a","\u01DF":"a","\u1EA3":"a","\u00E5":"a","\u01FB":"a","\u01CE":"a","\u0201":"a","\u0203":"a","\u1EA1":"a","\u1EAD":"a","\u1EB7":"a","\u1E01":"a","\u0105":"a","\u2C65":"a","\u0250":"a","\uA733":"aa","\u00E6":"ae","\u01FD":"ae","\u01E3":"ae","\uA735":"ao","\uA737":"au","\uA739":"av","\uA73B":"av","\uA73D":"ay","\u24D1":"b","\uFF42":"b","\u1E03":"b","\u1E05":"b","\u1E07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24D2":"c","\uFF43":"c","\u0107":"c","\u0109":"c","\u010B":"c","\u010D":"c","\u00E7":"c","\u1E09":"c","\u0188":"c","\u023C":"c","\uA73F":"c","\u2184":"c","\u24D3":"d","\uFF44":"d","\u1E0B":"d","\u010F":"d","\u1E0D":"d","\u1E11":"d","\u1E13":"d","\u1E0F":"d","\u0111":"d","\u018C":"d","\u0256":"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\uFF45":"e","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u1EC1":"e","\u1EBF":"e","\u1EC5":"e","\u1EC3":"e","\u1EBD":"e","\u0113":"e","\u1E15":"e","\u1E17":"e","\u0115":"e","\u0117":"e","\u00EB":"e","\u1EBB":"e","\u011B":"e","\u0205":"e","\u0207":"e","\u1EB9":"e","\u1EC7":"e","\u0229":"e","\u1E1D":"e","\u0119":"e","\u1E19":"e","\u1E1B":"e","\u0247":"e","\u025B":"e","\u01DD":"e","\u24D5":"f","\uFF46":"f","\u1E1F":"f","\u0192":"f","\uA77C":"f","\u24D6":"g","\uFF47":"g","\u01F5":"g","\u011D":"g","\u1E21":"g","\u011F":"g","\u0121":"g","\u01E7":"g","\u0123":"g","\u01E5":"g","\u0260":"g","\uA7A1":"g","\u1D79":"g","\uA77F":"g","\u24D7":"h","\uFF48":"h","\u0125":"h","\u1E23":"h","\u1E27":"h","\u021F":"h","\u1E25":"h","\u1E29":"h","\u1E2B":"h","\u1E96":"h","\u0127":"h","\u2C68":"h","\u2C76":"h","\u0265":"h","\u0195":"hv","\u24D8":"i","\uFF49":"i","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u0129":"i","\u012B":"i","\u012D":"i","\u00EF":"i","\u1E2F":"i","\u1EC9":"i","\u01D0":"i","\u0209":"i","\u020B":"i","\u1ECB":"i","\u012F":"i","\u1E2D":"i","\u0268":"i","\u0131":"i","\u24D9":"j","\uFF4A":"j","\u0135":"j","\u01F0":"j","\u0249":"j","\u24DA":"k","\uFF4B":"k","\u1E31":"k","\u01E9":"k","\u1E33":"k","\u0137":"k","\u1E35":"k","\u0199":"k","\u2C6A":"k","\uA741":"k","\uA743":"k","\uA745":"k","\uA7A3":"k","\u24DB":"l","\uFF4C":"l","\u0140":"l","\u013A":"l","\u013E":"l","\u1E37":"l","\u1E39":"l","\u013C":"l","\u1E3D":"l","\u1E3B":"l","\u017F":"l","\u0142":"l","\u019A":"l","\u026B":"l","\u2C61":"l","\uA749":"l","\uA781":"l","\uA747":"l","\u01C9":"lj","\u24DC":"m","\uFF4D":"m","\u1E3F":"m","\u1E41":"m","\u1E43":"m","\u0271":"m","\u026F":"m","\u24DD":"n","\uFF4E":"n","\u01F9":"n","\u0144":"n","\u00F1":"n","\u1E45":"n","\u0148":"n","\u1E47":"n","\u0146":"n","\u1E4B":"n","\u1E49":"n","\u019E":"n","\u0272":"n","\u0149":"n","\uA791":"n","\uA7A5":"n","\u01CC":"nj","\u24DE":"o","\uFF4F":"o","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u1ED3":"o","\u1ED1":"o","\u1ED7":"o","\u1ED5":"o","\u00F5":"o","\u1E4D":"o","\u022D":"o","\u1E4F":"o","\u014D":"o","\u1E51":"o","\u1E53":"o","\u014F":"o","\u022F":"o","\u0231":"o","\u00F6":"o","\u022B":"o","\u1ECF":"o","\u0151":"o","\u01D2":"o","\u020D":"o","\u020F":"o","\u01A1":"o","\u1EDD":"o","\u1EDB":"o","\u1EE1":"o","\u1EDF":"o","\u1EE3":"o","\u1ECD":"o","\u1ED9":"o","\u01EB":"o","\u01ED":"o","\u00F8":"o","\u01FF":"o","\u0254":"o","\uA74B":"o","\uA74D":"o","\u0275":"o","\u01A3":"oi","\u0223":"ou","\uA74F":"oo","\u24DF":"p","\uFF50":"p","\u1E55":"p","\u1E57":"p","\u01A5":"p","\u1D7D":"p","\uA751":"p","\uA753":"p","\uA755":"p","\u24E0":"q","\uFF51":"q","\u024B":"q","\uA757":"q","\uA759":"q","\u24E1":"r","\uFF52":"r","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1E5B":"r","\u1E5D":"r","\u0157":"r","\u1E5F":"r","\u024D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","\u24E2":"s","\uFF53":"s","\u00DF":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61":"s","\u0161":"s","\u1E67":"s","\u1E63":"s","\u1E69":"s","\u0219":"s","\u015F":"s","\u023F":"s","\uA7A9":"s","\uA785":"s","\u1E9B":"s","\u24E3":"t","\uFF54":"t","\u1E6B":"t","\u1E97":"t","\u0165":"t","\u1E6D":"t","\u021B":"t","\u0163":"t","\u1E71":"t","\u1E6F":"t","\u0167":"t","\u01AD":"t","\u0288":"t","\u2C66":"t","\uA787":"t","\uA729":"tz","\u24E4":"u","\uFF55":"u","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u0169":"u","\u1E79":"u","\u016B":"u","\u1E7B":"u","\u016D":"u","\u00FC":"u","\u01DC":"u","\u01D8":"u","\u01D6":"u","\u01DA":"u","\u1EE7":"u","\u016F":"u","\u0171":"u","\u01D4":"u","\u0215":"u","\u0217":"u","\u01B0":"u","\u1EEB":"u","\u1EE9":"u","\u1EEF":"u","\u1EED":"u","\u1EF1":"u","\u1EE5":"u","\u1E73":"u","\u0173":"u","\u1E77":"u","\u1E75":"u","\u0289":"u","\u24E5":"v","\uFF56":"v","\u1E7D":"v","\u1E7F":"v","\u028B":"v","\uA75F":"v","\u028C":"v","\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1E81":"w","\u1E83":"w","\u0175":"w","\u1E87":"w","\u1E85":"w","\u1E98":"w","\u1E89":"w","\u2C73":"w","\u24E7":"x","\uFF58":"x","\u1E8B":"x","\u1E8D":"x","\u24E8":"y","\uFF59":"y","\u1EF3":"y","\u00FD":"y","\u0177":"y","\u1EF9":"y","\u0233":"y","\u1E8F":"y","\u00FF":"y","\u1EF7":"y","\u1E99":"y","\u1EF5":"y","\u01B4":"y","\u024F":"y","\u1EFF":"y","\u24E9":"z","\uFF5A":"z","\u017A":"z","\u1E91":"z","\u017C":"z","\u017E":"z","\u1E93":"z","\u1E95":"z","\u01B6":"z","\u0225":"z","\u0240":"z","\u2C6C":"z","\uA763":"z"};
                                                                                                                       // 102
    $document = $(document);                                                                                           // 103
                                                                                                                       // 104
    nextUid=(function() { var counter=1; return function() { return counter++; }; }());                                // 105
                                                                                                                       // 106
                                                                                                                       // 107
    function stripDiacritics(str) {                                                                                    // 108
        var ret, i, l, c;                                                                                              // 109
                                                                                                                       // 110
        if (!str || str.length < 1) return str;                                                                        // 111
                                                                                                                       // 112
        ret = "";                                                                                                      // 113
        for (i = 0, l = str.length; i < l; i++) {                                                                      // 114
            c = str.charAt(i);                                                                                         // 115
            ret += DIACRITICS[c] || c;                                                                                 // 116
        }                                                                                                              // 117
        return ret;                                                                                                    // 118
    }                                                                                                                  // 119
                                                                                                                       // 120
    function indexOf(value, array) {                                                                                   // 121
        var i = 0, l = array.length;                                                                                   // 122
        for (; i < l; i = i + 1) {                                                                                     // 123
            if (equal(value, array[i])) return i;                                                                      // 124
        }                                                                                                              // 125
        return -1;                                                                                                     // 126
    }                                                                                                                  // 127
                                                                                                                       // 128
    function measureScrollbar () {                                                                                     // 129
        var $template = $( MEASURE_SCROLLBAR_TEMPLATE );                                                               // 130
        $template.appendTo('body');                                                                                    // 131
                                                                                                                       // 132
        var dim = {                                                                                                    // 133
            width: $template.width() - $template[0].clientWidth,                                                       // 134
            height: $template.height() - $template[0].clientHeight                                                     // 135
        };                                                                                                             // 136
        $template.remove();                                                                                            // 137
                                                                                                                       // 138
        return dim;                                                                                                    // 139
    }                                                                                                                  // 140
                                                                                                                       // 141
    /**                                                                                                                // 142
     * Compares equality of a and b                                                                                    // 143
     * @param a                                                                                                        // 144
     * @param b                                                                                                        // 145
     */                                                                                                                // 146
    function equal(a, b) {                                                                                             // 147
        if (a === b) return true;                                                                                      // 148
        if (a === undefined || b === undefined) return false;                                                          // 149
        if (a === null || b === null) return false;                                                                    // 150
        // Check whether 'a' or 'b' is a string (primitive or object).                                                 // 151
        // The concatenation of an empty string (+'') converts its argument to a string's primitive.                   // 152
        if (a.constructor === String) return a+'' === b+''; // a+'' - in case 'a' is a String object                   // 153
        if (b.constructor === String) return b+'' === a+''; // b+'' - in case 'b' is a String object                   // 154
        return false;                                                                                                  // 155
    }                                                                                                                  // 156
                                                                                                                       // 157
    /**                                                                                                                // 158
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty   // 159
     * strings                                                                                                         // 160
     * @param string                                                                                                   // 161
     * @param separator                                                                                                // 162
     */                                                                                                                // 163
    function splitVal(string, separator) {                                                                             // 164
        var val, i, l;                                                                                                 // 165
        if (string === null || string.length < 1) return [];                                                           // 166
        val = string.split(separator);                                                                                 // 167
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);                                         // 168
        return val;                                                                                                    // 169
    }                                                                                                                  // 170
                                                                                                                       // 171
    function getSideBorderPadding(element) {                                                                           // 172
        return element.outerWidth(false) - element.width();                                                            // 173
    }                                                                                                                  // 174
                                                                                                                       // 175
    function installKeyUpChangeEvent(element) {                                                                        // 176
        var key="keyup-change-value";                                                                                  // 177
        element.on("keydown", function () {                                                                            // 178
            if ($.data(element, key) === undefined) {                                                                  // 179
                $.data(element, key, element.val());                                                                   // 180
            }                                                                                                          // 181
        });                                                                                                            // 182
        element.on("keyup", function () {                                                                              // 183
            var val= $.data(element, key);                                                                             // 184
            if (val !== undefined && element.val() !== val) {                                                          // 185
                $.removeData(element, key);                                                                            // 186
                element.trigger("keyup-change");                                                                       // 187
            }                                                                                                          // 188
        });                                                                                                            // 189
    }                                                                                                                  // 190
                                                                                                                       // 191
    $document.on("mousemove", function (e) {                                                                           // 192
        lastMousePosition.x = e.pageX;                                                                                 // 193
        lastMousePosition.y = e.pageY;                                                                                 // 194
    });                                                                                                                // 195
                                                                                                                       // 196
    /**                                                                                                                // 197
     * filters mouse events so an event is fired only if the mouse moved.                                              // 198
     *                                                                                                                 // 199
     * filters out mouse events that occur when mouse is stationary but                                                // 200
     * the elements under the pointer are scrolled.                                                                    // 201
     */                                                                                                                // 202
    function installFilteredMouseMove(element) {                                                                       // 203
        element.on("mousemove", function (e) {                                                                         // 204
            var lastpos = lastMousePosition;                                                                           // 205
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {                             // 206
                $(e.target).trigger("mousemove-filtered", e);                                                          // 207
            }                                                                                                          // 208
        });                                                                                                            // 209
    }                                                                                                                  // 210
                                                                                                                       // 211
    /**                                                                                                                // 212
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.                                                                       // 214
     *                                                                                                                 // 215
     * @param quietMillis number of milliseconds to wait before invoking fn                                            // 216
     * @param fn function to be debounced                                                                              // 217
     * @param ctx object to be used as this reference within fn                                                        // 218
     * @return debounced version of fn                                                                                 // 219
     */                                                                                                                // 220
    function debounce(quietMillis, fn, ctx) {                                                                          // 221
        ctx = ctx || undefined;                                                                                        // 222
        var timeout;                                                                                                   // 223
        return function () {                                                                                           // 224
            var args = arguments;                                                                                      // 225
            window.clearTimeout(timeout);                                                                              // 226
            timeout = window.setTimeout(function() {                                                                   // 227
                fn.apply(ctx, args);                                                                                   // 228
            }, quietMillis);                                                                                           // 229
        };                                                                                                             // 230
    }                                                                                                                  // 231
                                                                                                                       // 232
    /**                                                                                                                // 233
     * A simple implementation of a thunk                                                                              // 234
     * @param formula function used to lazily initialize the thunk                                                     // 235
     * @return {Function}                                                                                              // 236
     */                                                                                                                // 237
    function thunk(formula) {                                                                                          // 238
        var evaluated = false,                                                                                         // 239
            value;                                                                                                     // 240
        return function() {                                                                                            // 241
            if (evaluated === false) { value = formula(); evaluated = true; }                                          // 242
            return value;                                                                                              // 243
        };                                                                                                             // 244
    };                                                                                                                 // 245
                                                                                                                       // 246
    function installDebouncedScroll(threshold, element) {                                                              // 247
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});                     // 248
        element.on("scroll", function (e) {                                                                            // 249
            if (indexOf(e.target, element.get()) >= 0) notify(e);                                                      // 250
        });                                                                                                            // 251
    }                                                                                                                  // 252
                                                                                                                       // 253
    function focus($el) {                                                                                              // 254
        if ($el[0] === document.activeElement) return;                                                                 // 255
                                                                                                                       // 256
        /* set the focus in a 0 timeout - that way the focus is set after the processing                               // 257
            of the current event has finished - which seems like the only reliable way                                 // 258
            to set focus */                                                                                            // 259
        window.setTimeout(function() {                                                                                 // 260
            var el=$el[0], pos=$el.val().length, range;                                                                // 261
                                                                                                                       // 262
            $el.focus();                                                                                               // 263
                                                                                                                       // 264
            /* make sure el received focus so we do not error out when trying to manipulate the caret.                 // 265
                sometimes modals or others listeners may steal it after its set */                                     // 266
            if ($el.is(":visible") && el === document.activeElement) {                                                 // 267
                                                                                                                       // 268
                /* after the focus is set move the caret to the end, necessary when we val()                           // 269
                    just before setting focus */                                                                       // 270
                if(el.setSelectionRange)                                                                               // 271
                {                                                                                                      // 272
                    el.setSelectionRange(pos, pos);                                                                    // 273
                }                                                                                                      // 274
                else if (el.createTextRange) {                                                                         // 275
                    range = el.createTextRange();                                                                      // 276
                    range.collapse(false);                                                                             // 277
                    range.select();                                                                                    // 278
                }                                                                                                      // 279
            }                                                                                                          // 280
        }, 0);                                                                                                         // 281
    }                                                                                                                  // 282
                                                                                                                       // 283
    function getCursorInfo(el) {                                                                                       // 284
        el = $(el)[0];                                                                                                 // 285
        var offset = 0;                                                                                                // 286
        var length = 0;                                                                                                // 287
        if ('selectionStart' in el) {                                                                                  // 288
            offset = el.selectionStart;                                                                                // 289
            length = el.selectionEnd - offset;                                                                         // 290
        } else if ('selection' in document) {                                                                          // 291
            el.focus();                                                                                                // 292
            var sel = document.selection.createRange();                                                                // 293
            length = document.selection.createRange().text.length;                                                     // 294
            sel.moveStart('character', -el.value.length);                                                              // 295
            offset = sel.text.length - length;                                                                         // 296
        }                                                                                                              // 297
        return { offset: offset, length: length };                                                                     // 298
    }                                                                                                                  // 299
                                                                                                                       // 300
    function killEvent(event) {                                                                                        // 301
        event.preventDefault();                                                                                        // 302
        event.stopPropagation();                                                                                       // 303
    }                                                                                                                  // 304
    function killEventImmediately(event) {                                                                             // 305
        event.preventDefault();                                                                                        // 306
        event.stopImmediatePropagation();                                                                              // 307
    }                                                                                                                  // 308
                                                                                                                       // 309
    function measureTextWidth(e) {                                                                                     // 310
        if (!sizer){                                                                                                   // 311
            var style = e[0].currentStyle || window.getComputedStyle(e[0], null);                                      // 312
            sizer = $(document.createElement("div")).css({                                                             // 313
                position: "absolute",                                                                                  // 314
                left: "-10000px",                                                                                      // 315
                top: "-10000px",                                                                                       // 316
                display: "none",                                                                                       // 317
                fontSize: style.fontSize,                                                                              // 318
                fontFamily: style.fontFamily,                                                                          // 319
                fontStyle: style.fontStyle,                                                                            // 320
                fontWeight: style.fontWeight,                                                                          // 321
                letterSpacing: style.letterSpacing,                                                                    // 322
                textTransform: style.textTransform,                                                                    // 323
                whiteSpace: "nowrap"                                                                                   // 324
            });                                                                                                        // 325
            sizer.attr("class","select2-sizer");                                                                       // 326
            $("body").append(sizer);                                                                                   // 327
        }                                                                                                              // 328
        sizer.text(e.val());                                                                                           // 329
        return sizer.width();                                                                                          // 330
    }                                                                                                                  // 331
                                                                                                                       // 332
    function syncCssClasses(dest, src, adapter) {                                                                      // 333
        var classes, replacements = [], adapted;                                                                       // 334
                                                                                                                       // 335
        classes = dest.attr("class");                                                                                  // 336
        if (classes) {                                                                                                 // 337
            classes = '' + classes; // for IE which returns object                                                     // 338
            $(classes.split(" ")).each2(function() {                                                                   // 339
                if (this.indexOf("select2-") === 0) {                                                                  // 340
                    replacements.push(this);                                                                           // 341
                }                                                                                                      // 342
            });                                                                                                        // 343
        }                                                                                                              // 344
        classes = src.attr("class");                                                                                   // 345
        if (classes) {                                                                                                 // 346
            classes = '' + classes; // for IE which returns object                                                     // 347
            $(classes.split(" ")).each2(function() {                                                                   // 348
                if (this.indexOf("select2-") !== 0) {                                                                  // 349
                    adapted = adapter(this);                                                                           // 350
                    if (adapted) {                                                                                     // 351
                        replacements.push(adapted);                                                                    // 352
                    }                                                                                                  // 353
                }                                                                                                      // 354
            });                                                                                                        // 355
        }                                                                                                              // 356
        dest.attr("class", replacements.join(" "));                                                                    // 357
    }                                                                                                                  // 358
                                                                                                                       // 359
                                                                                                                       // 360
    function markMatch(text, term, markup, escapeMarkup) {                                                             // 361
        var match=stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())),                    // 362
            tl=term.length;                                                                                            // 363
                                                                                                                       // 364
        if (match<0) {                                                                                                 // 365
            markup.push(escapeMarkup(text));                                                                           // 366
            return;                                                                                                    // 367
        }                                                                                                              // 368
                                                                                                                       // 369
        markup.push(escapeMarkup(text.substring(0, match)));                                                           // 370
        markup.push("<span class='select2-match'>");                                                                   // 371
        markup.push(escapeMarkup(text.substring(match, match + tl)));                                                  // 372
        markup.push("</span>");                                                                                        // 373
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));                                            // 374
    }                                                                                                                  // 375
                                                                                                                       // 376
    function defaultEscapeMarkup(markup) {                                                                             // 377
        var replace_map = {                                                                                            // 378
            '\\': '&#92;',                                                                                             // 379
            '&': '&amp;',                                                                                              // 380
            '<': '&lt;',                                                                                               // 381
            '>': '&gt;',                                                                                               // 382
            '"': '&quot;',                                                                                             // 383
            "'": '&#39;',                                                                                              // 384
            "/": '&#47;'                                                                                               // 385
        };                                                                                                             // 386
                                                                                                                       // 387
        return String(markup).replace(/[&<>"'\/\\]/g, function (match) {                                               // 388
            return replace_map[match];                                                                                 // 389
        });                                                                                                            // 390
    }                                                                                                                  // 391
                                                                                                                       // 392
    /**                                                                                                                // 393
     * Produces an ajax-based query function                                                                           // 394
     *                                                                                                                 // 395
     * @param options object containing configuration paramters                                                        // 396
     * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data                                                                             // 399
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:                                            // 404
     *      results array of objects that will be used as choices                                                      // 405
     *      more (optional) boolean indicating whether there are more results available                                // 406
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}                                     // 407
     */                                                                                                                // 408
    function ajax(options) {                                                                                           // 409
        var timeout, // current scheduled but not yet executed request                                                 // 410
            handler = null,                                                                                            // 411
            quietMillis = options.quietMillis || 100,                                                                  // 412
            ajaxUrl = options.url,                                                                                     // 413
            self = this;                                                                                               // 414
                                                                                                                       // 415
        return function (query) {                                                                                      // 416
            window.clearTimeout(timeout);                                                                              // 417
            timeout = window.setTimeout(function () {                                                                  // 418
                var data = options.data, // ajax data function                                                         // 419
                    url = ajaxUrl, // ajax url string or function                                                      // 420
                    transport = options.transport || $.fn.select2.ajaxDefaults.transport,                              // 421
                    // deprecated - to be removed in 4.0  - use params instead                                         // 422
                    deprecated = {                                                                                     // 423
                        type: options.type || 'GET', // set type of request (GET or POST)                              // 424
                        cache: options.cache || false,                                                                 // 425
                        jsonpCallback: options.jsonpCallback||undefined,                                               // 426
                        dataType: options.dataType||"json"                                                             // 427
                    },                                                                                                 // 428
                    params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);                               // 429
                                                                                                                       // 430
                data = data ? data.call(self, query.term, query.page, query.context) : null;                           // 431
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;       // 432
                                                                                                                       // 433
                if (handler) { handler.abort(); }                                                                      // 434
                                                                                                                       // 435
                if (options.params) {                                                                                  // 436
                    if ($.isFunction(options.params)) {                                                                // 437
                        $.extend(params, options.params.call(self));                                                   // 438
                    } else {                                                                                           // 439
                        $.extend(params, options.params);                                                              // 440
                    }                                                                                                  // 441
                }                                                                                                      // 442
                                                                                                                       // 443
                $.extend(params, {                                                                                     // 444
                    url: url,                                                                                          // 445
                    dataType: options.dataType,                                                                        // 446
                    data: data,                                                                                        // 447
                    success: function (data) {                                                                         // 448
                        // TODO - replace query.page with query so users have access to term, page, etc.               // 449
                        var results = options.results(data, query.page);                                               // 450
                        query.callback(results);                                                                       // 451
                    }                                                                                                  // 452
                });                                                                                                    // 453
                handler = transport.call(self, params);                                                                // 454
            }, quietMillis);                                                                                           // 455
        };                                                                                                             // 456
    }                                                                                                                  // 457
                                                                                                                       // 458
    /**                                                                                                                // 459
     * Produces a query function that works with a local array                                                         // 460
     *                                                                                                                 // 461
     * @param options object containing configuration parameters. The options parameter can either be an array or an   // 462
     * object.                                                                                                         // 463
     *                                                                                                                 // 464
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.                     // 465
     *                                                                                                                 // 466
     * If the object form is used ti is assumed that it contains 'data' and 'text' keys. The 'data' key should contain // 467
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'   // 468
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.                                                                                                       // 471
     */                                                                                                                // 472
    function local(options) {                                                                                          // 473
        var data = options, // data elements                                                                           // 474
            dataText,                                                                                                  // 475
            tmp,                                                                                                       // 476
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search
                                                                                                                       // 478
         if ($.isArray(data)) {                                                                                        // 479
            tmp = data;                                                                                                // 480
            data = { results: tmp };                                                                                   // 481
        }                                                                                                              // 482
                                                                                                                       // 483
         if ($.isFunction(data) === false) {                                                                           // 484
            tmp = data;                                                                                                // 485
            data = function() { return tmp; };                                                                         // 486
        }                                                                                                              // 487
                                                                                                                       // 488
        var dataItem = data();                                                                                         // 489
        if (dataItem.text) {                                                                                           // 490
            text = dataItem.text;                                                                                      // 491
            // if text is not a function we assume it to be a key name                                                 // 492
            if (!$.isFunction(text)) {                                                                                 // 493
                dataText = dataItem.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                text = function (item) { return item[dataText]; };                                                     // 495
            }                                                                                                          // 496
        }                                                                                                              // 497
                                                                                                                       // 498
        return function (query) {                                                                                      // 499
            var t = query.term, filtered = { results: [] }, process;                                                   // 500
            if (t === "") {                                                                                            // 501
                query.callback(data());                                                                                // 502
                return;                                                                                                // 503
            }                                                                                                          // 504
                                                                                                                       // 505
            process = function(datum, collection) {                                                                    // 506
                var group, attr;                                                                                       // 507
                datum = datum[0];                                                                                      // 508
                if (datum.children) {                                                                                  // 509
                    group = {};                                                                                        // 510
                    for (attr in datum) {                                                                              // 511
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];                                       // 512
                    }                                                                                                  // 513
                    group.children=[];                                                                                 // 514
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });         // 515
                    if (group.children.length || query.matcher(t, text(group), datum)) {                               // 516
                        collection.push(group);                                                                        // 517
                    }                                                                                                  // 518
                } else {                                                                                               // 519
                    if (query.matcher(t, text(datum), datum)) {                                                        // 520
                        collection.push(datum);                                                                        // 521
                    }                                                                                                  // 522
                }                                                                                                      // 523
            };                                                                                                         // 524
                                                                                                                       // 525
            $(data().results).each2(function(i, datum) { process(datum, filtered.results); });                         // 526
            query.callback(filtered);                                                                                  // 527
        };                                                                                                             // 528
    }                                                                                                                  // 529
                                                                                                                       // 530
    // TODO javadoc                                                                                                    // 531
    function tags(data) {                                                                                              // 532
        var isFunc = $.isFunction(data);                                                                               // 533
        return function (query) {                                                                                      // 534
            var t = query.term, filtered = {results: []};                                                              // 535
            $(isFunc ? data() : data).each(function () {                                                               // 536
                var isObject = this.text !== undefined,                                                                // 537
                    text = isObject ? this.text : this;                                                                // 538
                if (t === "" || query.matcher(t, text)) {                                                              // 539
                    filtered.results.push(isObject ? this : {id: this, text: this});                                   // 540
                }                                                                                                      // 541
            });                                                                                                        // 542
            query.callback(filtered);                                                                                  // 543
        };                                                                                                             // 544
    }                                                                                                                  // 545
                                                                                                                       // 546
    /**                                                                                                                // 547
     * Checks if the formatter function should be used.                                                                // 548
     *                                                                                                                 // 549
     * Throws an error if it is not a function. Returns true if it should be used,                                     // 550
     * false if no formatting should be performed.                                                                     // 551
     *                                                                                                                 // 552
     * @param formatter                                                                                                // 553
     */                                                                                                                // 554
    function checkFormatter(formatter, formatterName) {                                                                // 555
        if ($.isFunction(formatter)) return true;                                                                      // 556
        if (!formatter) return false;                                                                                  // 557
        throw new Error(formatterName +" must be a function or a falsy value");                                        // 558
    }                                                                                                                  // 559
                                                                                                                       // 560
    function evaluate(val) {                                                                                           // 561
        return $.isFunction(val) ? val() : val;                                                                        // 562
    }                                                                                                                  // 563
                                                                                                                       // 564
    function countResults(results) {                                                                                   // 565
        var count = 0;                                                                                                 // 566
        $.each(results, function(i, item) {                                                                            // 567
            if (item.children) {                                                                                       // 568
                count += countResults(item.children);                                                                  // 569
            } else {                                                                                                   // 570
                count++;                                                                                               // 571
            }                                                                                                          // 572
        });                                                                                                            // 573
        return count;                                                                                                  // 574
    }                                                                                                                  // 575
                                                                                                                       // 576
    /**                                                                                                                // 577
     * Default tokenizer. This function uses breaks the input on substring match of any string from the                // 578
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those          // 579
     * two options have to be defined in order for the tokenizer to work.                                              // 580
     *                                                                                                                 // 581
     * @param input text user has typed so far or pasted into the search field                                         // 582
     * @param selection currently selected choices                                                                     // 583
     * @param selectCallback function(choice) callback tho add the choice to selection                                 // 584
     * @param opts select2's opts                                                                                      // 585
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */                                                                                                                // 587
    function defaultTokenizer(input, selection, selectCallback, opts) {                                                // 588
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice             // 590
            token, // token                                                                                            // 591
            index, // position at which the separator was found                                                        // 592
            i, l, // looping variables                                                                                 // 593
            separator; // the matched separator                                                                        // 594
                                                                                                                       // 595
        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;    // 596
                                                                                                                       // 597
        while (true) {                                                                                                 // 598
            index = -1;                                                                                                // 599
                                                                                                                       // 600
            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {                                                 // 601
                separator = opts.tokenSeparators[i];                                                                   // 602
                index = input.indexOf(separator);                                                                      // 603
                if (index >= 0) break;                                                                                 // 604
            }                                                                                                          // 605
                                                                                                                       // 606
            if (index < 0) break; // did not find any token separator in the input string, bail                        // 607
                                                                                                                       // 608
            token = input.substring(0, index);                                                                         // 609
            input = input.substring(index + separator.length);                                                         // 610
                                                                                                                       // 611
            if (token.length > 0) {                                                                                    // 612
                token = opts.createSearchChoice.call(this, token, selection);                                          // 613
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;                                                                                      // 615
                    for (i = 0, l = selection.length; i < l; i++) {                                                    // 616
                        if (equal(opts.id(token), opts.id(selection[i]))) {                                            // 617
                            dupe = true; break;                                                                        // 618
                        }                                                                                              // 619
                    }                                                                                                  // 620
                                                                                                                       // 621
                    if (!dupe) selectCallback(token);                                                                  // 622
                }                                                                                                      // 623
            }                                                                                                          // 624
        }                                                                                                              // 625
                                                                                                                       // 626
        if (original!==input) return input;                                                                            // 627
    }                                                                                                                  // 628
                                                                                                                       // 629
    /**                                                                                                                // 630
     * Creates a new class                                                                                             // 631
     *                                                                                                                 // 632
     * @param superClass                                                                                               // 633
     * @param methods                                                                                                  // 634
     */                                                                                                                // 635
    function clazz(SuperClass, methods) {                                                                              // 636
        var constructor = function () {};                                                                              // 637
        constructor.prototype = new SuperClass;                                                                        // 638
        constructor.prototype.constructor = constructor;                                                               // 639
        constructor.prototype.parent = SuperClass.prototype;                                                           // 640
        constructor.prototype = $.extend(constructor.prototype, methods);                                              // 641
        return constructor;                                                                                            // 642
    }                                                                                                                  // 643
                                                                                                                       // 644
    AbstractSelect2 = clazz(Object, {                                                                                  // 645
                                                                                                                       // 646
        // abstract                                                                                                    // 647
        bind: function (func) {                                                                                        // 648
            var self = this;                                                                                           // 649
            return function () {                                                                                       // 650
                func.apply(self, arguments);                                                                           // 651
            };                                                                                                         // 652
        },                                                                                                             // 653
                                                                                                                       // 654
        // abstract                                                                                                    // 655
        init: function (opts) {                                                                                        // 656
            var results, search, resultsSelector = ".select2-results";                                                 // 657
                                                                                                                       // 658
            // prepare options                                                                                         // 659
            this.opts = opts = this.prepareOpts(opts);                                                                 // 660
                                                                                                                       // 661
            this.id=opts.id;                                                                                           // 662
                                                                                                                       // 663
            // destroy if called on an existing component                                                              // 664
            if (opts.element.data("select2") !== undefined &&                                                          // 665
                opts.element.data("select2") !== null) {                                                               // 666
                opts.element.data("select2").destroy();                                                                // 667
            }                                                                                                          // 668
                                                                                                                       // 669
            this.container = this.createContainer();                                                                   // 670
                                                                                                                       // 671
            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());                                 // 672
            this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');    // 673
            this.container.attr("id", this.containerId);                                                               // 674
                                                                                                                       // 675
            // cache the body so future lookups are cheap                                                              // 676
            this.body = thunk(function() { return opts.element.closest("body"); });                                    // 677
                                                                                                                       // 678
            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);                       // 679
                                                                                                                       // 680
            this.container.attr("style", opts.element.attr("style"));                                                  // 681
            this.container.css(evaluate(opts.containerCss));                                                           // 682
            this.container.addClass(evaluate(opts.containerCssClass));                                                 // 683
                                                                                                                       // 684
            this.elementTabIndex = this.opts.element.attr("tabindex");                                                 // 685
                                                                                                                       // 686
            // swap container for the element                                                                          // 687
            this.opts.element                                                                                          // 688
                .data("select2", this)                                                                                 // 689
                .attr("tabindex", "-1")                                                                                // 690
                .before(this.container)                                                                                // 691
                .on("click.select2", killEvent); // do not leak click events                                           // 692
                                                                                                                       // 693
            this.container.data("select2", this);                                                                      // 694
                                                                                                                       // 695
            this.dropdown = this.container.find(".select2-drop");                                                      // 696
                                                                                                                       // 697
            syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);                         // 698
                                                                                                                       // 699
            this.dropdown.addClass(evaluate(opts.dropdownCssClass));                                                   // 700
            this.dropdown.data("select2", this);                                                                       // 701
            this.dropdown.on("click", killEvent);                                                                      // 702
                                                                                                                       // 703
            this.results = results = this.container.find(resultsSelector);                                             // 704
            this.search = search = this.container.find("input.select2-input");                                         // 705
                                                                                                                       // 706
            this.queryCount = 0;                                                                                       // 707
            this.resultsPage = 0;                                                                                      // 708
            this.context = null;                                                                                       // 709
                                                                                                                       // 710
            // initialize the container                                                                                // 711
            this.initContainer();                                                                                      // 712
                                                                                                                       // 713
            this.container.on("click", killEvent);                                                                     // 714
                                                                                                                       // 715
            installFilteredMouseMove(this.results);                                                                    // 716
            this.dropdown.on("mousemove-filtered touchstart touchmove touchend", resultsSelector, this.bind(this.highlightUnderEvent));
                                                                                                                       // 718
            installDebouncedScroll(80, this.results);                                                                  // 719
            this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));                   // 720
                                                                                                                       // 721
            // do not propagate change event from the search field out of the component                                // 722
            $(this.container).on("change", ".select2-input", function(e) {e.stopPropagation();});                      // 723
            $(this.dropdown).on("change", ".select2-input", function(e) {e.stopPropagation();});                       // 724
                                                                                                                       // 725
            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {                                                                                     // 727
                results.mousewheel(function (e, delta, deltaX, deltaY) {                                               // 728
                    var top = results.scrollTop();                                                                     // 729
                    if (deltaY > 0 && top - deltaY <= 0) {                                                             // 730
                        results.scrollTop(0);                                                                          // 731
                        killEvent(e);                                                                                  // 732
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());                             // 734
                        killEvent(e);                                                                                  // 735
                    }                                                                                                  // 736
                });                                                                                                    // 737
            }                                                                                                          // 738
                                                                                                                       // 739
            installKeyUpChangeEvent(search);                                                                           // 740
            search.on("keyup-change input paste", this.bind(this.updateResults));                                      // 741
            search.on("focus", function () { search.addClass("select2-focused"); });                                   // 742
            search.on("blur", function () { search.removeClass("select2-focused");});                                  // 743
                                                                                                                       // 744
            this.dropdown.on("mouseup", resultsSelector, this.bind(function (e) {                                      // 745
                if ($(e.target).closest(".select2-result-selectable").length > 0) {                                    // 746
                    this.highlightUnderEvent(e);                                                                       // 747
                    this.selectHighlighted(e);                                                                         // 748
                }                                                                                                      // 749
            }));                                                                                                       // 750
                                                                                                                       // 751
            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening       // 752
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want                                          // 754
            this.dropdown.on("click mouseup mousedown", function (e) { e.stopPropagation(); });                        // 755
                                                                                                                       // 756
            if ($.isFunction(this.opts.initSelection)) {                                                               // 757
                // initialize selection based on the current value of the source element                               // 758
                this.initSelection();                                                                                  // 759
                                                                                                                       // 760
                // if the user has provided a function that can set selection based on the value of the source element // 761
                // we monitor the change event on the element and trigger it, allowing for two way synchronization     // 762
                this.monitorSource();                                                                                  // 763
            }                                                                                                          // 764
                                                                                                                       // 765
            if (opts.maximumInputLength !== null) {                                                                    // 766
                this.search.attr("maxlength", opts.maximumInputLength);                                                // 767
            }                                                                                                          // 768
                                                                                                                       // 769
            var disabled = opts.element.prop("disabled");                                                              // 770
            if (disabled === undefined) disabled = false;                                                              // 771
            this.enable(!disabled);                                                                                    // 772
                                                                                                                       // 773
            var readonly = opts.element.prop("readonly");                                                              // 774
            if (readonly === undefined) readonly = false;                                                              // 775
            this.readonly(readonly);                                                                                   // 776
                                                                                                                       // 777
            // Calculate size of scrollbar                                                                             // 778
            scrollBarDimensions = scrollBarDimensions || measureScrollbar();                                           // 779
                                                                                                                       // 780
            this.autofocus = opts.element.prop("autofocus");                                                           // 781
            opts.element.prop("autofocus", false);                                                                     // 782
            if (this.autofocus) this.focus();                                                                          // 783
                                                                                                                       // 784
            this.nextSearchTerm = undefined;                                                                           // 785
        },                                                                                                             // 786
                                                                                                                       // 787
        // abstract                                                                                                    // 788
        destroy: function () {                                                                                         // 789
            var element=this.opts.element, select2 = element.data("select2");                                          // 790
                                                                                                                       // 791
            this.close();                                                                                              // 792
                                                                                                                       // 793
            if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }                 // 794
                                                                                                                       // 795
            if (select2 !== undefined) {                                                                               // 796
                select2.container.remove();                                                                            // 797
                select2.dropdown.remove();                                                                             // 798
                element                                                                                                // 799
                    .removeClass("select2-offscreen")                                                                  // 800
                    .removeData("select2")                                                                             // 801
                    .off(".select2")                                                                                   // 802
                    .prop("autofocus", this.autofocus || false);                                                       // 803
                if (this.elementTabIndex) {                                                                            // 804
                    element.attr({tabindex: this.elementTabIndex});                                                    // 805
                } else {                                                                                               // 806
                    element.removeAttr("tabindex");                                                                    // 807
                }                                                                                                      // 808
                element.show();                                                                                        // 809
            }                                                                                                          // 810
        },                                                                                                             // 811
                                                                                                                       // 812
        // abstract                                                                                                    // 813
        optionToData: function(element) {                                                                              // 814
            if (element.is("option")) {                                                                                // 815
                return {                                                                                               // 816
                    id:element.prop("value"),                                                                          // 817
                    text:element.text(),                                                                               // 818
                    element: element.get(),                                                                            // 819
                    css: element.attr("class"),                                                                        // 820
                    disabled: element.prop("disabled"),                                                                // 821
                    locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)             // 822
                };                                                                                                     // 823
            } else if (element.is("optgroup")) {                                                                       // 824
                return {                                                                                               // 825
                    text:element.attr("label"),                                                                        // 826
                    children:[],                                                                                       // 827
                    element: element.get(),                                                                            // 828
                    css: element.attr("class")                                                                         // 829
                };                                                                                                     // 830
            }                                                                                                          // 831
        },                                                                                                             // 832
                                                                                                                       // 833
        // abstract                                                                                                    // 834
        prepareOpts: function (opts) {                                                                                 // 835
            var element, select, idKey, ajaxUrl, self = this;                                                          // 836
                                                                                                                       // 837
            element = opts.element;                                                                                    // 838
                                                                                                                       // 839
            if (element.get(0).tagName.toLowerCase() === "select") {                                                   // 840
                this.select = select = opts.element;                                                                   // 841
            }                                                                                                          // 842
                                                                                                                       // 843
            if (select) {                                                                                              // 844
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {                                                                                // 847
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }                                                                                                  // 849
                });                                                                                                    // 850
            }                                                                                                          // 851
                                                                                                                       // 852
            opts = $.extend({}, {                                                                                      // 853
                populateResults: function(container, results, query) {                                                 // 854
                    var populate, id=this.opts.id;                                                                     // 855
                                                                                                                       // 856
                    populate=function(results, container, depth) {                                                     // 857
                                                                                                                       // 858
                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;      // 859
                                                                                                                       // 860
                        results = opts.sortResults(results, container, query);                                         // 861
                                                                                                                       // 862
                        for (i = 0, l = results.length; i < l; i = i + 1) {                                            // 863
                                                                                                                       // 864
                            result=results[i];                                                                         // 865
                                                                                                                       // 866
                            disabled = (result.disabled === true);                                                     // 867
                            selectable = (!disabled) && (id(result) !== undefined);                                    // 868
                                                                                                                       // 869
                            compound=result.children && result.children.length > 0;                                    // 870
                                                                                                                       // 871
                            node=$("<li></li>");                                                                       // 872
                            node.addClass("select2-results-dept-"+depth);                                              // 873
                            node.addClass("select2-result");                                                           // 874
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");   // 875
                            if (disabled) { node.addClass("select2-disabled"); }                                       // 876
                            if (compound) { node.addClass("select2-result-with-children"); }                           // 877
                            node.addClass(self.opts.formatResultCssClass(result));                                     // 878
                                                                                                                       // 879
                            label=$(document.createElement("div"));                                                    // 880
                            label.addClass("select2-result-label");                                                    // 881
                                                                                                                       // 882
                            formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);                 // 883
                            if (formatted!==undefined) {                                                               // 884
                                label.html(formatted);                                                                 // 885
                            }                                                                                          // 886
                                                                                                                       // 887
                            node.append(label);                                                                        // 888
                                                                                                                       // 889
                            if (compound) {                                                                            // 890
                                                                                                                       // 891
                                innerContainer=$("<ul></ul>");                                                         // 892
                                innerContainer.addClass("select2-result-sub");                                         // 893
                                populate(result.children, innerContainer, depth+1);                                    // 894
                                node.append(innerContainer);                                                           // 895
                            }                                                                                          // 896
                                                                                                                       // 897
                            node.data("select2-data", result);                                                         // 898
                            container.append(node);                                                                    // 899
                        }                                                                                              // 900
                    };                                                                                                 // 901
                                                                                                                       // 902
                    populate(results, container, 0);                                                                   // 903
                }                                                                                                      // 904
            }, $.fn.select2.defaults, opts);                                                                           // 905
                                                                                                                       // 906
            if (typeof(opts.id) !== "function") {                                                                      // 907
                idKey = opts.id;                                                                                       // 908
                opts.id = function (e) { return e[idKey]; };                                                           // 909
            }                                                                                                          // 910
                                                                                                                       // 911
            if ($.isArray(opts.element.data("select2Tags"))) {                                                         // 912
                if ("tags" in opts) {                                                                                  // 913
                    throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }                                                                                                      // 915
                opts.tags=opts.element.data("select2Tags");                                                            // 916
            }                                                                                                          // 917
                                                                                                                       // 918
            if (select) {                                                                                              // 919
                opts.query = this.bind(function (query) {                                                              // 920
                    var data = { results: [], more: false },                                                           // 921
                        term = query.term,                                                                             // 922
                        children, placeholderOption, process;                                                          // 923
                                                                                                                       // 924
                    process=function(element, collection) {                                                            // 925
                        var group;                                                                                     // 926
                        if (element.is("option")) {                                                                    // 927
                            if (query.matcher(term, element.text(), element)) {                                        // 928
                                collection.push(self.optionToData(element));                                           // 929
                            }                                                                                          // 930
                        } else if (element.is("optgroup")) {                                                           // 931
                            group=self.optionToData(element);                                                          // 932
                            element.children().each2(function(i, elm) { process(elm, group.children); });              // 933
                            if (group.children.length>0) {                                                             // 934
                                collection.push(group);                                                                // 935
                            }                                                                                          // 936
                        }                                                                                              // 937
                    };                                                                                                 // 938
                                                                                                                       // 939
                    children=element.children();                                                                       // 940
                                                                                                                       // 941
                    // ignore the placeholder option if there is one                                                   // 942
                    if (this.getPlaceholder() !== undefined && children.length > 0) {                                  // 943
                        placeholderOption = this.getPlaceholderOption();                                               // 944
                        if (placeholderOption) {                                                                       // 945
                            children=children.not(placeholderOption);                                                  // 946
                        }                                                                                              // 947
                    }                                                                                                  // 948
                                                                                                                       // 949
                    children.each2(function(i, elm) { process(elm, data.results); });                                  // 950
                                                                                                                       // 951
                    query.callback(data);                                                                              // 952
                });                                                                                                    // 953
                // this is needed because inside val() we construct choices from options and there id is hardcoded     // 954
                opts.id=function(e) { return e.id; };                                                                  // 955
                opts.formatResultCssClass = function(data) { return data.css; };                                       // 956
            } else {                                                                                                   // 957
                if (!("query" in opts)) {                                                                              // 958
                                                                                                                       // 959
                    if ("ajax" in opts) {                                                                              // 960
                        ajaxUrl = opts.element.data("ajax-url");                                                       // 961
                        if (ajaxUrl && ajaxUrl.length > 0) {                                                           // 962
                            opts.ajax.url = ajaxUrl;                                                                   // 963
                        }                                                                                              // 964
                        opts.query = ajax.call(opts.element, opts.ajax);                                               // 965
                    } else if ("data" in opts) {                                                                       // 966
                        opts.query = local(opts.data);                                                                 // 967
                    } else if ("tags" in opts) {                                                                       // 968
                        opts.query = tags(opts.tags);                                                                  // 969
                        if (opts.createSearchChoice === undefined) {                                                   // 970
                            opts.createSearchChoice = function (term) { return {id: $.trim(term), text: $.trim(term)}; };
                        }                                                                                              // 972
                        if (opts.initSelection === undefined) {                                                        // 973
                            opts.initSelection = function (element, callback) {                                        // 974
                                var data = [];                                                                         // 975
                                $(splitVal(element.val(), opts.separator)).each(function () {                          // 976
                                    var obj = { id: this, text: this },                                                // 977
                                        tags = opts.tags;                                                              // 978
                                    if ($.isFunction(tags)) tags=tags();                                               // 979
                                    $(tags).each(function() { if (equal(this.id, obj.id)) { obj = this; return false; } });
                                    data.push(obj);                                                                    // 981
                                });                                                                                    // 982
                                                                                                                       // 983
                                callback(data);                                                                        // 984
                            };                                                                                         // 985
                        }                                                                                              // 986
                    }                                                                                                  // 987
                }                                                                                                      // 988
            }                                                                                                          // 989
            if (typeof(opts.query) !== "function") {                                                                   // 990
                throw "query function not defined for Select2 " + opts.element.attr("id");                             // 991
            }                                                                                                          // 992
                                                                                                                       // 993
            return opts;                                                                                               // 994
        },                                                                                                             // 995
                                                                                                                       // 996
        /**                                                                                                            // 997
         * Monitor the original element for changes and update select2 accordingly                                     // 998
         */                                                                                                            // 999
        // abstract                                                                                                    // 1000
        monitorSource: function () {                                                                                   // 1001
            var el = this.opts.element, sync, observer;                                                                // 1002
                                                                                                                       // 1003
            el.on("change.select2", this.bind(function (e) {                                                           // 1004
                if (this.opts.element.data("select2-change-triggered") !== true) {                                     // 1005
                    this.initSelection();                                                                              // 1006
                }                                                                                                      // 1007
            }));                                                                                                       // 1008
                                                                                                                       // 1009
            sync = this.bind(function () {                                                                             // 1010
                                                                                                                       // 1011
                // sync enabled state                                                                                  // 1012
                var disabled = el.prop("disabled");                                                                    // 1013
                if (disabled === undefined) disabled = false;                                                          // 1014
                this.enable(!disabled);                                                                                // 1015
                                                                                                                       // 1016
                var readonly = el.prop("readonly");                                                                    // 1017
                if (readonly === undefined) readonly = false;                                                          // 1018
                this.readonly(readonly);                                                                               // 1019
                                                                                                                       // 1020
                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);                   // 1021
                this.container.addClass(evaluate(this.opts.containerCssClass));                                        // 1022
                                                                                                                       // 1023
                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);                     // 1024
                this.dropdown.addClass(evaluate(this.opts.dropdownCssClass));                                          // 1025
                                                                                                                       // 1026
            });                                                                                                        // 1027
                                                                                                                       // 1028
            // IE8-10                                                                                                  // 1029
            el.on("propertychange.select2", sync);                                                                     // 1030
                                                                                                                       // 1031
            // hold onto a reference of the callback to work around a chromium bug                                     // 1032
            if (this.mutationCallback === undefined) {                                                                 // 1033
                this.mutationCallback = function (mutations) {                                                         // 1034
                    mutations.forEach(sync);                                                                           // 1035
                }                                                                                                      // 1036
            }                                                                                                          // 1037
                                                                                                                       // 1038
            // safari, chrome, firefox, IE11                                                                           // 1039
            observer = window.MutationObserver || window.WebKitMutationObserver|| window.MozMutationObserver;          // 1040
            if (observer !== undefined) {                                                                              // 1041
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }             // 1042
                this.propertyObserver = new observer(this.mutationCallback);                                           // 1043
                this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });                          // 1044
            }                                                                                                          // 1045
        },                                                                                                             // 1046
                                                                                                                       // 1047
        // abstract                                                                                                    // 1048
        triggerSelect: function(data) {                                                                                // 1049
            var evt = $.Event("select2-selecting", { val: this.id(data), object: data });                              // 1050
            this.opts.element.trigger(evt);                                                                            // 1051
            return !evt.isDefaultPrevented();                                                                          // 1052
        },                                                                                                             // 1053
                                                                                                                       // 1054
        /**                                                                                                            // 1055
         * Triggers the change event on the source element                                                             // 1056
         */                                                                                                            // 1057
        // abstract                                                                                                    // 1058
        triggerChange: function (details) {                                                                            // 1059
                                                                                                                       // 1060
            details = details || {};                                                                                   // 1061
            details= $.extend({}, details, { type: "change", val: this.val() });                                       // 1062
            // prevents recursive triggering                                                                           // 1063
            this.opts.element.data("select2-change-triggered", true);                                                  // 1064
            this.opts.element.trigger(details);                                                                        // 1065
            this.opts.element.data("select2-change-triggered", false);                                                 // 1066
                                                                                                                       // 1067
            // some validation frameworks ignore the change event and listen instead to keyup, click for selects       // 1068
            // so here we trigger the click event manually                                                             // 1069
            this.opts.element.click();                                                                                 // 1070
                                                                                                                       // 1071
            // ValidationEngine ignorea the change event and listens instead to blur                                   // 1072
            // so here we trigger the blur event manually if so desired                                                // 1073
            if (this.opts.blurOnChange)                                                                                // 1074
                this.opts.element.blur();                                                                              // 1075
        },                                                                                                             // 1076
                                                                                                                       // 1077
        //abstract                                                                                                     // 1078
        isInterfaceEnabled: function()                                                                                 // 1079
        {                                                                                                              // 1080
            return this.enabledInterface === true;                                                                     // 1081
        },                                                                                                             // 1082
                                                                                                                       // 1083
        // abstract                                                                                                    // 1084
        enableInterface: function() {                                                                                  // 1085
            var enabled = this._enabled && !this._readonly,                                                            // 1086
                disabled = !enabled;                                                                                   // 1087
                                                                                                                       // 1088
            if (enabled === this.enabledInterface) return false;                                                       // 1089
                                                                                                                       // 1090
            this.container.toggleClass("select2-container-disabled", disabled);                                        // 1091
            this.close();                                                                                              // 1092
            this.enabledInterface = enabled;                                                                           // 1093
                                                                                                                       // 1094
            return true;                                                                                               // 1095
        },                                                                                                             // 1096
                                                                                                                       // 1097
        // abstract                                                                                                    // 1098
        enable: function(enabled) {                                                                                    // 1099
            if (enabled === undefined) enabled = true;                                                                 // 1100
            if (this._enabled === enabled) return;                                                                     // 1101
            this._enabled = enabled;                                                                                   // 1102
                                                                                                                       // 1103
            this.opts.element.prop("disabled", !enabled);                                                              // 1104
            this.enableInterface();                                                                                    // 1105
        },                                                                                                             // 1106
                                                                                                                       // 1107
        // abstract                                                                                                    // 1108
        disable: function() {                                                                                          // 1109
            this.enable(false);                                                                                        // 1110
        },                                                                                                             // 1111
                                                                                                                       // 1112
        // abstract                                                                                                    // 1113
        readonly: function(enabled) {                                                                                  // 1114
            if (enabled === undefined) enabled = false;                                                                // 1115
            if (this._readonly === enabled) return false;                                                              // 1116
            this._readonly = enabled;                                                                                  // 1117
                                                                                                                       // 1118
            this.opts.element.prop("readonly", enabled);                                                               // 1119
            this.enableInterface();                                                                                    // 1120
            return true;                                                                                               // 1121
        },                                                                                                             // 1122
                                                                                                                       // 1123
        // abstract                                                                                                    // 1124
        opened: function () {                                                                                          // 1125
            return this.container.hasClass("select2-dropdown-open");                                                   // 1126
        },                                                                                                             // 1127
                                                                                                                       // 1128
        // abstract                                                                                                    // 1129
        positionDropdown: function() {                                                                                 // 1130
            var $dropdown = this.dropdown,                                                                             // 1131
                offset = this.container.offset(),                                                                      // 1132
                height = this.container.outerHeight(false),                                                            // 1133
                width = this.container.outerWidth(false),                                                              // 1134
                dropHeight = $dropdown.outerHeight(false),                                                             // 1135
                $window = $(window),                                                                                   // 1136
                windowWidth = $window.width(),                                                                         // 1137
                windowHeight = $window.height(),                                                                       // 1138
                viewPortRight = $window.scrollLeft() + windowWidth,                                                    // 1139
                viewportBottom = $window.scrollTop() + windowHeight,                                                   // 1140
                dropTop = offset.top + height,                                                                         // 1141
                dropLeft = offset.left,                                                                                // 1142
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,                                              // 1143
                enoughRoomAbove = (offset.top - dropHeight) >= this.body().scrollTop(),                                // 1144
                dropWidth = $dropdown.outerWidth(false),                                                               // 1145
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,                                             // 1146
                aboveNow = $dropdown.hasClass("select2-drop-above"),                                                   // 1147
                bodyOffset,                                                                                            // 1148
                above,                                                                                                 // 1149
                changeDirection,                                                                                       // 1150
                css,                                                                                                   // 1151
                resultsListNode;                                                                                       // 1152
                                                                                                                       // 1153
            // always prefer the current above/below alignment, unless there is not enough room                        // 1154
            if (aboveNow) {                                                                                            // 1155
                above = true;                                                                                          // 1156
                if (!enoughRoomAbove && enoughRoomBelow) {                                                             // 1157
                    changeDirection = true;                                                                            // 1158
                    above = false;                                                                                     // 1159
                }                                                                                                      // 1160
            } else {                                                                                                   // 1161
                above = false;                                                                                         // 1162
                if (!enoughRoomBelow && enoughRoomAbove) {                                                             // 1163
                    changeDirection = true;                                                                            // 1164
                    above = true;                                                                                      // 1165
                }                                                                                                      // 1166
            }                                                                                                          // 1167
                                                                                                                       // 1168
            //if we are changing direction we need to get positions when dropdown is hidden;                           // 1169
            if (changeDirection) {                                                                                     // 1170
                $dropdown.hide();                                                                                      // 1171
                offset = this.container.offset();                                                                      // 1172
                height = this.container.outerHeight(false);                                                            // 1173
                width = this.container.outerWidth(false);                                                              // 1174
                dropHeight = $dropdown.outerHeight(false);                                                             // 1175
                viewPortRight = $window.scrollLeft() + windowWidth;                                                    // 1176
                viewportBottom = $window.scrollTop() + windowHeight;                                                   // 1177
                dropTop = offset.top + height;                                                                         // 1178
                dropLeft = offset.left;                                                                                // 1179
                dropWidth = $dropdown.outerWidth(false);                                                               // 1180
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;                                             // 1181
                $dropdown.show();                                                                                      // 1182
            }                                                                                                          // 1183
                                                                                                                       // 1184
            if (this.opts.dropdownAutoWidth) {                                                                         // 1185
                resultsListNode = $('.select2-results', $dropdown)[0];                                                 // 1186
                $dropdown.addClass('select2-drop-auto-width');                                                         // 1187
                $dropdown.css('width', '');                                                                            // 1188
                // Add scrollbar width to dropdown if vertical scrollbar is present                                    // 1189
                dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                dropWidth > width ? width = dropWidth : dropWidth = width;                                             // 1191
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;                                             // 1192
            }                                                                                                          // 1193
            else {                                                                                                     // 1194
                this.container.removeClass('select2-drop-auto-width');                                                 // 1195
            }                                                                                                          // 1196
                                                                                                                       // 1197
            //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body().scrollTop(), "enough?", enoughRoomAbove);
                                                                                                                       // 1200
            // fix positioning when body has an offset and is not position: static                                     // 1201
            if (this.body().css('position') !== 'static') {                                                            // 1202
                bodyOffset = this.body().offset();                                                                     // 1203
                dropTop -= bodyOffset.top;                                                                             // 1204
                dropLeft -= bodyOffset.left;                                                                           // 1205
            }                                                                                                          // 1206
                                                                                                                       // 1207
            if (!enoughRoomOnRight) {                                                                                  // 1208
               dropLeft = offset.left + width - dropWidth;                                                             // 1209
            }                                                                                                          // 1210
                                                                                                                       // 1211
            css =  {                                                                                                   // 1212
                left: dropLeft,                                                                                        // 1213
                width: width                                                                                           // 1214
            };                                                                                                         // 1215
                                                                                                                       // 1216
            if (above) {                                                                                               // 1217
                css.bottom = windowHeight - offset.top;                                                                // 1218
                css.top = 'auto';                                                                                      // 1219
                this.container.addClass("select2-drop-above");                                                         // 1220
                $dropdown.addClass("select2-drop-above");                                                              // 1221
            }                                                                                                          // 1222
            else {                                                                                                     // 1223
                css.top = dropTop;                                                                                     // 1224
                css.bottom = 'auto';                                                                                   // 1225
                this.container.removeClass("select2-drop-above");                                                      // 1226
                $dropdown.removeClass("select2-drop-above");                                                           // 1227
            }                                                                                                          // 1228
            css = $.extend(css, evaluate(this.opts.dropdownCss));                                                      // 1229
                                                                                                                       // 1230
            $dropdown.css(css);                                                                                        // 1231
        },                                                                                                             // 1232
                                                                                                                       // 1233
        // abstract                                                                                                    // 1234
        shouldOpen: function() {                                                                                       // 1235
            var event;                                                                                                 // 1236
                                                                                                                       // 1237
            if (this.opened()) return false;                                                                           // 1238
                                                                                                                       // 1239
            if (this._enabled === false || this._readonly === true) return false;                                      // 1240
                                                                                                                       // 1241
            event = $.Event("select2-opening");                                                                        // 1242
            this.opts.element.trigger(event);                                                                          // 1243
            return !event.isDefaultPrevented();                                                                        // 1244
        },                                                                                                             // 1245
                                                                                                                       // 1246
        // abstract                                                                                                    // 1247
        clearDropdownAlignmentPreference: function() {                                                                 // 1248
            // clear the classes used to figure out the preference of where the dropdown should be opened              // 1249
            this.container.removeClass("select2-drop-above");                                                          // 1250
            this.dropdown.removeClass("select2-drop-above");                                                           // 1251
        },                                                                                                             // 1252
                                                                                                                       // 1253
        /**                                                                                                            // 1254
         * Opens the dropdown                                                                                          // 1255
         *                                                                                                             // 1256
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,        // 1257
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().       // 1258
         */                                                                                                            // 1259
        // abstract                                                                                                    // 1260
        open: function () {                                                                                            // 1261
                                                                                                                       // 1262
            if (!this.shouldOpen()) return false;                                                                      // 1263
                                                                                                                       // 1264
            this.opening();                                                                                            // 1265
                                                                                                                       // 1266
            return true;                                                                                               // 1267
        },                                                                                                             // 1268
                                                                                                                       // 1269
        /**                                                                                                            // 1270
         * Performs the opening of the dropdown                                                                        // 1271
         */                                                                                                            // 1272
        // abstract                                                                                                    // 1273
        opening: function() {                                                                                          // 1274
            var cid = this.containerId,                                                                                // 1275
                scroll = "scroll." + cid,                                                                              // 1276
                resize = "resize."+cid,                                                                                // 1277
                orient = "orientationchange."+cid,                                                                     // 1278
                mask;                                                                                                  // 1279
                                                                                                                       // 1280
            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");                     // 1281
                                                                                                                       // 1282
            this.clearDropdownAlignmentPreference();                                                                   // 1283
                                                                                                                       // 1284
            if(this.dropdown[0] !== this.body().children().last()[0]) {                                                // 1285
                this.dropdown.detach().appendTo(this.body());                                                          // 1286
            }                                                                                                          // 1287
                                                                                                                       // 1288
            // create the dropdown mask if doesnt already exist                                                        // 1289
            mask = $("#select2-drop-mask");                                                                            // 1290
            if (mask.length == 0) {                                                                                    // 1291
                mask = $(document.createElement("div"));                                                               // 1292
                mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");                                 // 1293
                mask.hide();                                                                                           // 1294
                mask.appendTo(this.body());                                                                            // 1295
                mask.on("mousedown touchstart click", function (e) {                                                   // 1296
                    var dropdown = $("#select2-drop"), self;                                                           // 1297
                    if (dropdown.length > 0) {                                                                         // 1298
                        self=dropdown.data("select2");                                                                 // 1299
                        if (self.opts.selectOnBlur) {                                                                  // 1300
                            self.selectHighlighted({noFocus: true});                                                   // 1301
                        }                                                                                              // 1302
                        self.close({focus:true});                                                                      // 1303
                        e.preventDefault();                                                                            // 1304
                        e.stopPropagation();                                                                           // 1305
                    }                                                                                                  // 1306
                });                                                                                                    // 1307
            }                                                                                                          // 1308
                                                                                                                       // 1309
            // ensure the mask is always right before the dropdown                                                     // 1310
            if (this.dropdown.prev()[0] !== mask[0]) {                                                                 // 1311
                this.dropdown.before(mask);                                                                            // 1312
            }                                                                                                          // 1313
                                                                                                                       // 1314
            // move the global id to the correct dropdown                                                              // 1315
            $("#select2-drop").removeAttr("id");                                                                       // 1316
            this.dropdown.attr("id", "select2-drop");                                                                  // 1317
                                                                                                                       // 1318
            // show the elements                                                                                       // 1319
            mask.show();                                                                                               // 1320
                                                                                                                       // 1321
            this.positionDropdown();                                                                                   // 1322
            this.dropdown.show();                                                                                      // 1323
            this.positionDropdown();                                                                                   // 1324
                                                                                                                       // 1325
            this.dropdown.addClass("select2-drop-active");                                                             // 1326
                                                                                                                       // 1327
            // attach listeners to events that can change the position of the container and thus require               // 1328
            // the position of the dropdown to be updated as well so it does not come unglued from the container       // 1329
            var that = this;                                                                                           // 1330
            this.container.parents().add(window).each(function () {                                                    // 1331
                $(this).on(resize+" "+scroll+" "+orient, function (e) {                                                // 1332
                    that.positionDropdown();                                                                           // 1333
                });                                                                                                    // 1334
            });                                                                                                        // 1335
                                                                                                                       // 1336
                                                                                                                       // 1337
        },                                                                                                             // 1338
                                                                                                                       // 1339
        // abstract                                                                                                    // 1340
        close: function () {                                                                                           // 1341
            if (!this.opened()) return;                                                                                // 1342
                                                                                                                       // 1343
            var cid = this.containerId,                                                                                // 1344
                scroll = "scroll." + cid,                                                                              // 1345
                resize = "resize."+cid,                                                                                // 1346
                orient = "orientationchange."+cid;                                                                     // 1347
                                                                                                                       // 1348
            // unbind event listeners                                                                                  // 1349
            this.container.parents().add(window).each(function () { $(this).off(scroll).off(resize).off(orient); });   // 1350
                                                                                                                       // 1351
            this.clearDropdownAlignmentPreference();                                                                   // 1352
                                                                                                                       // 1353
            $("#select2-drop-mask").hide();                                                                            // 1354
            this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id                        // 1355
            this.dropdown.hide();                                                                                      // 1356
            this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");               // 1357
            this.results.empty();                                                                                      // 1358
                                                                                                                       // 1359
                                                                                                                       // 1360
            this.clearSearch();                                                                                        // 1361
            this.search.removeClass("select2-active");                                                                 // 1362
            this.opts.element.trigger($.Event("select2-close"));                                                       // 1363
        },                                                                                                             // 1364
                                                                                                                       // 1365
        /**                                                                                                            // 1366
         * Opens control, sets input value, and updates results.                                                       // 1367
         */                                                                                                            // 1368
        // abstract                                                                                                    // 1369
        externalSearch: function (term) {                                                                              // 1370
            this.open();                                                                                               // 1371
            this.search.val(term);                                                                                     // 1372
            this.updateResults(false);                                                                                 // 1373
        },                                                                                                             // 1374
                                                                                                                       // 1375
        // abstract                                                                                                    // 1376
        clearSearch: function () {                                                                                     // 1377
                                                                                                                       // 1378
        },                                                                                                             // 1379
                                                                                                                       // 1380
        //abstract                                                                                                     // 1381
        getMaximumSelectionSize: function() {                                                                          // 1382
            return evaluate(this.opts.maximumSelectionSize);                                                           // 1383
        },                                                                                                             // 1384
                                                                                                                       // 1385
        // abstract                                                                                                    // 1386
        ensureHighlightVisible: function () {                                                                          // 1387
            var results = this.results, children, index, child, hb, rb, y, more;                                       // 1388
                                                                                                                       // 1389
            index = this.highlight();                                                                                  // 1390
                                                                                                                       // 1391
            if (index < 0) return;                                                                                     // 1392
                                                                                                                       // 1393
            if (index == 0) {                                                                                          // 1394
                                                                                                                       // 1395
                // if the first element is highlighted scroll all the way to the top,                                  // 1396
                // that way any unselectable headers above it will also be scrolled                                    // 1397
                // into view                                                                                           // 1398
                                                                                                                       // 1399
                results.scrollTop(0);                                                                                  // 1400
                return;                                                                                                // 1401
            }                                                                                                          // 1402
                                                                                                                       // 1403
            children = this.findHighlightableChoices().find('.select2-result-label');                                  // 1404
                                                                                                                       // 1405
            child = $(children[index]);                                                                                // 1406
                                                                                                                       // 1407
            hb = child.offset().top + child.outerHeight(true);                                                         // 1408
                                                                                                                       // 1409
            // if this is the last child lets also make sure select2-more-results is visible                           // 1410
            if (index === children.length - 1) {                                                                       // 1411
                more = results.find("li.select2-more-results");                                                        // 1412
                if (more.length > 0) {                                                                                 // 1413
                    hb = more.offset().top + more.outerHeight(true);                                                   // 1414
                }                                                                                                      // 1415
            }                                                                                                          // 1416
                                                                                                                       // 1417
            rb = results.offset().top + results.outerHeight(true);                                                     // 1418
            if (hb > rb) {                                                                                             // 1419
                results.scrollTop(results.scrollTop() + (hb - rb));                                                    // 1420
            }                                                                                                          // 1421
            y = child.offset().top - results.offset().top;                                                             // 1422
                                                                                                                       // 1423
            // make sure the top of the element is visible                                                             // 1424
            if (y < 0 && child.css('display') != 'none' ) {                                                            // 1425
                results.scrollTop(results.scrollTop() + y); // y is negative                                           // 1426
            }                                                                                                          // 1427
        },                                                                                                             // 1428
                                                                                                                       // 1429
        // abstract                                                                                                    // 1430
        findHighlightableChoices: function() {                                                                         // 1431
            return this.results.find(".select2-result-selectable:not(.select2-disabled, .select2-selected)");          // 1432
        },                                                                                                             // 1433
                                                                                                                       // 1434
        // abstract                                                                                                    // 1435
        moveHighlight: function (delta) {                                                                              // 1436
            var choices = this.findHighlightableChoices(),                                                             // 1437
                index = this.highlight();                                                                              // 1438
                                                                                                                       // 1439
            while (index > -1 && index < choices.length) {                                                             // 1440
                index += delta;                                                                                        // 1441
                var choice = $(choices[index]);                                                                        // 1442
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);                                                                             // 1444
                    break;                                                                                             // 1445
                }                                                                                                      // 1446
            }                                                                                                          // 1447
        },                                                                                                             // 1448
                                                                                                                       // 1449
        // abstract                                                                                                    // 1450
        highlight: function (index) {                                                                                  // 1451
            var choices = this.findHighlightableChoices(),                                                             // 1452
                choice,                                                                                                // 1453
                data;                                                                                                  // 1454
                                                                                                                       // 1455
            if (arguments.length === 0) {                                                                              // 1456
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());                              // 1457
            }                                                                                                          // 1458
                                                                                                                       // 1459
            if (index >= choices.length) index = choices.length - 1;                                                   // 1460
            if (index < 0) index = 0;                                                                                  // 1461
                                                                                                                       // 1462
            this.removeHighlight();                                                                                    // 1463
                                                                                                                       // 1464
            choice = $(choices[index]);                                                                                // 1465
            choice.addClass("select2-highlighted");                                                                    // 1466
                                                                                                                       // 1467
            this.ensureHighlightVisible();                                                                             // 1468
                                                                                                                       // 1469
            data = choice.data("select2-data");                                                                        // 1470
            if (data) {                                                                                                // 1471
                this.opts.element.trigger({ type: "select2-highlight", val: this.id(data), choice: data });            // 1472
            }                                                                                                          // 1473
        },                                                                                                             // 1474
                                                                                                                       // 1475
        removeHighlight: function() {                                                                                  // 1476
            this.results.find(".select2-highlighted").removeClass("select2-highlighted");                              // 1477
        },                                                                                                             // 1478
                                                                                                                       // 1479
        // abstract                                                                                                    // 1480
        countSelectableResults: function() {                                                                           // 1481
            return this.findHighlightableChoices().length;                                                             // 1482
        },                                                                                                             // 1483
                                                                                                                       // 1484
        // abstract                                                                                                    // 1485
        highlightUnderEvent: function (event) {                                                                        // 1486
            var el = $(event.target).closest(".select2-result-selectable");                                            // 1487
            if (el.length > 0 && !el.is(".select2-highlighted")) {                                                     // 1488
                var choices = this.findHighlightableChoices();                                                         // 1489
                this.highlight(choices.index(el));                                                                     // 1490
            } else if (el.length == 0) {                                                                               // 1491
                // if we are over an unselectable item remove all highlights                                           // 1492
                this.removeHighlight();                                                                                // 1493
            }                                                                                                          // 1494
        },                                                                                                             // 1495
                                                                                                                       // 1496
        // abstract                                                                                                    // 1497
        loadMoreIfNeeded: function () {                                                                                // 1498
            var results = this.results,                                                                                // 1499
                more = results.find("li.select2-more-results"),                                                        // 1500
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                page = this.resultsPage + 1,                                                                           // 1502
                self=this,                                                                                             // 1503
                term=this.search.val(),                                                                                // 1504
                context=this.context;                                                                                  // 1505
                                                                                                                       // 1506
            if (more.length === 0) return;                                                                             // 1507
            below = more.offset().top - results.offset().top - results.height();                                       // 1508
                                                                                                                       // 1509
            if (below <= this.opts.loadMorePadding) {                                                                  // 1510
                more.addClass("select2-active");                                                                       // 1511
                this.opts.query({                                                                                      // 1512
                        element: this.opts.element,                                                                    // 1513
                        term: term,                                                                                    // 1514
                        page: page,                                                                                    // 1515
                        context: context,                                                                              // 1516
                        matcher: this.opts.matcher,                                                                    // 1517
                        callback: this.bind(function (data) {                                                          // 1518
                                                                                                                       // 1519
                    // ignore a response if the select2 has been closed before it was received                         // 1520
                    if (!self.opened()) return;                                                                        // 1521
                                                                                                                       // 1522
                                                                                                                       // 1523
                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});
                    self.postprocessResults(data, false, false);                                                       // 1525
                                                                                                                       // 1526
                    if (data.more===true) {                                                                            // 1527
                        more.detach().appendTo(results).text(self.opts.formatLoadMore(page+1));                        // 1528
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);                                // 1529
                    } else {                                                                                           // 1530
                        more.remove();                                                                                 // 1531
                    }                                                                                                  // 1532
                    self.positionDropdown();                                                                           // 1533
                    self.resultsPage = page;                                                                           // 1534
                    self.context = data.context;                                                                       // 1535
                    this.opts.element.trigger({ type: "select2-loaded", items: data });                                // 1536
                })});                                                                                                  // 1537
            }                                                                                                          // 1538
        },                                                                                                             // 1539
                                                                                                                       // 1540
        /**                                                                                                            // 1541
         * Default tokenizer function which does nothing                                                               // 1542
         */                                                                                                            // 1543
        tokenize: function() {                                                                                         // 1544
                                                                                                                       // 1545
        },                                                                                                             // 1546
                                                                                                                       // 1547
        /**                                                                                                            // 1548
         * @param initial whether or not this is the call to this method right after the dropdown has been opened      // 1549
         */                                                                                                            // 1550
        // abstract                                                                                                    // 1551
        updateResults: function (initial) {                                                                            // 1552
            var search = this.search,                                                                                  // 1553
                results = this.results,                                                                                // 1554
                opts = this.opts,                                                                                      // 1555
                data,                                                                                                  // 1556
                self = this,                                                                                           // 1557
                input,                                                                                                 // 1558
                term = search.val(),                                                                                   // 1559
                lastTerm = $.data(this.container, "select2-last-term"),                                                // 1560
                // sequence number used to drop out-of-order responses                                                 // 1561
                queryNumber;                                                                                           // 1562
                                                                                                                       // 1563
            // prevent duplicate queries against the same term                                                         // 1564
            if (initial !== true && lastTerm && equal(term, lastTerm)) return;                                         // 1565
                                                                                                                       // 1566
            $.data(this.container, "select2-last-term", term);                                                         // 1567
                                                                                                                       // 1568
            // if the search is currently hidden we do not alter the results                                           // 1569
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {                              // 1570
                return;                                                                                                // 1571
            }                                                                                                          // 1572
                                                                                                                       // 1573
            function postRender() {                                                                                    // 1574
                search.removeClass("select2-active");                                                                  // 1575
                self.positionDropdown();                                                                               // 1576
            }                                                                                                          // 1577
                                                                                                                       // 1578
            function render(html) {                                                                                    // 1579
                results.html(html);                                                                                    // 1580
                postRender();                                                                                          // 1581
            }                                                                                                          // 1582
                                                                                                                       // 1583
            queryNumber = ++this.queryCount;                                                                           // 1584
                                                                                                                       // 1585
            var maxSelSize = this.getMaximumSelectionSize();                                                           // 1586
            if (maxSelSize >=1) {                                                                                      // 1587
                data = this.data();                                                                                    // 1588
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                    render("<li class='select2-selection-limit'>" + opts.formatSelectionTooBig(maxSelSize) + "</li>"); // 1590
                    return;                                                                                            // 1591
                }                                                                                                      // 1592
            }                                                                                                          // 1593
                                                                                                                       // 1594
            if (search.val().length < opts.minimumInputLength) {                                                       // 1595
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {                                 // 1596
                    render("<li class='select2-no-results'>" + opts.formatInputTooShort(search.val(), opts.minimumInputLength) + "</li>");
                } else {                                                                                               // 1598
                    render("");                                                                                        // 1599
                }                                                                                                      // 1600
                if (initial && this.showSearch) this.showSearch(true);                                                 // 1601
                return;                                                                                                // 1602
            }                                                                                                          // 1603
                                                                                                                       // 1604
            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {                            // 1605
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {                                   // 1606
                    render("<li class='select2-no-results'>" + opts.formatInputTooLong(search.val(), opts.maximumInputLength) + "</li>");
                } else {                                                                                               // 1608
                    render("");                                                                                        // 1609
                }                                                                                                      // 1610
                return;                                                                                                // 1611
            }                                                                                                          // 1612
                                                                                                                       // 1613
            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {                                // 1614
                render("<li class='select2-searching'>" + opts.formatSearching() + "</li>");                           // 1615
            }                                                                                                          // 1616
                                                                                                                       // 1617
            search.addClass("select2-active");                                                                         // 1618
                                                                                                                       // 1619
            this.removeHighlight();                                                                                    // 1620
                                                                                                                       // 1621
            // give the tokenizer a chance to pre-process the input                                                    // 1622
            input = this.tokenize();                                                                                   // 1623
            if (input != undefined && input != null) {                                                                 // 1624
                search.val(input);                                                                                     // 1625
            }                                                                                                          // 1626
                                                                                                                       // 1627
            this.resultsPage = 1;                                                                                      // 1628
                                                                                                                       // 1629
            opts.query({                                                                                               // 1630
                element: opts.element,                                                                                 // 1631
                    term: search.val(),                                                                                // 1632
                    page: this.resultsPage,                                                                            // 1633
                    context: null,                                                                                     // 1634
                    matcher: opts.matcher,                                                                             // 1635
                    callback: this.bind(function (data) {                                                              // 1636
                var def; // default choice                                                                             // 1637
                                                                                                                       // 1638
                // ignore old responses                                                                                // 1639
                if (queryNumber != this.queryCount) {                                                                  // 1640
                  return;                                                                                              // 1641
                }                                                                                                      // 1642
                                                                                                                       // 1643
                // ignore a response if the select2 has been closed before it was received                             // 1644
                if (!this.opened()) {                                                                                  // 1645
                    this.search.removeClass("select2-active");                                                         // 1646
                    return;                                                                                            // 1647
                }                                                                                                      // 1648
                                                                                                                       // 1649
                // save context, if any                                                                                // 1650
                this.context = (data.context===undefined) ? null : data.context;                                       // 1651
                // create a default choice and prepend it to the list                                                  // 1652
                if (this.opts.createSearchChoice && search.val() !== "") {                                             // 1653
                    def = this.opts.createSearchChoice.call(self, search.val(), data.results);                         // 1654
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {    // 1655
                        if ($(data.results).filter(                                                                    // 1656
                            function () {                                                                              // 1657
                                return equal(self.id(this), self.id(def));                                             // 1658
                            }).length === 0) {                                                                         // 1659
                            data.results.unshift(def);                                                                 // 1660
                        }                                                                                              // 1661
                    }                                                                                                  // 1662
                }                                                                                                      // 1663
                                                                                                                       // 1664
                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {            // 1665
                    render("<li class='select2-no-results'>" + opts.formatNoMatches(search.val()) + "</li>");          // 1666
                    return;                                                                                            // 1667
                }                                                                                                      // 1668
                                                                                                                       // 1669
                results.empty();                                                                                       // 1670
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});
                                                                                                                       // 1672
                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {                     // 1673
                    results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(opts.formatLoadMore(this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);                                    // 1675
                }                                                                                                      // 1676
                                                                                                                       // 1677
                this.postprocessResults(data, initial);                                                                // 1678
                                                                                                                       // 1679
                postRender();                                                                                          // 1680
                                                                                                                       // 1681
                this.opts.element.trigger({ type: "select2-loaded", items: data });                                    // 1682
            })});                                                                                                      // 1683
        },                                                                                                             // 1684
                                                                                                                       // 1685
        // abstract                                                                                                    // 1686
        cancel: function () {                                                                                          // 1687
            this.close();                                                                                              // 1688
        },                                                                                                             // 1689
                                                                                                                       // 1690
        // abstract                                                                                                    // 1691
        blur: function () {                                                                                            // 1692
            // if selectOnBlur == true, select the currently highlighted option                                        // 1693
            if (this.opts.selectOnBlur)                                                                                // 1694
                this.selectHighlighted({noFocus: true});                                                               // 1695
                                                                                                                       // 1696
            this.close();                                                                                              // 1697
            this.container.removeClass("select2-container-active");                                                    // 1698
            // synonymous to .is(':focus'), which is available in jquery >= 1.6                                        // 1699
            if (this.search[0] === document.activeElement) { this.search.blur(); }                                     // 1700
            this.clearSearch();                                                                                        // 1701
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");            // 1702
        },                                                                                                             // 1703
                                                                                                                       // 1704
        // abstract                                                                                                    // 1705
        focusSearch: function () {                                                                                     // 1706
            focus(this.search);                                                                                        // 1707
        },                                                                                                             // 1708
                                                                                                                       // 1709
        // abstract                                                                                                    // 1710
        selectHighlighted: function (options) {                                                                        // 1711
            var index=this.highlight(),                                                                                // 1712
                highlighted=this.results.find(".select2-highlighted"),                                                 // 1713
                data = highlighted.closest('.select2-result').data("select2-data");                                    // 1714
                                                                                                                       // 1715
            if (data) {                                                                                                // 1716
                this.highlight(index);                                                                                 // 1717
                this.onSelect(data, options);                                                                          // 1718
            } else if (options && options.noFocus) {                                                                   // 1719
                this.close();                                                                                          // 1720
            }                                                                                                          // 1721
        },                                                                                                             // 1722
                                                                                                                       // 1723
        // abstract                                                                                                    // 1724
        getPlaceholder: function () {                                                                                  // 1725
            var placeholderOption;                                                                                     // 1726
            return this.opts.element.attr("placeholder") ||                                                            // 1727
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat                                     // 1728
                this.opts.element.data("placeholder") ||                                                               // 1729
                this.opts.placeholder ||                                                                               // 1730
                ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
        },                                                                                                             // 1732
                                                                                                                       // 1733
        // abstract                                                                                                    // 1734
        getPlaceholderOption: function() {                                                                             // 1735
            if (this.select) {                                                                                         // 1736
                var firstOption = this.select.children('option').first();                                              // 1737
                if (this.opts.placeholderOption !== undefined ) {                                                      // 1738
                    //Determine the placeholder option based on the specified placeholderOption setting                // 1739
                    return (this.opts.placeholderOption === "first" && firstOption) ||                                 // 1740
                           (typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select));
                } else if (firstOption.text() === "" && firstOption.val() === "") {                                    // 1742
                    //No explicit placeholder option specified, use the first if it's blank                            // 1743
                    return firstOption;                                                                                // 1744
                }                                                                                                      // 1745
            }                                                                                                          // 1746
        },                                                                                                             // 1747
                                                                                                                       // 1748
        /**                                                                                                            // 1749
         * Get the desired width for the container element.  This is                                                   // 1750
         * derived first from option `width` passed to select2, then                                                   // 1751
         * the inline 'style' on the original element, and finally                                                     // 1752
         * falls back to the jQuery calculated element width.                                                          // 1753
         */                                                                                                            // 1754
        // abstract                                                                                                    // 1755
        initContainerWidth: function () {                                                                              // 1756
            function resolveContainerWidth() {                                                                         // 1757
                var style, attrs, matches, i, l, attr;                                                                 // 1758
                                                                                                                       // 1759
                if (this.opts.width === "off") {                                                                       // 1760
                    return null;                                                                                       // 1761
                } else if (this.opts.width === "element"){                                                             // 1762
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {                              // 1764
                    // check if there is inline style on the element that contains width                               // 1765
                    style = this.opts.element.attr('style');                                                           // 1766
                    if (style !== undefined) {                                                                         // 1767
                        attrs = style.split(';');                                                                      // 1768
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {                                              // 1769
                            attr = attrs[i].replace(/\s/g, '');                                                        // 1770
                            matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);     // 1771
                            if (matches !== null && matches.length >= 1)                                               // 1772
                                return matches[1];                                                                     // 1773
                        }                                                                                              // 1774
                    }                                                                                                  // 1775
                                                                                                                       // 1776
                    if (this.opts.width === "resolve") {                                                               // 1777
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css                               // 1779
                        style = this.opts.element.css('width');                                                        // 1780
                        if (style.indexOf("%") > 0) return style;                                                      // 1781
                                                                                                                       // 1782
                        // finally, fallback on the calculated width of the element                                    // 1783
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }                                                                                                  // 1785
                                                                                                                       // 1786
                    return null;                                                                                       // 1787
                } else if ($.isFunction(this.opts.width)) {                                                            // 1788
                    return this.opts.width();                                                                          // 1789
                } else {                                                                                               // 1790
                    return this.opts.width;                                                                            // 1791
               }                                                                                                       // 1792
            };                                                                                                         // 1793
                                                                                                                       // 1794
            var width = resolveContainerWidth.call(this);                                                              // 1795
            if (width !== null) {                                                                                      // 1796
                this.container.css("width", width);                                                                    // 1797
            }                                                                                                          // 1798
        }                                                                                                              // 1799
    });                                                                                                                // 1800
                                                                                                                       // 1801
    SingleSelect2 = clazz(AbstractSelect2, {                                                                           // 1802
                                                                                                                       // 1803
        // single                                                                                                      // 1804
                                                                                                                       // 1805
        createContainer: function () {                                                                                 // 1806
            var container = $(document.createElement("div")).attr({                                                    // 1807
                "class": "select2-container"                                                                           // 1808
            }).html([                                                                                                  // 1809
                "<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>",          // 1810
                "   <span class='select2-chosen'>&nbsp;</span><abbr class='select2-search-choice-close'></abbr>",      // 1811
                "   <span class='select2-arrow'><b></b></span>",                                                       // 1812
                "</a>",                                                                                                // 1813
                "<input class='select2-focusser select2-offscreen' type='text'/>",                                     // 1814
                "<div class='select2-drop select2-display-none'>",                                                     // 1815
                "   <div class='select2-search'>",                                                                     // 1816
                "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'/>",
                "   </div>",                                                                                           // 1818
                "   <ul class='select2-results'>",                                                                     // 1819
                "   </ul>",                                                                                            // 1820
                "</div>"].join(""));                                                                                   // 1821
            return container;                                                                                          // 1822
        },                                                                                                             // 1823
                                                                                                                       // 1824
        // single                                                                                                      // 1825
        enableInterface: function() {                                                                                  // 1826
            if (this.parent.enableInterface.apply(this, arguments)) {                                                  // 1827
                this.focusser.prop("disabled", !this.isInterfaceEnabled());                                            // 1828
            }                                                                                                          // 1829
        },                                                                                                             // 1830
                                                                                                                       // 1831
        // single                                                                                                      // 1832
        opening: function () {                                                                                         // 1833
            var el, range, len;                                                                                        // 1834
                                                                                                                       // 1835
            if (this.opts.minimumResultsForSearch >= 0) {                                                              // 1836
                this.showSearch(true);                                                                                 // 1837
            }                                                                                                          // 1838
                                                                                                                       // 1839
            this.parent.opening.apply(this, arguments);                                                                // 1840
                                                                                                                       // 1841
            if (this.showSearchInput !== false) {                                                                      // 1842
                // IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
                // all other browsers handle this just fine                                                            // 1844
                                                                                                                       // 1845
                this.search.val(this.focusser.val());                                                                  // 1846
            }                                                                                                          // 1847
            this.search.focus();                                                                                       // 1848
            // move the cursor to the end after focussing, otherwise it will be at the beginning and                   // 1849
            // new text will appear *before* focusser.val()                                                            // 1850
            el = this.search.get(0);                                                                                   // 1851
            if (el.createTextRange) {                                                                                  // 1852
                range = el.createTextRange();                                                                          // 1853
                range.collapse(false);                                                                                 // 1854
                range.select();                                                                                        // 1855
            } else if (el.setSelectionRange) {                                                                         // 1856
                len = this.search.val().length;                                                                        // 1857
                el.setSelectionRange(len, len);                                                                        // 1858
            }                                                                                                          // 1859
                                                                                                                       // 1860
            // initializes search's value with nextSearchTerm (if defined by user)                                     // 1861
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter                           // 1862
            if(this.search.val() === "") {                                                                             // 1863
                if(this.nextSearchTerm != undefined){                                                                  // 1864
                    this.search.val(this.nextSearchTerm);                                                              // 1865
                    this.search.select();                                                                              // 1866
                }                                                                                                      // 1867
            }                                                                                                          // 1868
                                                                                                                       // 1869
            this.focusser.prop("disabled", true).val("");                                                              // 1870
            this.updateResults(true);                                                                                  // 1871
            this.opts.element.trigger($.Event("select2-open"));                                                        // 1872
        },                                                                                                             // 1873
                                                                                                                       // 1874
        // single                                                                                                      // 1875
        close: function (params) {                                                                                     // 1876
            if (!this.opened()) return;                                                                                // 1877
            this.parent.close.apply(this, arguments);                                                                  // 1878
                                                                                                                       // 1879
            params = params || {focus: true};                                                                          // 1880
            this.focusser.removeAttr("disabled");                                                                      // 1881
                                                                                                                       // 1882
            if (params.focus) {                                                                                        // 1883
                this.focusser.focus();                                                                                 // 1884
            }                                                                                                          // 1885
        },                                                                                                             // 1886
                                                                                                                       // 1887
        // single                                                                                                      // 1888
        focus: function () {                                                                                           // 1889
            if (this.opened()) {                                                                                       // 1890
                this.close();                                                                                          // 1891
            } else {                                                                                                   // 1892
                this.focusser.removeAttr("disabled");                                                                  // 1893
                this.focusser.focus();                                                                                 // 1894
            }                                                                                                          // 1895
        },                                                                                                             // 1896
                                                                                                                       // 1897
        // single                                                                                                      // 1898
        isFocused: function () {                                                                                       // 1899
            return this.container.hasClass("select2-container-active");                                                // 1900
        },                                                                                                             // 1901
                                                                                                                       // 1902
        // single                                                                                                      // 1903
        cancel: function () {                                                                                          // 1904
            this.parent.cancel.apply(this, arguments);                                                                 // 1905
            this.focusser.removeAttr("disabled");                                                                      // 1906
            this.focusser.focus();                                                                                     // 1907
        },                                                                                                             // 1908
                                                                                                                       // 1909
        // single                                                                                                      // 1910
        destroy: function() {                                                                                          // 1911
            $("label[for='" + this.focusser.attr('id') + "']")                                                         // 1912
                .attr('for', this.opts.element.attr("id"));                                                            // 1913
            this.parent.destroy.apply(this, arguments);                                                                // 1914
        },                                                                                                             // 1915
                                                                                                                       // 1916
        // single                                                                                                      // 1917
        initContainer: function () {                                                                                   // 1918
                                                                                                                       // 1919
            var selection,                                                                                             // 1920
                container = this.container,                                                                            // 1921
                dropdown = this.dropdown;                                                                              // 1922
                                                                                                                       // 1923
            if (this.opts.minimumResultsForSearch < 0) {                                                               // 1924
                this.showSearch(false);                                                                                // 1925
            } else {                                                                                                   // 1926
                this.showSearch(true);                                                                                 // 1927
            }                                                                                                          // 1928
                                                                                                                       // 1929
            this.selection = selection = container.find(".select2-choice");                                            // 1930
                                                                                                                       // 1931
            this.focusser = container.find(".select2-focusser");                                                       // 1932
                                                                                                                       // 1933
            // rewrite labels from original element to focusser                                                        // 1934
            this.focusser.attr("id", "s2id_autogen"+nextUid());                                                        // 1935
                                                                                                                       // 1936
            $("label[for='" + this.opts.element.attr("id") + "']")                                                     // 1937
                .attr('for', this.focusser.attr('id'));                                                                // 1938
                                                                                                                       // 1939
            this.focusser.attr("tabindex", this.elementTabIndex);                                                      // 1940
                                                                                                                       // 1941
            this.search.on("keydown", this.bind(function (e) {                                                         // 1942
                if (!this.isInterfaceEnabled()) return;                                                                // 1943
                                                                                                                       // 1944
                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {                                            // 1945
                    // prevent the page from scrolling                                                                 // 1946
                    killEvent(e);                                                                                      // 1947
                    return;                                                                                            // 1948
                }                                                                                                      // 1949
                                                                                                                       // 1950
                switch (e.which) {                                                                                     // 1951
                    case KEY.UP:                                                                                       // 1952
                    case KEY.DOWN:                                                                                     // 1953
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);                                             // 1954
                        killEvent(e);                                                                                  // 1955
                        return;                                                                                        // 1956
                    case KEY.ENTER:                                                                                    // 1957
                        this.selectHighlighted();                                                                      // 1958
                        killEvent(e);                                                                                  // 1959
                        return;                                                                                        // 1960
                    case KEY.TAB:                                                                                      // 1961
                        this.selectHighlighted({noFocus: true});                                                       // 1962
                        return;                                                                                        // 1963
                    case KEY.ESC:                                                                                      // 1964
                        this.cancel(e);                                                                                // 1965
                        killEvent(e);                                                                                  // 1966
                        return;                                                                                        // 1967
                }                                                                                                      // 1968
            }));                                                                                                       // 1969
                                                                                                                       // 1970
            this.search.on("blur", this.bind(function(e) {                                                             // 1971
                // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                // without this the search field loses focus which is annoying                                         // 1973
                if (document.activeElement === this.body().get(0)) {                                                   // 1974
                    window.setTimeout(this.bind(function() {                                                           // 1975
                        this.search.focus();                                                                           // 1976
                    }), 0);                                                                                            // 1977
                }                                                                                                      // 1978
            }));                                                                                                       // 1979
                                                                                                                       // 1980
            this.focusser.on("keydown", this.bind(function (e) {                                                       // 1981
                if (!this.isInterfaceEnabled()) return;                                                                // 1982
                                                                                                                       // 1983
                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {          // 1984
                    return;                                                                                            // 1985
                }                                                                                                      // 1986
                                                                                                                       // 1987
                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {                                        // 1988
                    killEvent(e);                                                                                      // 1989
                    return;                                                                                            // 1990
                }                                                                                                      // 1991
                                                                                                                       // 1992
                if (e.which == KEY.DOWN || e.which == KEY.UP                                                           // 1993
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {                                              // 1994
                                                                                                                       // 1995
                    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;                                      // 1996
                                                                                                                       // 1997
                    this.open();                                                                                       // 1998
                    killEvent(e);                                                                                      // 1999
                    return;                                                                                            // 2000
                }                                                                                                      // 2001
                                                                                                                       // 2002
                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {                                               // 2003
                    if (this.opts.allowClear) {                                                                        // 2004
                        this.clear();                                                                                  // 2005
                    }                                                                                                  // 2006
                    killEvent(e);                                                                                      // 2007
                    return;                                                                                            // 2008
                }                                                                                                      // 2009
            }));                                                                                                       // 2010
                                                                                                                       // 2011
                                                                                                                       // 2012
            installKeyUpChangeEvent(this.focusser);                                                                    // 2013
            this.focusser.on("keyup-change input", this.bind(function(e) {                                             // 2014
                if (this.opts.minimumResultsForSearch >= 0) {                                                          // 2015
                    e.stopPropagation();                                                                               // 2016
                    if (this.opened()) return;                                                                         // 2017
                    this.open();                                                                                       // 2018
                }                                                                                                      // 2019
            }));                                                                                                       // 2020
                                                                                                                       // 2021
            selection.on("mousedown", "abbr", this.bind(function (e) {                                                 // 2022
                if (!this.isInterfaceEnabled()) return;                                                                // 2023
                this.clear();                                                                                          // 2024
                killEventImmediately(e);                                                                               // 2025
                this.close();                                                                                          // 2026
                this.selection.focus();                                                                                // 2027
            }));                                                                                                       // 2028
                                                                                                                       // 2029
            selection.on("mousedown", this.bind(function (e) {                                                         // 2030
                                                                                                                       // 2031
                if (!this.container.hasClass("select2-container-active")) {                                            // 2032
                    this.opts.element.trigger($.Event("select2-focus"));                                               // 2033
                }                                                                                                      // 2034
                                                                                                                       // 2035
                if (this.opened()) {                                                                                   // 2036
                    this.close();                                                                                      // 2037
                } else if (this.isInterfaceEnabled()) {                                                                // 2038
                    this.open();                                                                                       // 2039
                }                                                                                                      // 2040
                                                                                                                       // 2041
                killEvent(e);                                                                                          // 2042
            }));                                                                                                       // 2043
                                                                                                                       // 2044
            dropdown.on("mousedown", this.bind(function() { this.search.focus(); }));                                  // 2045
                                                                                                                       // 2046
            selection.on("focus", this.bind(function(e) {                                                              // 2047
                killEvent(e);                                                                                          // 2048
            }));                                                                                                       // 2049
                                                                                                                       // 2050
            this.focusser.on("focus", this.bind(function(){                                                            // 2051
                if (!this.container.hasClass("select2-container-active")) {                                            // 2052
                    this.opts.element.trigger($.Event("select2-focus"));                                               // 2053
                }                                                                                                      // 2054
                this.container.addClass("select2-container-active");                                                   // 2055
            })).on("blur", this.bind(function() {                                                                      // 2056
                if (!this.opened()) {                                                                                  // 2057
                    this.container.removeClass("select2-container-active");                                            // 2058
                    this.opts.element.trigger($.Event("select2-blur"));                                                // 2059
                }                                                                                                      // 2060
            }));                                                                                                       // 2061
            this.search.on("focus", this.bind(function(){                                                              // 2062
                if (!this.container.hasClass("select2-container-active")) {                                            // 2063
                    this.opts.element.trigger($.Event("select2-focus"));                                               // 2064
                }                                                                                                      // 2065
                this.container.addClass("select2-container-active");                                                   // 2066
            }));                                                                                                       // 2067
                                                                                                                       // 2068
            this.initContainerWidth();                                                                                 // 2069
            this.opts.element.addClass("select2-offscreen");                                                           // 2070
            this.setPlaceholder();                                                                                     // 2071
                                                                                                                       // 2072
        },                                                                                                             // 2073
                                                                                                                       // 2074
        // single                                                                                                      // 2075
        clear: function(triggerChange) {                                                                               // 2076
            var data=this.selection.data("select2-data");                                                              // 2077
            if (data) { // guard against queued quick consecutive clicks                                               // 2078
                var evt = $.Event("select2-clearing");                                                                 // 2079
                this.opts.element.trigger(evt);                                                                        // 2080
                if (evt.isDefaultPrevented()) {                                                                        // 2081
                    return;                                                                                            // 2082
                }                                                                                                      // 2083
                var placeholderOption = this.getPlaceholderOption();                                                   // 2084
                this.opts.element.val(placeholderOption ? placeholderOption.val() : "");                               // 2085
                this.selection.find(".select2-chosen").empty();                                                        // 2086
                this.selection.removeData("select2-data");                                                             // 2087
                this.setPlaceholder();                                                                                 // 2088
                                                                                                                       // 2089
                if (triggerChange !== false){                                                                          // 2090
                    this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });          // 2091
                    this.triggerChange({removed:data});                                                                // 2092
                }                                                                                                      // 2093
            }                                                                                                          // 2094
        },                                                                                                             // 2095
                                                                                                                       // 2096
        /**                                                                                                            // 2097
         * Sets selection based on source element's value                                                              // 2098
         */                                                                                                            // 2099
        // single                                                                                                      // 2100
        initSelection: function () {                                                                                   // 2101
            var selected;                                                                                              // 2102
            if (this.isPlaceholderOptionSelected()) {                                                                  // 2103
                this.updateSelection(null);                                                                            // 2104
                this.close();                                                                                          // 2105
                this.setPlaceholder();                                                                                 // 2106
            } else {                                                                                                   // 2107
                var self = this;                                                                                       // 2108
                this.opts.initSelection.call(null, this.opts.element, function(selected){                              // 2109
                    if (selected !== undefined && selected !== null) {                                                 // 2110
                        self.updateSelection(selected);                                                                // 2111
                        self.close();                                                                                  // 2112
                        self.setPlaceholder();                                                                         // 2113
                    }                                                                                                  // 2114
                });                                                                                                    // 2115
            }                                                                                                          // 2116
        },                                                                                                             // 2117
                                                                                                                       // 2118
        isPlaceholderOptionSelected: function() {                                                                      // 2119
            var placeholderOption;                                                                                     // 2120
            if (!this.getPlaceholder()) return false; // no placeholder specified so no option should be considered    // 2121
            return ((placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected"))
                || (this.opts.element.val() === "")                                                                    // 2123
                || (this.opts.element.val() === undefined)                                                             // 2124
                || (this.opts.element.val() === null);                                                                 // 2125
        },                                                                                                             // 2126
                                                                                                                       // 2127
        // single                                                                                                      // 2128
        prepareOpts: function () {                                                                                     // 2129
            var opts = this.parent.prepareOpts.apply(this, arguments),                                                 // 2130
                self=this;                                                                                             // 2131
                                                                                                                       // 2132
            if (opts.element.get(0).tagName.toLowerCase() === "select") {                                              // 2133
                // install the selection initializer                                                                   // 2134
                opts.initSelection = function (element, callback) {                                                    // 2135
                    var selected = element.find("option").filter(function() { return this.selected });                 // 2136
                    // a single select box always has a value, no need to null check 'selected'                        // 2137
                    callback(self.optionToData(selected));                                                             // 2138
                };                                                                                                     // 2139
            } else if ("data" in opts) {                                                                               // 2140
                // install default initSelection when applied to hidden input and data is local                        // 2141
                opts.initSelection = opts.initSelection || function (element, callback) {                              // 2142
                    var id = element.val();                                                                            // 2143
                    //search in data by id, storing the actual matching item                                           // 2144
                    var match = null;                                                                                  // 2145
                    opts.query({                                                                                       // 2146
                        matcher: function(term, text, el){                                                             // 2147
                            var is_match = equal(id, opts.id(el));                                                     // 2148
                            if (is_match) {                                                                            // 2149
                                match = el;                                                                            // 2150
                            }                                                                                          // 2151
                            return is_match;                                                                           // 2152
                        },                                                                                             // 2153
                        callback: !$.isFunction(callback) ? $.noop : function() {                                      // 2154
                            callback(match);                                                                           // 2155
                        }                                                                                              // 2156
                    });                                                                                                // 2157
                };                                                                                                     // 2158
            }                                                                                                          // 2159
                                                                                                                       // 2160
            return opts;                                                                                               // 2161
        },                                                                                                             // 2162
                                                                                                                       // 2163
        // single                                                                                                      // 2164
        getPlaceholder: function() {                                                                                   // 2165
            // if a placeholder is specified on a single select without a valid placeholder option ignore it           // 2166
            if (this.select) {                                                                                         // 2167
                if (this.getPlaceholderOption() === undefined) {                                                       // 2168
                    return undefined;                                                                                  // 2169
                }                                                                                                      // 2170
            }                                                                                                          // 2171
                                                                                                                       // 2172
            return this.parent.getPlaceholder.apply(this, arguments);                                                  // 2173
        },                                                                                                             // 2174
                                                                                                                       // 2175
        // single                                                                                                      // 2176
        setPlaceholder: function () {                                                                                  // 2177
            var placeholder = this.getPlaceholder();                                                                   // 2178
                                                                                                                       // 2179
            if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {                                     // 2180
                                                                                                                       // 2181
                // check for a placeholder option if attached to a select                                              // 2182
                if (this.select && this.getPlaceholderOption() === undefined) return;                                  // 2183
                                                                                                                       // 2184
                this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));                      // 2185
                                                                                                                       // 2186
                this.selection.addClass("select2-default");                                                            // 2187
                                                                                                                       // 2188
                this.container.removeClass("select2-allowclear");                                                      // 2189
            }                                                                                                          // 2190
        },                                                                                                             // 2191
                                                                                                                       // 2192
        // single                                                                                                      // 2193
        postprocessResults: function (data, initial, noHighlightUpdate) {                                              // 2194
            var selected = 0, self = this, showSearchInput = true;                                                     // 2195
                                                                                                                       // 2196
            // find the selected element in the result list                                                            // 2197
                                                                                                                       // 2198
            this.findHighlightableChoices().each2(function (i, elm) {                                                  // 2199
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {                               // 2200
                    selected = i;                                                                                      // 2201
                    return false;                                                                                      // 2202
                }                                                                                                      // 2203
            });                                                                                                        // 2204
                                                                                                                       // 2205
            // and highlight it                                                                                        // 2206
            if (noHighlightUpdate !== false) {                                                                         // 2207
                if (initial === true && selected >= 0) {                                                               // 2208
                    this.highlight(selected);                                                                          // 2209
                } else {                                                                                               // 2210
                    this.highlight(0);                                                                                 // 2211
                }                                                                                                      // 2212
            }                                                                                                          // 2213
                                                                                                                       // 2214
            // hide the search box if this is the first we got the results and there are enough of them for search     // 2215
                                                                                                                       // 2216
            if (initial === true) {                                                                                    // 2217
                var min = this.opts.minimumResultsForSearch;                                                           // 2218
                if (min >= 0) {                                                                                        // 2219
                    this.showSearch(countResults(data.results) >= min);                                                // 2220
                }                                                                                                      // 2221
            }                                                                                                          // 2222
        },                                                                                                             // 2223
                                                                                                                       // 2224
        // single                                                                                                      // 2225
        showSearch: function(showSearchInput) {                                                                        // 2226
            if (this.showSearchInput === showSearchInput) return;                                                      // 2227
                                                                                                                       // 2228
            this.showSearchInput = showSearchInput;                                                                    // 2229
                                                                                                                       // 2230
            this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);              // 2231
            this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);                  // 2232
            //add "select2-with-searchbox" to the container if search box is shown                                     // 2233
            $(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);                   // 2234
        },                                                                                                             // 2235
                                                                                                                       // 2236
        // single                                                                                                      // 2237
        onSelect: function (data, options) {                                                                           // 2238
                                                                                                                       // 2239
            if (!this.triggerSelect(data)) { return; }                                                                 // 2240
                                                                                                                       // 2241
            var old = this.opts.element.val(),                                                                         // 2242
                oldData = this.data();                                                                                 // 2243
                                                                                                                       // 2244
            this.opts.element.val(this.id(data));                                                                      // 2245
            this.updateSelection(data);                                                                                // 2246
                                                                                                                       // 2247
            this.opts.element.trigger({ type: "select2-selected", val: this.id(data), choice: data });                 // 2248
                                                                                                                       // 2249
            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());                                   // 2250
            this.close();                                                                                              // 2251
                                                                                                                       // 2252
            if (!options || !options.noFocus)                                                                          // 2253
                this.focusser.focus();                                                                                 // 2254
                                                                                                                       // 2255
            if (!equal(old, this.id(data))) { this.triggerChange({added:data,removed:oldData}); }                      // 2256
        },                                                                                                             // 2257
                                                                                                                       // 2258
        // single                                                                                                      // 2259
        updateSelection: function (data) {                                                                             // 2260
                                                                                                                       // 2261
            var container=this.selection.find(".select2-chosen"), formatted, cssClass;                                 // 2262
                                                                                                                       // 2263
            this.selection.data("select2-data", data);                                                                 // 2264
                                                                                                                       // 2265
            container.empty();                                                                                         // 2266
            if (data !== null) {                                                                                       // 2267
                formatted=this.opts.formatSelection(data, container, this.opts.escapeMarkup);                          // 2268
            }                                                                                                          // 2269
            if (formatted !== undefined) {                                                                             // 2270
                container.append(formatted);                                                                           // 2271
            }                                                                                                          // 2272
            cssClass=this.opts.formatSelectionCssClass(data, container);                                               // 2273
            if (cssClass !== undefined) {                                                                              // 2274
                container.addClass(cssClass);                                                                          // 2275
            }                                                                                                          // 2276
                                                                                                                       // 2277
            this.selection.removeClass("select2-default");                                                             // 2278
                                                                                                                       // 2279
            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {                                         // 2280
                this.container.addClass("select2-allowclear");                                                         // 2281
            }                                                                                                          // 2282
        },                                                                                                             // 2283
                                                                                                                       // 2284
        // single                                                                                                      // 2285
        val: function () {                                                                                             // 2286
            var val,                                                                                                   // 2287
                triggerChange = false,                                                                                 // 2288
                data = null,                                                                                           // 2289
                self = this,                                                                                           // 2290
                oldData = this.data();                                                                                 // 2291
                                                                                                                       // 2292
            if (arguments.length === 0) {                                                                              // 2293
                return this.opts.element.val();                                                                        // 2294
            }                                                                                                          // 2295
                                                                                                                       // 2296
            val = arguments[0];                                                                                        // 2297
                                                                                                                       // 2298
            if (arguments.length > 1) {                                                                                // 2299
                triggerChange = arguments[1];                                                                          // 2300
            }                                                                                                          // 2301
                                                                                                                       // 2302
            if (this.select) {                                                                                         // 2303
                this.select                                                                                            // 2304
                    .val(val)                                                                                          // 2305
                    .find("option").filter(function() { return this.selected }).each2(function (i, elm) {              // 2306
                        data = self.optionToData(elm);                                                                 // 2307
                        return false;                                                                                  // 2308
                    });                                                                                                // 2309
                this.updateSelection(data);                                                                            // 2310
                this.setPlaceholder();                                                                                 // 2311
                if (triggerChange) {                                                                                   // 2312
                    this.triggerChange({added: data, removed:oldData});                                                // 2313
                }                                                                                                      // 2314
            } else {                                                                                                   // 2315
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal                                   // 2316
                if (!val && val !== 0) {                                                                               // 2317
                    this.clear(triggerChange);                                                                         // 2318
                    return;                                                                                            // 2319
                }                                                                                                      // 2320
                if (this.opts.initSelection === undefined) {                                                           // 2321
                    throw new Error("cannot call val() if initSelection() is not defined");                            // 2322
                }                                                                                                      // 2323
                this.opts.element.val(val);                                                                            // 2324
                this.opts.initSelection(this.opts.element, function(data){                                             // 2325
                    self.opts.element.val(!data ? "" : self.id(data));                                                 // 2326
                    self.updateSelection(data);                                                                        // 2327
                    self.setPlaceholder();                                                                             // 2328
                    if (triggerChange) {                                                                               // 2329
                        self.triggerChange({added: data, removed:oldData});                                            // 2330
                    }                                                                                                  // 2331
                });                                                                                                    // 2332
            }                                                                                                          // 2333
        },                                                                                                             // 2334
                                                                                                                       // 2335
        // single                                                                                                      // 2336
        clearSearch: function () {                                                                                     // 2337
            this.search.val("");                                                                                       // 2338
            this.focusser.val("");                                                                                     // 2339
        },                                                                                                             // 2340
                                                                                                                       // 2341
        // single                                                                                                      // 2342
        data: function(value) {                                                                                        // 2343
            var data,                                                                                                  // 2344
                triggerChange = false;                                                                                 // 2345
                                                                                                                       // 2346
            if (arguments.length === 0) {                                                                              // 2347
                data = this.selection.data("select2-data");                                                            // 2348
                if (data == undefined) data = null;                                                                    // 2349
                return data;                                                                                           // 2350
            } else {                                                                                                   // 2351
                if (arguments.length > 1) {                                                                            // 2352
                    triggerChange = arguments[1];                                                                      // 2353
                }                                                                                                      // 2354
                if (!value) {                                                                                          // 2355
                    this.clear(triggerChange);                                                                         // 2356
                } else {                                                                                               // 2357
                    data = this.data();                                                                                // 2358
                    this.opts.element.val(!value ? "" : this.id(value));                                               // 2359
                    this.updateSelection(value);                                                                       // 2360
                    if (triggerChange) {                                                                               // 2361
                        this.triggerChange({added: value, removed:data});                                              // 2362
                    }                                                                                                  // 2363
                }                                                                                                      // 2364
            }                                                                                                          // 2365
        }                                                                                                              // 2366
    });                                                                                                                // 2367
                                                                                                                       // 2368
    MultiSelect2 = clazz(AbstractSelect2, {                                                                            // 2369
                                                                                                                       // 2370
        // multi                                                                                                       // 2371
        createContainer: function () {                                                                                 // 2372
            var container = $(document.createElement("div")).attr({                                                    // 2373
                "class": "select2-container select2-container-multi"                                                   // 2374
            }).html([                                                                                                  // 2375
                "<ul class='select2-choices'>",                                                                        // 2376
                "  <li class='select2-search-field'>",                                                                 // 2377
                "    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>",
                "  </li>",                                                                                             // 2379
                "</ul>",                                                                                               // 2380
                "<div class='select2-drop select2-drop-multi select2-display-none'>",                                  // 2381
                "   <ul class='select2-results'>",                                                                     // 2382
                "   </ul>",                                                                                            // 2383
                "</div>"].join(""));                                                                                   // 2384
            return container;                                                                                          // 2385
        },                                                                                                             // 2386
                                                                                                                       // 2387
        // multi                                                                                                       // 2388
        prepareOpts: function () {                                                                                     // 2389
            var opts = this.parent.prepareOpts.apply(this, arguments),                                                 // 2390
                self=this;                                                                                             // 2391
                                                                                                                       // 2392
            // TODO validate placeholder is a string if specified                                                      // 2393
                                                                                                                       // 2394
            if (opts.element.get(0).tagName.toLowerCase() === "select") {                                              // 2395
                // install sthe selection initializer                                                                  // 2396
                opts.initSelection = function (element, callback) {                                                    // 2397
                                                                                                                       // 2398
                    var data = [];                                                                                     // 2399
                                                                                                                       // 2400
                    element.find("option").filter(function() { return this.selected }).each2(function (i, elm) {       // 2401
                        data.push(self.optionToData(elm));                                                             // 2402
                    });                                                                                                // 2403
                    callback(data);                                                                                    // 2404
                };                                                                                                     // 2405
            } else if ("data" in opts) {                                                                               // 2406
                // install default initSelection when applied to hidden input and data is local                        // 2407
                opts.initSelection = opts.initSelection || function (element, callback) {                              // 2408
                    var ids = splitVal(element.val(), opts.separator);                                                 // 2409
                    //search in data by array of ids, storing matching items in a list                                 // 2410
                    var matches = [];                                                                                  // 2411
                    opts.query({                                                                                       // 2412
                        matcher: function(term, text, el){                                                             // 2413
                            var is_match = $.grep(ids, function(id) {                                                  // 2414
                                return equal(id, opts.id(el));                                                         // 2415
                            }).length;                                                                                 // 2416
                            if (is_match) {                                                                            // 2417
                                matches.push(el);                                                                      // 2418
                            }                                                                                          // 2419
                            return is_match;                                                                           // 2420
                        },                                                                                             // 2421
                        callback: !$.isFunction(callback) ? $.noop : function() {                                      // 2422
                            // reorder matches based on the order they appear in the ids array because right now       // 2423
                            // they are in the order in which they appear in data array                                // 2424
                            var ordered = [];                                                                          // 2425
                            for (var i = 0; i < ids.length; i++) {                                                     // 2426
                                var id = ids[i];                                                                       // 2427
                                for (var j = 0; j < matches.length; j++) {                                             // 2428
                                    var match = matches[j];                                                            // 2429
                                    if (equal(id, opts.id(match))) {                                                   // 2430
                                        ordered.push(match);                                                           // 2431
                                        matches.splice(j, 1);                                                          // 2432
                                        break;                                                                         // 2433
                                    }                                                                                  // 2434
                                }                                                                                      // 2435
                            }                                                                                          // 2436
                            callback(ordered);                                                                         // 2437
                        }                                                                                              // 2438
                    });                                                                                                // 2439
                };                                                                                                     // 2440
            }                                                                                                          // 2441
                                                                                                                       // 2442
            return opts;                                                                                               // 2443
        },                                                                                                             // 2444
                                                                                                                       // 2445
        // multi                                                                                                       // 2446
        selectChoice: function (choice) {                                                                              // 2447
                                                                                                                       // 2448
            var selected = this.container.find(".select2-search-choice-focus");                                        // 2449
            if (selected.length && choice && choice[0] == selected[0]) {                                               // 2450
                                                                                                                       // 2451
            } else {                                                                                                   // 2452
                if (selected.length) {                                                                                 // 2453
                    this.opts.element.trigger("choice-deselected", selected);                                          // 2454
                }                                                                                                      // 2455
                selected.removeClass("select2-search-choice-focus");                                                   // 2456
                if (choice && choice.length) {                                                                         // 2457
                    this.close();                                                                                      // 2458
                    choice.addClass("select2-search-choice-focus");                                                    // 2459
                    this.opts.element.trigger("choice-selected", choice);                                              // 2460
                }                                                                                                      // 2461
            }                                                                                                          // 2462
        },                                                                                                             // 2463
                                                                                                                       // 2464
        // multi                                                                                                       // 2465
        destroy: function() {                                                                                          // 2466
            $("label[for='" + this.search.attr('id') + "']")                                                           // 2467
                .attr('for', this.opts.element.attr("id"));                                                            // 2468
            this.parent.destroy.apply(this, arguments);                                                                // 2469
        },                                                                                                             // 2470
                                                                                                                       // 2471
        // multi                                                                                                       // 2472
        initContainer: function () {                                                                                   // 2473
                                                                                                                       // 2474
            var selector = ".select2-choices", selection;                                                              // 2475
                                                                                                                       // 2476
            this.searchContainer = this.container.find(".select2-search-field");                                       // 2477
            this.selection = selection = this.container.find(selector);                                                // 2478
                                                                                                                       // 2479
            var _this = this;                                                                                          // 2480
            this.selection.on("click", ".select2-search-choice:not(.select2-locked)", function (e) {                   // 2481
                //killEvent(e);                                                                                        // 2482
                _this.search[0].focus();                                                                               // 2483
                _this.selectChoice($(this));                                                                           // 2484
            });                                                                                                        // 2485
                                                                                                                       // 2486
            // rewrite labels from original element to focusser                                                        // 2487
            this.search.attr("id", "s2id_autogen"+nextUid());                                                          // 2488
            $("label[for='" + this.opts.element.attr("id") + "']")                                                     // 2489
                .attr('for', this.search.attr('id'));                                                                  // 2490
                                                                                                                       // 2491
            this.search.on("input paste", this.bind(function() {                                                       // 2492
                if (!this.isInterfaceEnabled()) return;                                                                // 2493
                if (!this.opened()) {                                                                                  // 2494
                    this.open();                                                                                       // 2495
                }                                                                                                      // 2496
            }));                                                                                                       // 2497
                                                                                                                       // 2498
            this.search.attr("tabindex", this.elementTabIndex);                                                        // 2499
                                                                                                                       // 2500
            this.keydowns = 0;                                                                                         // 2501
            this.search.on("keydown", this.bind(function (e) {                                                         // 2502
                if (!this.isInterfaceEnabled()) return;                                                                // 2503
                                                                                                                       // 2504
                ++this.keydowns;                                                                                       // 2505
                var selected = selection.find(".select2-search-choice-focus");                                         // 2506
                var prev = selected.prev(".select2-search-choice:not(.select2-locked)");                               // 2507
                var next = selected.next(".select2-search-choice:not(.select2-locked)");                               // 2508
                var pos = getCursorInfo(this.search);                                                                  // 2509
                                                                                                                       // 2510
                if (selected.length &&                                                                                 // 2511
                    (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                    var selectedChoice = selected;                                                                     // 2513
                    if (e.which == KEY.LEFT && prev.length) {                                                          // 2514
                        selectedChoice = prev;                                                                         // 2515
                    }                                                                                                  // 2516
                    else if (e.which == KEY.RIGHT) {                                                                   // 2517
                        selectedChoice = next.length ? next : null;                                                    // 2518
                    }                                                                                                  // 2519
                    else if (e.which === KEY.BACKSPACE) {                                                              // 2520
                        this.unselect(selected.first());                                                               // 2521
                        this.search.width(10);                                                                         // 2522
                        selectedChoice = prev.length ? prev : next;                                                    // 2523
                    } else if (e.which == KEY.DELETE) {                                                                // 2524
                        this.unselect(selected.first());                                                               // 2525
                        this.search.width(10);                                                                         // 2526
                        selectedChoice = next.length ? next : null;                                                    // 2527
                    } else if (e.which == KEY.ENTER) {                                                                 // 2528
                        selectedChoice = null;                                                                         // 2529
                    }                                                                                                  // 2530
                                                                                                                       // 2531
                    this.selectChoice(selectedChoice);                                                                 // 2532
                    killEvent(e);                                                                                      // 2533
                    if (!selectedChoice || !selectedChoice.length) {                                                   // 2534
                        this.open();                                                                                   // 2535
                    }                                                                                                  // 2536
                    return;                                                                                            // 2537
                } else if (((e.which === KEY.BACKSPACE && this.keydowns == 1)                                          // 2538
                    || e.which == KEY.LEFT) && (pos.offset == 0 && !pos.length)) {                                     // 2539
                                                                                                                       // 2540
                    this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());           // 2541
                    killEvent(e);                                                                                      // 2542
                    return;                                                                                            // 2543
                } else {                                                                                               // 2544
                    this.selectChoice(null);                                                                           // 2545
                }                                                                                                      // 2546
                                                                                                                       // 2547
                if (this.opened()) {                                                                                   // 2548
                    switch (e.which) {                                                                                 // 2549
                    case KEY.UP:                                                                                       // 2550
                    case KEY.DOWN:                                                                                     // 2551
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);                                             // 2552
                        killEvent(e);                                                                                  // 2553
                        return;                                                                                        // 2554
                    case KEY.ENTER:                                                                                    // 2555
                        this.selectHighlighted();                                                                      // 2556
                        killEvent(e);                                                                                  // 2557
                        return;                                                                                        // 2558
                    case KEY.TAB:                                                                                      // 2559
                        this.selectHighlighted({noFocus:true});                                                        // 2560
                        this.close();                                                                                  // 2561
                        return;                                                                                        // 2562
                    case KEY.ESC:                                                                                      // 2563
                        this.cancel(e);                                                                                // 2564
                        killEvent(e);                                                                                  // 2565
                        return;                                                                                        // 2566
                    }                                                                                                  // 2567
                }                                                                                                      // 2568
                                                                                                                       // 2569
                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)                                    // 2570
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {                                                // 2571
                    return;                                                                                            // 2572
                }                                                                                                      // 2573
                                                                                                                       // 2574
                if (e.which === KEY.ENTER) {                                                                           // 2575
                    if (this.opts.openOnEnter === false) {                                                             // 2576
                        return;                                                                                        // 2577
                    } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {                                     // 2578
                        return;                                                                                        // 2579
                    }                                                                                                  // 2580
                }                                                                                                      // 2581
                                                                                                                       // 2582
                this.open();                                                                                           // 2583
                                                                                                                       // 2584
                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {                                            // 2585
                    // prevent the page from scrolling                                                                 // 2586
                    killEvent(e);                                                                                      // 2587
                }                                                                                                      // 2588
                                                                                                                       // 2589
                if (e.which === KEY.ENTER) {                                                                           // 2590
                    // prevent form from being submitted                                                               // 2591
                    killEvent(e);                                                                                      // 2592
                }                                                                                                      // 2593
                                                                                                                       // 2594
            }));                                                                                                       // 2595
                                                                                                                       // 2596
            this.search.on("keyup", this.bind(function (e) {                                                           // 2597
                this.keydowns = 0;                                                                                     // 2598
                this.resizeSearch();                                                                                   // 2599
            })                                                                                                         // 2600
            );                                                                                                         // 2601
                                                                                                                       // 2602
            this.search.on("blur", this.bind(function(e) {                                                             // 2603
                this.container.removeClass("select2-container-active");                                                // 2604
                this.search.removeClass("select2-focused");                                                            // 2605
                this.selectChoice(null);                                                                               // 2606
                if (!this.opened()) this.clearSearch();                                                                // 2607
                e.stopImmediatePropagation();                                                                          // 2608
                this.opts.element.trigger($.Event("select2-blur"));                                                    // 2609
            }));                                                                                                       // 2610
                                                                                                                       // 2611
            this.container.on("click", selector, this.bind(function (e) {                                              // 2612
                if (!this.isInterfaceEnabled()) return;                                                                // 2613
                if ($(e.target).closest(".select2-search-choice").length > 0) {                                        // 2614
                    // clicked inside a select2 search choice, do not open                                             // 2615
                    return;                                                                                            // 2616
                }                                                                                                      // 2617
                this.selectChoice(null);                                                                               // 2618
                this.clearPlaceholder();                                                                               // 2619
                if (!this.container.hasClass("select2-container-active")) {                                            // 2620
                    this.opts.element.trigger($.Event("select2-focus"));                                               // 2621
                }                                                                                                      // 2622
                this.open();                                                                                           // 2623
                this.focusSearch();                                                                                    // 2624
                e.preventDefault();                                                                                    // 2625
            }));                                                                                                       // 2626
                                                                                                                       // 2627
            this.container.on("focus", selector, this.bind(function () {                                               // 2628
                if (!this.isInterfaceEnabled()) return;                                                                // 2629
                if (!this.container.hasClass("select2-container-active")) {                                            // 2630
                    this.opts.element.trigger($.Event("select2-focus"));                                               // 2631
                }                                                                                                      // 2632
                this.container.addClass("select2-container-active");                                                   // 2633
                this.dropdown.addClass("select2-drop-active");                                                         // 2634
                this.clearPlaceholder();                                                                               // 2635
            }));                                                                                                       // 2636
                                                                                                                       // 2637
            this.initContainerWidth();                                                                                 // 2638
            this.opts.element.addClass("select2-offscreen");                                                           // 2639
                                                                                                                       // 2640
            // set the placeholder if necessary                                                                        // 2641
            this.clearSearch();                                                                                        // 2642
        },                                                                                                             // 2643
                                                                                                                       // 2644
        // multi                                                                                                       // 2645
        enableInterface: function() {                                                                                  // 2646
            if (this.parent.enableInterface.apply(this, arguments)) {                                                  // 2647
                this.search.prop("disabled", !this.isInterfaceEnabled());                                              // 2648
            }                                                                                                          // 2649
        },                                                                                                             // 2650
                                                                                                                       // 2651
        // multi                                                                                                       // 2652
        initSelection: function () {                                                                                   // 2653
            var data;                                                                                                  // 2654
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {                                   // 2655
                this.updateSelection([]);                                                                              // 2656
                this.close();                                                                                          // 2657
                // set the placeholder if necessary                                                                    // 2658
                this.clearSearch();                                                                                    // 2659
            }                                                                                                          // 2660
            if (this.select || this.opts.element.val() !== "") {                                                       // 2661
                var self = this;                                                                                       // 2662
                this.opts.initSelection.call(null, this.opts.element, function(data){                                  // 2663
                    if (data !== undefined && data !== null) {                                                         // 2664
                        self.updateSelection(data);                                                                    // 2665
                        self.close();                                                                                  // 2666
                        // set the placeholder if necessary                                                            // 2667
                        self.clearSearch();                                                                            // 2668
                    }                                                                                                  // 2669
                });                                                                                                    // 2670
            }                                                                                                          // 2671
        },                                                                                                             // 2672
                                                                                                                       // 2673
        // multi                                                                                                       // 2674
        clearSearch: function () {                                                                                     // 2675
            var placeholder = this.getPlaceholder(),                                                                   // 2676
                maxWidth = this.getMaxSearchWidth();                                                                   // 2677
                                                                                                                       // 2678
            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");                                              // 2680
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));                              // 2683
            } else {                                                                                                   // 2684
                this.search.val("").width(10);                                                                         // 2685
            }                                                                                                          // 2686
        },                                                                                                             // 2687
                                                                                                                       // 2688
        // multi                                                                                                       // 2689
        clearPlaceholder: function () {                                                                                // 2690
            if (this.search.hasClass("select2-default")) {                                                             // 2691
                this.search.val("").removeClass("select2-default");                                                    // 2692
            }                                                                                                          // 2693
        },                                                                                                             // 2694
                                                                                                                       // 2695
        // multi                                                                                                       // 2696
        opening: function () {                                                                                         // 2697
            this.clearPlaceholder(); // should be done before super so placeholder is not used to search               // 2698
            this.resizeSearch();                                                                                       // 2699
                                                                                                                       // 2700
            this.parent.opening.apply(this, arguments);                                                                // 2701
                                                                                                                       // 2702
            this.focusSearch();                                                                                        // 2703
                                                                                                                       // 2704
            this.updateResults(true);                                                                                  // 2705
            this.search.focus();                                                                                       // 2706
            this.opts.element.trigger($.Event("select2-open"));                                                        // 2707
        },                                                                                                             // 2708
                                                                                                                       // 2709
        // multi                                                                                                       // 2710
        close: function () {                                                                                           // 2711
            if (!this.opened()) return;                                                                                // 2712
            this.parent.close.apply(this, arguments);                                                                  // 2713
        },                                                                                                             // 2714
                                                                                                                       // 2715
        // multi                                                                                                       // 2716
        focus: function () {                                                                                           // 2717
            this.close();                                                                                              // 2718
            this.search.focus();                                                                                       // 2719
        },                                                                                                             // 2720
                                                                                                                       // 2721
        // multi                                                                                                       // 2722
        isFocused: function () {                                                                                       // 2723
            return this.search.hasClass("select2-focused");                                                            // 2724
        },                                                                                                             // 2725
                                                                                                                       // 2726
        // multi                                                                                                       // 2727
        updateSelection: function (data) {                                                                             // 2728
            var ids = [], filtered = [], self = this;                                                                  // 2729
                                                                                                                       // 2730
            // filter out duplicates                                                                                   // 2731
            $(data).each(function () {                                                                                 // 2732
                if (indexOf(self.id(this), ids) < 0) {                                                                 // 2733
                    ids.push(self.id(this));                                                                           // 2734
                    filtered.push(this);                                                                               // 2735
                }                                                                                                      // 2736
            });                                                                                                        // 2737
            data = filtered;                                                                                           // 2738
                                                                                                                       // 2739
            this.selection.find(".select2-search-choice").remove();                                                    // 2740
            $(data).each(function () {                                                                                 // 2741
                self.addSelectedChoice(this);                                                                          // 2742
            });                                                                                                        // 2743
            self.postprocessResults();                                                                                 // 2744
        },                                                                                                             // 2745
                                                                                                                       // 2746
        // multi                                                                                                       // 2747
        tokenize: function() {                                                                                         // 2748
            var input = this.search.val();                                                                             // 2749
            input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);           // 2750
            if (input != null && input != undefined) {                                                                 // 2751
                this.search.val(input);                                                                                // 2752
                if (input.length > 0) {                                                                                // 2753
                    this.open();                                                                                       // 2754
                }                                                                                                      // 2755
            }                                                                                                          // 2756
                                                                                                                       // 2757
        },                                                                                                             // 2758
                                                                                                                       // 2759
        // multi                                                                                                       // 2760
        onSelect: function (data, options) {                                                                           // 2761
                                                                                                                       // 2762
            if (!this.triggerSelect(data)) { return; }                                                                 // 2763
                                                                                                                       // 2764
            this.addSelectedChoice(data);                                                                              // 2765
                                                                                                                       // 2766
            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });                         // 2767
                                                                                                                       // 2768
            if (this.select || !this.opts.closeOnSelect) this.postprocessResults(data, false, this.opts.closeOnSelect===true);
                                                                                                                       // 2770
            if (this.opts.closeOnSelect) {                                                                             // 2771
                this.close();                                                                                          // 2772
                this.search.width(10);                                                                                 // 2773
            } else {                                                                                                   // 2774
                if (this.countSelectableResults()>0) {                                                                 // 2775
                    this.search.width(10);                                                                             // 2776
                    this.resizeSearch();                                                                               // 2777
                    if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {   // 2778
                        // if we reached max selection size repaint the results so choices                             // 2779
                        // are replaced with the max selection reached message                                         // 2780
                        this.updateResults(true);                                                                      // 2781
                    }                                                                                                  // 2782
                    this.positionDropdown();                                                                           // 2783
                } else {                                                                                               // 2784
                    // if nothing left to select close                                                                 // 2785
                    this.close();                                                                                      // 2786
                    this.search.width(10);                                                                             // 2787
                }                                                                                                      // 2788
            }                                                                                                          // 2789
                                                                                                                       // 2790
            // since its not possible to select an element that has already been                                       // 2791
            // added we do not need to check if this is a new element before firing change                             // 2792
            this.triggerChange({ added: data });                                                                       // 2793
                                                                                                                       // 2794
            if (!options || !options.noFocus)                                                                          // 2795
                this.focusSearch();                                                                                    // 2796
        },                                                                                                             // 2797
                                                                                                                       // 2798
        // multi                                                                                                       // 2799
        cancel: function () {                                                                                          // 2800
            this.close();                                                                                              // 2801
            this.focusSearch();                                                                                        // 2802
        },                                                                                                             // 2803
                                                                                                                       // 2804
        addSelectedChoice: function (data) {                                                                           // 2805
            var enableChoice = !data.locked,                                                                           // 2806
                enabledItem = $(                                                                                       // 2807
                    "<li class='select2-search-choice'>" +                                                             // 2808
                    "    <div></div>" +                                                                                // 2809
                    "    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a>" + // 2810
                    "</li>"),                                                                                          // 2811
                disabledItem = $(                                                                                      // 2812
                    "<li class='select2-search-choice select2-locked'>" +                                              // 2813
                    "<div></div>" +                                                                                    // 2814
                    "</li>");                                                                                          // 2815
            var choice = enableChoice ? enabledItem : disabledItem,                                                    // 2816
                id = this.id(data),                                                                                    // 2817
                val = this.getVal(),                                                                                   // 2818
                formatted,                                                                                             // 2819
                cssClass;                                                                                              // 2820
                                                                                                                       // 2821
            formatted=this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);                     // 2822
            if (formatted != undefined) {                                                                              // 2823
                choice.find("div").replaceWith("<div>"+formatted+"</div>");                                            // 2824
            }                                                                                                          // 2825
            cssClass=this.opts.formatSelectionCssClass(data, choice.find("div"));                                      // 2826
            if (cssClass != undefined) {                                                                               // 2827
                choice.addClass(cssClass);                                                                             // 2828
            }                                                                                                          // 2829
                                                                                                                       // 2830
            if(enableChoice){                                                                                          // 2831
              choice.find(".select2-search-choice-close")                                                              // 2832
                  .on("mousedown", killEvent)                                                                          // 2833
                  .on("click dblclick", this.bind(function (e) {                                                       // 2834
                  if (!this.isInterfaceEnabled()) return;                                                              // 2835
                                                                                                                       // 2836
                  $(e.target).closest(".select2-search-choice").fadeOut('fast', this.bind(function(){                  // 2837
                      this.unselect($(e.target));                                                                      // 2838
                      this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");  // 2839
                      this.close();                                                                                    // 2840
                      this.focusSearch();                                                                              // 2841
                  })).dequeue();                                                                                       // 2842
                  killEvent(e);                                                                                        // 2843
              })).on("focus", this.bind(function () {                                                                  // 2844
                  if (!this.isInterfaceEnabled()) return;                                                              // 2845
                  this.container.addClass("select2-container-active");                                                 // 2846
                  this.dropdown.addClass("select2-drop-active");                                                       // 2847
              }));                                                                                                     // 2848
            }                                                                                                          // 2849
                                                                                                                       // 2850
            choice.data("select2-data", data);                                                                         // 2851
            choice.insertBefore(this.searchContainer);                                                                 // 2852
                                                                                                                       // 2853
            val.push(id);                                                                                              // 2854
            this.setVal(val);                                                                                          // 2855
        },                                                                                                             // 2856
                                                                                                                       // 2857
        // multi                                                                                                       // 2858
        unselect: function (selected) {                                                                                // 2859
            var val = this.getVal(),                                                                                   // 2860
                data,                                                                                                  // 2861
                index;                                                                                                 // 2862
            selected = selected.closest(".select2-search-choice");                                                     // 2863
                                                                                                                       // 2864
            if (selected.length === 0) {                                                                               // 2865
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";                            // 2866
            }                                                                                                          // 2867
                                                                                                                       // 2868
            data = selected.data("select2-data");                                                                      // 2869
                                                                                                                       // 2870
            if (!data) {                                                                                               // 2871
                // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued     // 2872
                // and invoked on an element already removed                                                           // 2873
                return;                                                                                                // 2874
            }                                                                                                          // 2875
                                                                                                                       // 2876
            while((index = indexOf(this.id(data), val)) >= 0) {                                                        // 2877
                val.splice(index, 1);                                                                                  // 2878
                this.setVal(val);                                                                                      // 2879
                if (this.select) this.postprocessResults();                                                            // 2880
            }                                                                                                          // 2881
                                                                                                                       // 2882
            var evt = $.Event("select2-removing");                                                                     // 2883
            evt.val = this.id(data);                                                                                   // 2884
            evt.choice = data;                                                                                         // 2885
            this.opts.element.trigger(evt);                                                                            // 2886
                                                                                                                       // 2887
            if (evt.isDefaultPrevented()) {                                                                            // 2888
                return;                                                                                                // 2889
            }                                                                                                          // 2890
                                                                                                                       // 2891
            selected.remove();                                                                                         // 2892
                                                                                                                       // 2893
            this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });                  // 2894
            this.triggerChange({ removed: data });                                                                     // 2895
        },                                                                                                             // 2896
                                                                                                                       // 2897
        // multi                                                                                                       // 2898
        postprocessResults: function (data, initial, noHighlightUpdate) {                                              // 2899
            var val = this.getVal(),                                                                                   // 2900
                choices = this.results.find(".select2-result"),                                                        // 2901
                compound = this.results.find(".select2-result-with-children"),                                         // 2902
                self = this;                                                                                           // 2903
                                                                                                                       // 2904
            choices.each2(function (i, choice) {                                                                       // 2905
                var id = self.id(choice.data("select2-data"));                                                         // 2906
                if (indexOf(id, val) >= 0) {                                                                           // 2907
                    choice.addClass("select2-selected");                                                               // 2908
                    // mark all children of the selected parent as selected                                            // 2909
                    choice.find(".select2-result-selectable").addClass("select2-selected");                            // 2910
                }                                                                                                      // 2911
            });                                                                                                        // 2912
                                                                                                                       // 2913
            compound.each2(function(i, choice) {                                                                       // 2914
                // hide an optgroup if it doesnt have any selectable children                                          // 2915
                if (!choice.is('.select2-result-selectable')                                                           // 2916
                    && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {                // 2917
                    choice.addClass("select2-selected");                                                               // 2918
                }                                                                                                      // 2919
            });                                                                                                        // 2920
                                                                                                                       // 2921
            if (this.highlight() == -1 && noHighlightUpdate !== false){                                                // 2922
                self.highlight(0);                                                                                     // 2923
            }                                                                                                          // 2924
                                                                                                                       // 2925
            //If all results are chosen render formatNoMAtches                                                         // 2926
            if(!this.opts.createSearchChoice && !choices.filter('.select2-result:not(.select2-selected)').length > 0){ // 2927
                if(!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {             // 2928
                    if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {                                // 2929
                        this.results.append("<li class='select2-no-results'>" + self.opts.formatNoMatches(self.search.val()) + "</li>");
                    }                                                                                                  // 2931
                }                                                                                                      // 2932
            }                                                                                                          // 2933
                                                                                                                       // 2934
        },                                                                                                             // 2935
                                                                                                                       // 2936
        // multi                                                                                                       // 2937
        getMaxSearchWidth: function() {                                                                                // 2938
            return this.selection.width() - getSideBorderPadding(this.search);                                         // 2939
        },                                                                                                             // 2940
                                                                                                                       // 2941
        // multi                                                                                                       // 2942
        resizeSearch: function () {                                                                                    // 2943
            var minimumWidth, left, maxWidth, containerLeft, searchWidth,                                              // 2944
                sideBorderPadding = getSideBorderPadding(this.search);                                                 // 2945
                                                                                                                       // 2946
            minimumWidth = measureTextWidth(this.search) + 10;                                                         // 2947
                                                                                                                       // 2948
            left = this.search.offset().left;                                                                          // 2949
                                                                                                                       // 2950
            maxWidth = this.selection.width();                                                                         // 2951
            containerLeft = this.selection.offset().left;                                                              // 2952
                                                                                                                       // 2953
            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;                                       // 2954
                                                                                                                       // 2955
            if (searchWidth < minimumWidth) {                                                                          // 2956
                searchWidth = maxWidth - sideBorderPadding;                                                            // 2957
            }                                                                                                          // 2958
                                                                                                                       // 2959
            if (searchWidth < 40) {                                                                                    // 2960
                searchWidth = maxWidth - sideBorderPadding;                                                            // 2961
            }                                                                                                          // 2962
                                                                                                                       // 2963
            if (searchWidth <= 0) {                                                                                    // 2964
              searchWidth = minimumWidth;                                                                              // 2965
            }                                                                                                          // 2966
                                                                                                                       // 2967
            this.search.width(Math.floor(searchWidth));                                                                // 2968
        },                                                                                                             // 2969
                                                                                                                       // 2970
        // multi                                                                                                       // 2971
        getVal: function () {                                                                                          // 2972
            var val;                                                                                                   // 2973
            if (this.select) {                                                                                         // 2974
                val = this.select.val();                                                                               // 2975
                return val === null ? [] : val;                                                                        // 2976
            } else {                                                                                                   // 2977
                val = this.opts.element.val();                                                                         // 2978
                return splitVal(val, this.opts.separator);                                                             // 2979
            }                                                                                                          // 2980
        },                                                                                                             // 2981
                                                                                                                       // 2982
        // multi                                                                                                       // 2983
        setVal: function (val) {                                                                                       // 2984
            var unique;                                                                                                // 2985
            if (this.select) {                                                                                         // 2986
                this.select.val(val);                                                                                  // 2987
            } else {                                                                                                   // 2988
                unique = [];                                                                                           // 2989
                // filter out duplicates                                                                               // 2990
                $(val).each(function () {                                                                              // 2991
                    if (indexOf(this, unique) < 0) unique.push(this);                                                  // 2992
                });                                                                                                    // 2993
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));                    // 2994
            }                                                                                                          // 2995
        },                                                                                                             // 2996
                                                                                                                       // 2997
        // multi                                                                                                       // 2998
        buildChangeDetails: function (old, current) {                                                                  // 2999
            var current = current.slice(0),                                                                            // 3000
                old = old.slice(0);                                                                                    // 3001
                                                                                                                       // 3002
            // remove intersection from each array                                                                     // 3003
            for (var i = 0; i < current.length; i++) {                                                                 // 3004
                for (var j = 0; j < old.length; j++) {                                                                 // 3005
                    if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {                                       // 3006
                        current.splice(i, 1);                                                                          // 3007
                        if(i>0){                                                                                       // 3008
                        	i--;                                                                                          // 3009
                        }                                                                                              // 3010
                        old.splice(j, 1);                                                                              // 3011
                        j--;                                                                                           // 3012
                    }                                                                                                  // 3013
                }                                                                                                      // 3014
            }                                                                                                          // 3015
                                                                                                                       // 3016
            return {added: current, removed: old};                                                                     // 3017
        },                                                                                                             // 3018
                                                                                                                       // 3019
                                                                                                                       // 3020
        // multi                                                                                                       // 3021
        val: function (val, triggerChange) {                                                                           // 3022
            var oldData, self=this;                                                                                    // 3023
                                                                                                                       // 3024
            if (arguments.length === 0) {                                                                              // 3025
                return this.getVal();                                                                                  // 3026
            }                                                                                                          // 3027
                                                                                                                       // 3028
            oldData=this.data();                                                                                       // 3029
            if (!oldData.length) oldData=[];                                                                           // 3030
                                                                                                                       // 3031
            // val is an id. !val is true for [undefined,null,'',0] - 0 is legal                                       // 3032
            if (!val && val !== 0) {                                                                                   // 3033
                this.opts.element.val("");                                                                             // 3034
                this.updateSelection([]);                                                                              // 3035
                this.clearSearch();                                                                                    // 3036
                if (triggerChange) {                                                                                   // 3037
                    this.triggerChange({added: this.data(), removed: oldData});                                        // 3038
                }                                                                                                      // 3039
                return;                                                                                                // 3040
            }                                                                                                          // 3041
                                                                                                                       // 3042
            // val is a list of ids                                                                                    // 3043
            this.setVal(val);                                                                                          // 3044
                                                                                                                       // 3045
            if (this.select) {                                                                                         // 3046
                this.opts.initSelection(this.select, this.bind(this.updateSelection));                                 // 3047
                if (triggerChange) {                                                                                   // 3048
                    this.triggerChange(this.buildChangeDetails(oldData, this.data()));                                 // 3049
                }                                                                                                      // 3050
            } else {                                                                                                   // 3051
                if (this.opts.initSelection === undefined) {                                                           // 3052
                    throw new Error("val() cannot be called if initSelection() is not defined");                       // 3053
                }                                                                                                      // 3054
                                                                                                                       // 3055
                this.opts.initSelection(this.opts.element, function(data){                                             // 3056
                    var ids=$.map(data, self.id);                                                                      // 3057
                    self.setVal(ids);                                                                                  // 3058
                    self.updateSelection(data);                                                                        // 3059
                    self.clearSearch();                                                                                // 3060
                    if (triggerChange) {                                                                               // 3061
                        self.triggerChange(self.buildChangeDetails(oldData, self.data()));                             // 3062
                    }                                                                                                  // 3063
                });                                                                                                    // 3064
            }                                                                                                          // 3065
            this.clearSearch();                                                                                        // 3066
        },                                                                                                             // 3067
                                                                                                                       // 3068
        // multi                                                                                                       // 3069
        onSortStart: function() {                                                                                      // 3070
            if (this.select) {                                                                                         // 3071
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }                                                                                                          // 3073
                                                                                                                       // 3074
            // collapse search field into 0 width so its container can be collapsed as well                            // 3075
            this.search.width(0);                                                                                      // 3076
            // hide the container                                                                                      // 3077
            this.searchContainer.hide();                                                                               // 3078
        },                                                                                                             // 3079
                                                                                                                       // 3080
        // multi                                                                                                       // 3081
        onSortEnd:function() {                                                                                         // 3082
                                                                                                                       // 3083
            var val=[], self=this;                                                                                     // 3084
                                                                                                                       // 3085
            // show search and move it to the end of the list                                                          // 3086
            this.searchContainer.show();                                                                               // 3087
            // make sure the search container is the last item in the list                                             // 3088
            this.searchContainer.appendTo(this.searchContainer.parent());                                              // 3089
            // since we collapsed the width in dragStarted, we resize it here                                          // 3090
            this.resizeSearch();                                                                                       // 3091
                                                                                                                       // 3092
            // update selection                                                                                        // 3093
            this.selection.find(".select2-search-choice").each(function() {                                            // 3094
                val.push(self.opts.id($(this).data("select2-data")));                                                  // 3095
            });                                                                                                        // 3096
            this.setVal(val);                                                                                          // 3097
            this.triggerChange();                                                                                      // 3098
        },                                                                                                             // 3099
                                                                                                                       // 3100
        // multi                                                                                                       // 3101
        data: function(values, triggerChange) {                                                                        // 3102
            var self=this, ids, old;                                                                                   // 3103
            if (arguments.length === 0) {                                                                              // 3104
                 return this.selection                                                                                 // 3105
                     .find(".select2-search-choice")                                                                   // 3106
                     .map(function() { return $(this).data("select2-data"); })                                         // 3107
                     .get();                                                                                           // 3108
            } else {                                                                                                   // 3109
                old = this.data();                                                                                     // 3110
                if (!values) { values = []; }                                                                          // 3111
                ids = $.map(values, function(e) { return self.opts.id(e); });                                          // 3112
                this.setVal(ids);                                                                                      // 3113
                this.updateSelection(values);                                                                          // 3114
                this.clearSearch();                                                                                    // 3115
                if (triggerChange) {                                                                                   // 3116
                    this.triggerChange(this.buildChangeDetails(old, this.data()));                                     // 3117
                }                                                                                                      // 3118
            }                                                                                                          // 3119
        }                                                                                                              // 3120
    });                                                                                                                // 3121
                                                                                                                       // 3122
    $.fn.select2 = function () {                                                                                       // 3123
                                                                                                                       // 3124
        var args = Array.prototype.slice.call(arguments, 0),                                                           // 3125
            opts,                                                                                                      // 3126
            select2,                                                                                                   // 3127
            method, value, multiple,                                                                                   // 3128
            allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search"],
            valueMethods = ["opened", "isFocused", "container", "dropdown"],                                           // 3130
            propertyMethods = ["val", "data"],                                                                         // 3131
            methodsMap = { search: "externalSearch" };                                                                 // 3132
                                                                                                                       // 3133
        this.each(function () {                                                                                        // 3134
            if (args.length === 0 || typeof(args[0]) === "object") {                                                   // 3135
                opts = args.length === 0 ? {} : $.extend({}, args[0]);                                                 // 3136
                opts.element = $(this);                                                                                // 3137
                                                                                                                       // 3138
                if (opts.element.get(0).tagName.toLowerCase() === "select") {                                          // 3139
                    multiple = opts.element.prop("multiple");                                                          // 3140
                } else {                                                                                               // 3141
                    multiple = opts.multiple || false;                                                                 // 3142
                    if ("tags" in opts) {opts.multiple = multiple = true;}                                             // 3143
                }                                                                                                      // 3144
                                                                                                                       // 3145
                select2 = multiple ? new MultiSelect2() : new SingleSelect2();                                         // 3146
                select2.init(opts);                                                                                    // 3147
            } else if (typeof(args[0]) === "string") {                                                                 // 3148
                                                                                                                       // 3149
                if (indexOf(args[0], allowedMethods) < 0) {                                                            // 3150
                    throw "Unknown method: " + args[0];                                                                // 3151
                }                                                                                                      // 3152
                                                                                                                       // 3153
                value = undefined;                                                                                     // 3154
                select2 = $(this).data("select2");                                                                     // 3155
                if (select2 === undefined) return;                                                                     // 3156
                                                                                                                       // 3157
                method=args[0];                                                                                        // 3158
                                                                                                                       // 3159
                if (method === "container") {                                                                          // 3160
                    value = select2.container;                                                                         // 3161
                } else if (method === "dropdown") {                                                                    // 3162
                    value = select2.dropdown;                                                                          // 3163
                } else {                                                                                               // 3164
                    if (methodsMap[method]) method = methodsMap[method];                                               // 3165
                                                                                                                       // 3166
                    value = select2[method].apply(select2, args.slice(1));                                             // 3167
                }                                                                                                      // 3168
                if (indexOf(args[0], valueMethods) >= 0                                                                // 3169
                    || (indexOf(args[0], propertyMethods) && args.length == 1)) {                                      // 3170
                    return false; // abort the iteration, ready to return first matched value                          // 3171
                }                                                                                                      // 3172
            } else {                                                                                                   // 3173
                throw "Invalid arguments to select2 plugin: " + args;                                                  // 3174
            }                                                                                                          // 3175
        });                                                                                                            // 3176
        return (value === undefined) ? this : value;                                                                   // 3177
    };                                                                                                                 // 3178
                                                                                                                       // 3179
    // plugin defaults, accessible to users                                                                            // 3180
    $.fn.select2.defaults = {                                                                                          // 3181
        width: "copy",                                                                                                 // 3182
        loadMorePadding: 0,                                                                                            // 3183
        closeOnSelect: true,                                                                                           // 3184
        openOnEnter: true,                                                                                             // 3185
        containerCss: {},                                                                                              // 3186
        dropdownCss: {},                                                                                               // 3187
        containerCssClass: "",                                                                                         // 3188
        dropdownCssClass: "",                                                                                          // 3189
        formatResult: function(result, container, query, escapeMarkup) {                                               // 3190
            var markup=[];                                                                                             // 3191
            markMatch(result.text, query.term, markup, escapeMarkup);                                                  // 3192
            return markup.join("");                                                                                    // 3193
        },                                                                                                             // 3194
        formatSelection: function (data, container, escapeMarkup) {                                                    // 3195
            return data ? escapeMarkup(data.text) : undefined;                                                         // 3196
        },                                                                                                             // 3197
        sortResults: function (results, container, query) {                                                            // 3198
            return results;                                                                                            // 3199
        },                                                                                                             // 3200
        formatResultCssClass: function(data) {return undefined;},                                                      // 3201
        formatSelectionCssClass: function(data, container) {return undefined;},                                        // 3202
        formatNoMatches: function () { return "No matches found"; },                                                   // 3203
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1? "" : "s"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1? "" : "s"); },
        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Loading more results..."; },                                   // 3207
        formatSearching: function () { return "Searching..."; },                                                       // 3208
        minimumResultsForSearch: 0,                                                                                    // 3209
        minimumInputLength: 0,                                                                                         // 3210
        maximumInputLength: null,                                                                                      // 3211
        maximumSelectionSize: 0,                                                                                       // 3212
        id: function (e) { return e.id; },                                                                             // 3213
        matcher: function(term, text) {                                                                                // 3214
            return stripDiacritics(''+text).toUpperCase().indexOf(stripDiacritics(''+term).toUpperCase()) >= 0;        // 3215
        },                                                                                                             // 3216
        separator: ",",                                                                                                // 3217
        tokenSeparators: [],                                                                                           // 3218
        tokenizer: defaultTokenizer,                                                                                   // 3219
        escapeMarkup: defaultEscapeMarkup,                                                                             // 3220
        blurOnChange: false,                                                                                           // 3221
        selectOnBlur: false,                                                                                           // 3222
        adaptContainerCssClass: function(c) { return c; },                                                             // 3223
        adaptDropdownCssClass: function(c) { return null; },                                                           // 3224
        nextSearchTerm: function(selectedObject, currentSearchTerm) { return undefined; }                              // 3225
    };                                                                                                                 // 3226
                                                                                                                       // 3227
    $.fn.select2.ajaxDefaults = {                                                                                      // 3228
        transport: $.ajax,                                                                                             // 3229
        params: {                                                                                                      // 3230
            type: "GET",                                                                                               // 3231
            cache: false,                                                                                              // 3232
            dataType: "json"                                                                                           // 3233
        }                                                                                                              // 3234
    };                                                                                                                 // 3235
                                                                                                                       // 3236
    // exports                                                                                                         // 3237
    window.Select2 = {                                                                                                 // 3238
        query: {                                                                                                       // 3239
            ajax: ajax,                                                                                                // 3240
            local: local,                                                                                              // 3241
            tags: tags                                                                                                 // 3242
        }, util: {                                                                                                     // 3243
            debounce: debounce,                                                                                        // 3244
            markMatch: markMatch,                                                                                      // 3245
            escapeMarkup: defaultEscapeMarkup,                                                                         // 3246
            stripDiacritics: stripDiacritics                                                                           // 3247
        }, "class": {                                                                                                  // 3248
            "abstract": AbstractSelect2,                                                                               // 3249
            "single": SingleSelect2,                                                                                   // 3250
            "multi": MultiSelect2                                                                                      // 3251
        }                                                                                                              // 3252
    };                                                                                                                 // 3253
                                                                                                                       // 3254
}(jQuery));                                                                                                            // 3255
                                                                                                                       // 3256


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['tarang:select2'] = {};

})();

//# sourceMappingURL=05c276e1a6052aff55df5ab1b2aadd12e369d1ed.map
