/**
 * Created by Mu57Di3 on 01.06.2015.
 */

var MyApp = Marionette.Application.extend({
    el:'body',

    initialize:function (){

    },


    events:{
        'click button#bNew':'newImageHandler'
    }

});

var AppLayoutView = Backbone.Marionette.LayoutView.extend({
    template: 'templates/main.twig',

    regions:{
        main : '#app',
        modal: '#modal'
    },

    events:{
        'click button#bNew':'newImageHandler'
    },

    onShow: function() {

    },

    newImageHandler:function(){
        console.log('new');
        var Modal = require('./ctrl/popup'),
        editor = require('./ctrl/editor');
        this.getRegion('modal').show(new Modal({
            v:new editor(),
            tpl:{
                title:'Новое изображение',
                button:''
            },
            success:false
        }));
    }

});

var app = new MyApp();
app.addRegions({
    app: ".container"
});
app.on('start',function(){
    this.getRegion('app').show(new AppLayoutView());
});
app.start();





