/**
 * Created by Chris on 3/26/2018.
 */

App.screens['main-menu'] = (function(manager){
    return {
        init: function () {
            document.getElementById('btn-new-game').addEventListener('click', function () {
                manager.showScreen('game');
            });

            document.getElementById('btn-high-scores').addEventListener('click', function () {
                manager.showScreen('high-scores');
            });

            document.getElementById('btn-about').addEventListener('click', function () {
                manager.showScreen('about');
            });
        }
    }
}(App.management));