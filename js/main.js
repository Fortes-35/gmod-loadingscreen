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
    if(Config.enableMap) $("#map").html("Карта: " + mapname).animate({opacity:1},500);
    if(Config.enableOnline) $("#online").html("Онлайн: " + playersOnline).animate({opacity:1},500);
}

function SetFilesTotal(total){
    totalCalled = true;
    totalFiles = total;
}

function SetFilesNeeded(needed){
    if(totalCalled){
        percentage = 100 - Math.round((needed/totalFiles)*100);

        // Сдвигаем прямоугольник влево
        const rect = $(".loading-rect");
        const offset = (percentage/100) * ($(window).width()/2 + rect.width()/2);
        rect.css("left", `calc(50% - ${offset}px)`);
    }
}

function DownloadingFile(filename){
    filename = filename.replace("'", "").replace("?","");
    $("#currentFile").text("Загрузка: " + filename); // Только текущий файл
}

function loadAll(){
    $("nav, main").fadeIn();
    setTimeout(()=>{
        if(downloadingFileCalled) announce("Вы впервые подключаетесь к этому серверу! - Пожалуйста, дождитесь загрузки файлов...", true);
    },10000);
}

function loadBackground(){
    if(Config.backgroundImages && Config.backgroundImages.length>0){
        $(".background").css("background-image",'url("images/'+Config.backgroundImages[0]+'")');
    }
}

var permanent = false;
function announce(message, ispermanent){
    if(Config.enableAnnouncements && !permanent){
        $("#announcement").hide().html(message).fadeIn();
    }
    if(ispermanent) permanent=true;
}

$(document).ready(function(){
    loadBackground();

    // Спиннер
    var spinner = $(".spinner");
    if(spinner.length){
        spinner.attr("src","images/"+Config.spinnerImage)
               .css({width:Config.spinnerSize+"px",height:Config.spinnerSize+"px"});
    }

    // Объявления
    if(Config.announceMessages && Config.enableAnnouncements &&
