/**
 * Класс колекция список файлов
 * Created by Bender on 06.06.2015.
 */
var ImageItem = Backbone.Model.extend({
    defaults:{
        name:'',
        ts:0
    },

    idAttribute: "name"
});

var ImagesCollection = Backbone.Collection.extend({
    model:ImageItem,

    fetch:function(){
        var that = this;
        $.ajax({
            url:'http://tz.mu57di3.org/getImageList',
            dataType:'json',
            type:'GET'
        }).success(function(input){
            if (input.status == 'ok' && input.data.length>0){
                for (var i= 0,cnt=input.data.length ; i < cnt; i++){
                    that.add( new ImageItem(input.data[i]) );
                }
            }
        }).error(function(data){
            console.log(data);
        });
    },

    addNewImage:function(data){
        console.log('addImage');
        this.add(new ImageItem(data));
    },

    delImage:function(id){
        this.remove(this.get(id));
    },

    setImage:function(data){
        var model = this.get(data.name);
        model.set(data);
        this.set(model,{remove: false});
    }
});

module.exports = new ImagesCollection();