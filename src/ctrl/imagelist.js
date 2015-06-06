/**
 * Created by Bender on 04.06.2015.
 */

var ImageItemView = Marionette.ItemView.extend({
    tagName:'tr',
    template:'templates/image.twig',

    events:{

    },

    initialize:function (){

    },

    onBeforeRender: function (){
        this.templateHelpers = {};
        this.templateHelpers = this.model.attributes;
    }


});

var ImageList  = Marionette.CollectionView.extend({
    tagName:'table',
    childView: ImageItemView,
    className:'table table-striped table-bordered',

    onShow: function(){
        console.log('Imagelist show');
    }
});


module.exports =  ImageList;