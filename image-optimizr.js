//Image Optimizr Javascript
// Author: Bren Murrell

var isSlow, 
    lazyBG, 
    slowTimer, 
    imageSuffixJPG, 
    imageSuffixPNG, 
    bgLoaderImages,
    thisImgSrc = [], 
    waypointBG = [],
    bgLoaderImages, 
    optimizrVars = [], 
    optimzrMaxTime = 4000,
    useOptimizr = 0,
    optimizrDebug = 0; 

function initOptimizr() {
    //slow connection tweaks
    isSlow = false;
    lazyBG = document.querySelectorAll('[data-lazyLoadBG]');
    optimizrVars = document.querySelectorAll('[data-io-use]'); //ability to turn these on or off
    if(optimizrVars.length) {
        //get vars from markup
        imageSuffixJPG = '?quality=' + optimizrVars[0].getAttribute('data-io-quality');
        imageSuffixPNG = "?width=400";
        optimzrMaxTime = optimizrVars[0].getAttribute('data-io-maxtime');
        useOptimizr = parseInt(optimizrVars[0].getAttribute('data-io-use'));
        optimizrDebug = parseInt(optimizrVars[0].getAttribute('data-io-debug'));        
    }

    bgLoaderImages = document.querySelectorAll('.bgloader__image');

    if(bgLoaderImages.length) {
        for ( var i = 0; i < bgLoaderImages.length; i ++) {
            bgLoaderImages[i].addEventListener("load", fadeInImage.bind(null, i));
        }
    }
    slowTimer = setTimeout(function() { 
        body.classList.add('bodyMod--slowSite');
        isSlow = true;        
    }, optimzrMaxTime);
}
function fadeInImage(i) {
    bgLoaderImages[i].parentNode.classList.add('bgloader--loaded');
}
function getSuffix(filename) {
    if(isSlow && useOptimizr) {
        var thisImgSuffix = filename.slice(-3);
        var thisSuffix = thisImgSuffix.toLowerCase() === 'jpg' ? imageSuffixJPG : imageSuffixPNG;        
        return thisSuffix;
    }
    return "";
}

document.addEventListener("DOMContentLoaded", function() {
    initOptimizr();
});

window.addEventListener('load', function() {
    clearInterval(slowTimer);
    if(optimizrDebug) {
        console.log("Optimizr says: This page took " + slowTimer + "s to load. Timer was set to " + optimzrMaxTime +". Was page slow? " + isSlow);
    }
    for(n = 0; n < lazyBG.length; n++) {
        thisImgSrc = lazyBG[n].getAttribute('data-lazyLoadBG');
        lazyBG[n].setAttribute('data-suffix', getSuffix(thisImgSrc) );
        if(typeof(Waypoint) != "undefined") {
            waypointBG[n] = new Waypoint({
                element: lazyBG[n],
                handler: function(direction) {
                    this.element.getElementsByClassName('bgloader__image')[0].src = this.element.getAttribute('data-lazyLoadBG') +  this.element.getAttribute('data-suffix');
                    this.element.style.backgroundImage = 'url(' + this.element.getAttribute('data-lazyLoadBG') + this.element.getAttribute('data-suffix') + ')';
                },
                offset: '100%'
            });
        } else {
            console.warn('Waypoints not loaded - images can\'t be lazy loaded. Consider adding the Waypoints plugin for further performance gains.');
            lazyBG[n].getElementsByClassName('bgloader__image')[0].src = thisImgSrc + lazyBG[n].getAttribute('data-suffix');
            lazyBG[n].style.backgroundImage = 'url(' + thisImgSrc  + lazyBG[n].getAttribute('data-suffix') + ')';
        }
    }
});

