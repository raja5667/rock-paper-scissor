const playBackgroundMusic = document.getElementById('BackgroundMusic');
playBackgroundMusic.volume = 0.3;

 // Hide loader when the page has fully loaded
 window.onload = function () {
    document.querySelector('.loading').style.display = 'none';
};