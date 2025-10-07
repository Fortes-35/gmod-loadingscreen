"use strict";

var isGmod = false;
var isTest = false;
var totalFiles = 50;
var totalCalled = false;
var downloadingFileCalled = false;
var percentage = 0;

function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode, playersOnline) {
    isGmod = true;
    if (!isTest) loadAll();

    $("#title").html(Config.title || servername).animate({opacity:1},500);

    if(Config.enableMap){
        $("#map").html("Карта: " + mapname).animate({opacity:1},500);
    }
    if(Config.enableOnline){
        $("#online").html("Онлайн: " + playersOnline).animate({opacity:1},500);
    }
}

function SetFilesTotal(total){
    totalCalled = true;
    totalFiles = total;
    debug("Всего файлов: "+total);
}

function SetFilesNeeded(needed){
    if(totalCalled){
        percentage = 100 - Math.round((needed/totalFiles)*100);
        setLoad(percentage);
    }
}

function DownloadingFile(filename){
    if(!filename) return; // Только реальные файлы
    downloadingFileCalled = true;
    $("#history").prepend('<div class="history-item">'+filename+'</div>');
    $("#status").text("Загрузка: " + filename).show();
}

function SetStatusChanged(status){
    debug(status);
    if(status==="Workshop Complete" || status==="Client info sent!" || status==="Starting Lua..."){
        $("#status").text("Загрузка завершена!");
        setLoad(100);
    }
}

function loadAll(){
    $("nav, main").fadeIn();
}

function loadBackground(){
    if(Config.backgroundImages && Config.backgroundImages.length>0){
        $(".background").css("background-image",'url("images/'+Config.backgroundImages[0]+'")');
    }
}

function setLoad(p){
    $(".overhaul").css("left", p+"%");
}

function debug(message){
    if(Config.enableDebug){
        console.log(message);
    }
}

$(document).ready(function(){
    loadBackground();

    // Спиннер
    var spinner = $(".spinner");
    if(spinner.length){
        spinner.attr("src","images/"+Config.spinnerImage)
               .css({width:Config.spinnerSize+"px",height:Config.spinnerSize+"px"});
    }

    // Смена фоновых изображений каждые 15 секунд
    if(Config.backgroundImages && Config.backgroundImages.length>0){
        let bgIndex = 0;
        setInterval(()=>{
            bgIndex = (bgIndex+1) % Config.backgroundImages.length;
            $(".background").fadeOut(1000, function(){
                $(this).css("background-image",'url("images/'+Config.backgroundImages[bgIndex]+'")').fadeIn(1000);
            });
        }, 15000);
    }
});
