/**
 * Created by Chris on 4/4/2018.
 */

App.screens['high-scores'] = (function(manager){
    let init = function(){
        document.getElementById('hs-back').addEventListener('click', function () {
            manager.showScreen('main-menu');
        });
    };

    return {
        init: init
    }

}(App.management));