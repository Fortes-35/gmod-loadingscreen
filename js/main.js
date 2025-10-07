"use strict";

var isGmod = false;
var percentage = 0;
var totalFiles = 50;
var totalCalled = false;
var downloadingFileCalled = false;
var allow_increment = true;

function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode, playersOnline) {
    isGmod = true;
    $("nav, main").fadeIn();

    $("#title").html(Config.title || servername).animate({opacity:1},500);
    if(Config.enableMap) $("#map").html("Карта: " + mapname).animate({opacity:1},500);
    if(Config.enableOnline) $("#online").html("Онлайн: " + playersOnline).animate({opacity:1},500);

    // Скрываем изначальный текст "Загрузка..."
    $("#loading-text").fadeOut(500);
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

function DownloadingFile(filename){
    filename = filename.replace("'", "").replace("?","");
    downloadingFileCalled = true;
    $("#history").prepend('<div class="history-item">'+filename+'</div>');
    $(".history-item").each((i,el)=>{
        if(i>10) $(el).remove();
        $(el).css("opacity",""+(1-i*0.1));
    });
}

function SetStatusChanged(status){
    $("#history").prepend('<div class="history-item">'+status+'</div>');
    $(".history-item").each((i,el)=>{
        if(i>10) $(el).remove();
        $(el).css("opacity",""+(1-i*0.1));
    });

    if(status==="Workshop Complete"){ allow_increment=false; setLoad(80); }
    else if(status==="Client info sent!"){ allow_increment=false; setLoad(95); }
    else if(status==="Starting Lua..."){ setLoad(100); }
    else { if(allow_increment){ percentage += 0.1; setLoad(percentage); } }
}

// Двигаем overlay вправо и уменьшаем opacity
function setLoad(p){
    $(".overhaul").css({
        transform: "translateX("+p+"%)",
        opacity: 1 - p/100
    });
}

$(document).ready(function(){
    // Спиннер
    var spinner = $(".spinner");
    if(spinner.length){
        spinner.attr("src","images/"+Config.spinnerImage)
               .css({width:Config.spinnerSize+"px",height:Config.spinnerSize+"px"});
    }

    // Объявления
    if(Config.announceMessages && Config.enableAnnouncements && Config.announcementLength){
        let i=0;
        setInterval(()=>{
            $("#announcement").hide().html(Config.announceMessages[i]).fadeIn();
            i++; if(i>=Config.announceMessages.length) i=0;
        }, Config.announcementLength);
    }

    // Тестовый режим
    setTimeout(()=>{
        if(!isGmod){
            GameDetails("Server Name","URL","Map","Max","SteamID","Gamemode","5");
            SetFilesTotal(20);
            let needed=20;
            let interval = setInterval(()=>{
                if(needed>0){
                    needed--;
                    SetFilesNeeded(needed);
                    DownloadingFile("Файл "+needed);
                } else clearInterval(interval);
            },500);
            SetStatusChanged("Загрузка...");
        }
    },1000);
});
