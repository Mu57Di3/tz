/**
 * Контроллер скиска файлов
 * Created by Bender on 04.06.2015.
 */

var ImageItemView = Marionette.ItemView.extend({
    tagName:'tr',
    template:'templates/image.twig',

    events:{
        'click #bDelete':'removeImage',
        'click #bEdit':'editImage'
    },

    onBeforeRender: function (){
        this.templateHelpers = {};
        this.templateHelpers = this.model.attributes;
    },

    removeImage:function(){
        var id = this.model.get('name');
        var edit_key = prompt("Введите ключ редактирования данного изображения");

        if (edit_key != null && edit_key.length>0) {
            var sendData = {
                name:id,
                edit_key:edit_key
            };

            $.ajax({
                url:'http://tz.mu57di3.org/delImage',
                dataType:'json',
                type:'GET',
                data:sendData
            }).success(function(input){
                if (input.status == 'ok'){
                    app.ImagesCollection.delImage(id);
                } else {
                    alert('Неправильный ключ редактирования');
                }
            }).error(function(data){
                console.log(data);
            });
        }
    },

    editImage:function(){
        var id = this.model.get('name');
        var edit_key = prompt("Введите ключ редактирования данного изображения");

        if (edit_key != null && edit_key.length>0) {
            var sendData = {
                name:id,
                edit_key:edit_key
            };

            $.ajax({
                url:'http://tz.mu57di3.org/checkkey',
                dataType:'json',
                type:'GET',
                data:sendData
            }).success(function(input){
                if (input.status == 'ok'){
                    var Modal = require('./popup'),
                        editor = require('./editor');
                    app.MainView.getRegion('modal').show(new Modal({
                        v:new editor({
                            name:id,
                            edit_key:edit_key
                        }),
                        tpl:{
                            title:'Редактирование изображения '+id,
                            button:''
                        },
                        success:false
                    }));
                } else {
                    alert('Неправильный ключ редактирования');
                }
            }).error(function(data){
                console.log(data);
            });
        }
    }


});

var ImageList  = Marionette.CollectionView.extend({
    tagName:'table',
    childView: ImageItemView,
    className:'table table-striped',

    onShow: function(){
        console.log('Imagelist show');
    }
});


module.exports =  ImageList;