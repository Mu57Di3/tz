/**
 * Created by Bender on 04.06.2015.
 */

var imageItem = Marionette.ItemView.extend({

});

var imagelist  = Marionette.CollectionView.extend({
    childView: imageItem
});


module.exports =  imagelist;