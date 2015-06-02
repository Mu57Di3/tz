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

    initialize:function (){
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
    },

    /**
     * Обработчик события очистки канвы
     */
    clearHandler: function(){
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
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
        console.log(x,y);
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    },

    redraw:function(){
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        this.canvasContext.strokeStyle = "#000000";
        this.canvasContext.lineJoin = "round";
        this.canvasContext.lineWidth = 5;

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
    }/*,

    getPosition: function (e){
        var canvas = this.canvasContext.canvas;

        var curleft = 0, curtop = 0;
        if (canvas.offsetParent) {
            do {
                curleft += parseInt(canvas.offsetLeft);
                curtop += parseInt(canvas.offsetTop);
            } while (canvas = canvas.offsetParent);
            return { x: e.pageX-curleft, y: e.pageY-curtop };
        }
        return undefined;

    }*/

});

module.exports =  new editorView();