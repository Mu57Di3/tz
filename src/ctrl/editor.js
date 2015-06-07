/**
 * Контроллер редактор
 */
var editorView = Backbone.Marionette.ItemView.extend({
    template: 'templates/editor.twig',

    canvasContext:null,
    clickX:[],
    clickY:[],
    clickDrag:[],
    paint:false,
    appContext:null,
    edit_key:null,
    name:null,
    outlineImage:null,

    initialize:function (options){
        if (options.name){
            this.name = options.name;
        }

        if (options.edit_key){
            this.edit_key = options.edit_key;
        }
    },

    events:{
        'click button#bClear':  'clearHandler',
        'click button#bSave':   'saveHandler',
        'mousedown #dSpace':    'canvasMouseDownHandler',
        'mousemove #dSpace':    'canvasMouseMoveHandler',
        'mouseup #dSpace':      'offPaintHandler',
        'mouseleave #dSpace':   'offPaintHandler'
    },



    onRender: function() {
        var wrapper = this.$('div#cWrapper');
        var canvas = document.createElement('canvas');

        canvas.setAttribute('width', 600);
        canvas.setAttribute('height', 400);
        canvas.setAttribute('id', 'dSpace');
        wrapper.append(canvas);
        if(typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        this.canvasContext = canvas.getContext('2d');
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.canvasContext.fillStyle = "#ffffff";
        this.canvasContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        this.outlineImage = null;

        if (this.name != null){
            this.outlineImage = new Image();
            this.outlineImage.src = 'http://tz.mu57di3.org/img/full/'+this.name+'.jpg';
            this.canvasContext.drawImage(this.outlineImage, 0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        }

    },

    /**
     * Обработчик события очистки канвы
     */
    clearHandler: function(){
        console.log('чистка');
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.canvasContext.fillStyle = "#ffffff";
        this.canvasContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    },

    /**
     * Сохранение изображения
     */
    saveHandler:function (){

        var imageData = this.canvasContext.canvas.toDataURL('image/jpeg',1.0);
        var sendData = {
            'newimage':imageData
        };

        if (this.name != null && this.edit_key!=null){
            sendData['edit_key'] = this.edit_key;
            sendData['name'] =  this.name;
        }

        var that = this;
        $.ajax({
            url:'http://tz.mu57di3.org/imagehole',
            dataType:'json',
            type:'POST',
            data:sendData
        }).success(function(input){
            if (input.status == 'ok'){
                if (that.name === null && that.edit_key === null) {
                    app.ImagesCollection.addNewImage({
                        name: input.data.name,
                        ts: input.data.ts
                    });
                    var mes = that.$('#pEditKey');
                    mes.text('Коюч редактирования: '+input.data.edit_key);
                    mes.show();
                } else {
                    app.ImagesCollection.setImage({
                        name: input.data.name,
                        ts: input.data.ts
                    });
                }
            }
        }).error(function(data){
            console.log(data);
        });

    },

    /**
     * Нажатие кнопки на канве
     */
    canvasMouseDownHandler: function(e){
        this.paint = true;
        var p = this.canvasContext.canvas.getBoundingClientRect();
        this.addClick(e.clientX-p.left, e.clientY-p.top,false);
        this.redraw();
    },

    /**
     * Движение мышки
     * @param e
     */
    canvasMouseMoveHandler:function(e){
        if (this.paint){
            var p = this.canvasContext.canvas.getBoundingClientRect();
            this.addClick(e.clientX-p.left, e.clientY-p.top,true);
            this.redraw();
        }
    },

    /**
     * Остановка рисование при откускании кнопки мыши или покидании области отрисовки
     * @param e
     */
    offPaintHandler: function(e){
        this.paint = false;
    },

    addClick: function (x,y,dragging){
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    },

    redraw:function(){
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        this.canvasContext.strokeStyle = "#000000";
        this.canvasContext.lineJoin = "round";
        this.canvasContext.lineWidth = 5;
        this.canvasContext.fillStyle = "#ffffff";

        if (this.outlineImage != null) {
            this.canvasContext.drawImage(this.outlineImage, 0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        } else {
            this.canvasContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        }

        for(var i=0; i < this.clickX.length; i++) {
            this.canvasContext.beginPath();
            if(this.clickDrag[i] && i){
                this.canvasContext.moveTo(this.clickX[i-1], this.clickY[i-1]);
            }else{
                this.canvasContext.moveTo(this.clickX[i]-1, this.clickY[i]);
            }
            this.canvasContext.lineTo(this.clickX[i], this.clickY[i]);
            this.canvasContext.closePath();
            this.canvasContext.stroke();
        }
    }

});

module.exports =  editorView;