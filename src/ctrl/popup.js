/**
 * Контроллер попапа
 */

var Modal = Backbone.Marionette.LayoutView.extend({
    template: "templates/popup.twig",

    templateHelpers:{},

    events:{
        "click #bSuccess": 'do_some'
    },

    regions:{
        content : '#ppContent'
    },

    initialize: function(options){
        console.log('modal init');
        if (options){
            if (options.success) {
                this.success_handler = options.success;
            }

            if (options.v){
                this.v = options.v;
            }

            if (options.tpl){
                this.templateHelpers = options.tpl;
            }
        }
    },

    onShow:function (){
        console.log('modal show');
        var that = this;
        if (this.v) {
            this.getRegion('content').show(this.v);
        }
        $('#myModal').modal('show');
        $('#myModal').on('hide.bs.modal', function (e) {
            that.remove();
        })
    },

    do_some: function (){
        if (this.success_handler){
            this.success_handler.call(this.v);
        }
    }
});

module.exports = Modal;