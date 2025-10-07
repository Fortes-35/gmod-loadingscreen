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
}

function SetFilesNeeded(needed){
    if(totalCalled){
        percentage = 100 - Math.round((needed/totalFiles)*100);
        setLoad(percentage);
    }
}

// только реальные загружаемые файлы
function DownloadingFile(filename){
    if(!filename.toLowerCase().includes("file")) return; // пропускаем тестовые
    $("#history").prepend('<div class="history-item">'+filename+'</div>');
}

function SetStatusChanged(status){
    if(status==="Workshop Complete"){ setLoad(100); }
    else if(status==="Client info sent!") { setLoad(100); }
    else if(status==="Starting Lua...") { setLoad(100); }
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
    // Двигаем прямоугольник от центра вправо
    $(".overhaul").css("left", 50 + p/2 + "%"); // 50% старт, p% смещение вправо
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

    // спиннер
    $(".spinner").attr("src","images/"+Config.spinnerImage)
                 .css({width:Config.spinnerSize+"px", height:Config.spinnerSize+"px"});

    // объявления
    if(Config.announceMessages && Config.enableAnnouncements && Config.announcementLength){
        var i=0;
        setInterval(()=>{ 
            announce(Config.announceMessages[i]); 
            i++; 
            if(i>Config.announceMessages.length-1)i=0; 
        }, Config.announcementLength);
    }

    // смена фоновых изображений каждые 15 секунд
    if(Config.backgroundImages && Config.backgroundImages.length>0){
        let bgIndex = 0;
        setInterval(()=>{
            bgIndex = (bgIndex+1) % Config.backgroundImages.length;
            $(".background").fadeOut(1000, function(){
                $(this).css("background-image",'url("images/'+Config.backgroundImages[bgIndex]+'")').fadeIn(1000);
            });
        }, 15000);
    }

    // тестовый режим
    setTimeout(()=>{
        if(!isGmod){
            isTest=true;
            loadAll();
            GameDetails("Название сервера","URL сервера","Карта1","Макс. игроков","SteamID","Gamemode","5");
            var totalTestFiles=100;
            SetFilesTotal(totalTestFiles);
            var needed=totalTestFiles;
            setInterval(()=>{
                if(needed>0){
                    needed--;
                    SetFilesNeeded(needed);
                    DownloadingFile("Файл "+needed);
                }
            },500);
        }
    },1000);
});
