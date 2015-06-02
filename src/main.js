/**
 * Created by Mu57Di3 on 01.06.2015.
 */

var MyApp = Marionette.Application.extend({
    initialize:function (){

    },

    events:{
        'start':'startHandler'
    },

    startHandler: function(){

    }

});

var app = new MyApp();
app.addRegions({
    main: "#app"
});
app.on('start',function(){
    var vEditor = require('./ctrl/editor');
    this.getRegion('main').show(vEditor);
});
app.start();





