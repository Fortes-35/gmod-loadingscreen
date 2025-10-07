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
    // Показываем только, когда реально грузится
    if(filename && filename.length>0){
        downloadingFileCalled = true;
        $("#history").prepend('<div class="history-item">'+filename+'</div>');
        $(".history-item").each((i,el)=>{
            if(i>10) $(el).remove();
            $(el).css("opacity",""+(1-i*0.1));
        });
    }
}

function SetStatusChanged(status){
    $("#history").prepend('<div class="history-item">'+status+'</div>');
    $(".history-item").each((i,el)=>{
        if(i>10) $(el).remove();
        $(el).css("opacity",""+(1-i*0.1));
    });

    if(status==="Workshop завершена"){ setLoad(100); }
    else if(status==="Информация о клиенте отправлена!") { setLoad(100); }
    else if(status==="Запуск Lua...") { setLoad(100); }
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

function setLoad(p){
    // Прямоугольник двигается только вправо
    $(".overhaul").css("left", Math.max(0,p)+"%");
}

var permanent = false;
function announce(message, ispermanent){
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

$(document).ready(function(){
    loadBackground();

    // Спиннер
    var spinner = $(".spinner");
    if(spinner.length){
        spinner.attr("src","images/"+Config.spinnerImage)
               .css({width:Config.spinnerSize+"px",height:Config.spinnerSize+"px"});
    }

    // Объявления
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

    // Тестовый режим
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
