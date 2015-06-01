/**
 * Created by Mu57Di3 on 01.06.2015.
 */

var jQuery = require('jquery');
var _   = require('underscore');
var Backbone = require('backbone');
Backbone.$ = jQuery;
var Marionette = require('backbone.marionette');


var MyApp = Marionette.Application.extend({
    initialize:function (){
        console.log('1111');
    }
});

var app = new MyApp({container: '#app'});
