/**
 * Created by Bender on 06.06.2015.
 */

var ImageItem = Backbone.Model.extend({
    defaults:{
        name:'',
        ts:0
    }
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

    save : function (){

    },

    addImage:function(data){
        console.log(this);
        this.add(new ImageItem(data));
    }
});

module.exports = new ImagesCollection();