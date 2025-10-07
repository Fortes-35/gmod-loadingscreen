"use strict";

var isGmod = false;
var isTest = false;
var totalFiles = 50;
var totalCalled = false;
var downloadingFileCalled = false;
var percentage = 0;

// ===================== GMod функции =====================
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

// ===================== Загрузка файлов =====================
function SetFilesTotal(total){
    totalCalled=true; 
    totalFiles=total; 
    debug("Всего файлов: "+total);
}

function SetFilesNeeded(needed){
    if(totalCalled){ 
        percentage = 100 - Math.round((needed/totalFiles)*100); 
        setLoad(percentage);
    } 
}

function DownloadingFile(filename){
    filename = filename.replace("'", "").replace("?","");
    downloadingFileCalled=true;
    $("#history").prepend('<div class="history-item">'+filename+'</div>');
    $(".history-item").each((i,el)=>{
        if(i>10) $(el).remove(); 
        $(el).css("opacity",""+(1-i*0.1));
    });
}

var allow_increment=true;
function SetStatusChanged(status){
    if(status==="Workshop завершена"){ 
        allow_increment=false; 
        setLoad(80); 
        $("#history").prepend('<div class="history-item">Загрузка Workshop завершена</div>'); 
    }
    else if(status==="Информация о клиенте отправлена!") { 
        allow_increment=false; 
        setLoad(95); 
        $("#history").prepend('<div class="history-item">Информация клиента отправлена</div>'); 
    }
    else if(status==="Запуск Lua...") { 
        setLoad(100); 
        $("#history").prepend('<div class="history-item">Запуск Lua...</div>'); 
    }
    else { 
        $("#history").prepend('<div class="history-item">'+status+'</div>'); 
        if(allow_increment){percentage+=0.1; setLoad(percentage);} 
    }
    $(".history-item").each((i,el)=>{if(i>10) $(el).remove(); $(el).css("opacity",""+(1-i*0.1));});
}

// ===================== Внешние функции =====================
function loadAll(){ 
    $("nav, main").fadeIn(); 
    setTimeout(()=>{ 
        if(downloadingFileCalled) announce("Вы впервые подключаетесь к этому серверу! - Пожалуйста, дождитесь загрузки файлов...",true); 
    },10000); 
}

function loadBackground(){ 
    if(Config.backgroundImages && Config.backgroundImages.length>0){ 
        $(".background").css("background-image",'url("images/'+Config.backgroundImages[0]+'")'); 
    } 
}

function setLoad(percentage){ 
    $(".overhaul").css("left",percentage+"%"); 
}

var permanent=false;
function announce(message,ispermanent){ 
    if(Config.enableAnnouncements && !permanent){ 
        $("#announcement").hide().html(message).fadeIn(); 
    } 
    if(ispermanent) permanent=true; 
}

function debug(message){ 
    if(Config.enableDebug){ 
        console.log(message); 
        $("#debug").prepend(message+"<br>"); 
    } 
}

// ===================== Инициализация =====================
$(document).ready(function(){

    loadBackground();

    // === Спиннер ===
    var spinner=$(".spinner");
    if(spinner.length){ 
        spinner.attr("src","images/"+Config.spinnerImage).css({width:Config.spinnerSize+"px",height:Config.spinnerSize+"px",animationDuration:Config.spinnerSpeed+"s"}); 
    }

    // === Объявления ===
    if(Config.announceMessages && Config.enableAnnouncements && Config.announcementLength){
        if(Config.announceMessages.length>0){
            var i=0;
            setInterval(()=>{ 
                announce(Config.announceMessages[i]); 
                i++; 
                if(i>Config.announceMessages.length-1)i=0; 
            }, Config.announcementLength);
        }
    }

    // === Тестирование режима если не GMod ===
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
            SetStatusChanged("Тестирование..");
        }
    },1000);
});
