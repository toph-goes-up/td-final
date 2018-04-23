/**
 * Created by Chris on 4/4/2018.
 */

App.screens['about'] = (function(manager){
    let init = function(){
        document.getElementById('about-back').addEventListener('click', function () {
            manager.showScreen('main-menu');
        });
    };

    return {
        init: init
    }

}(App.management));