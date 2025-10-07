"use strict";

var totalFiles = 0;
var percentage = 0;
var lastPercentage = 0;

function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode, playersOnline) {
    $("nav, main").fadeIn();

    $("#title").html(Config.title || servername).animate({opacity:1},500);
    if(Config.enableMap) $("#map").html("Карта: " + mapname).animate({opacity:1},500);
    if(Config.enableOnline) $("#online").html("Онлайн: " + playersOnline).animate({opacity:1},500);
}

function SetFilesTotal(total) {
    totalFiles = total;
}

function SetFilesNeeded(needed) {
    if(totalFiles === 0) return;
    percentage = 100 - Math.round((needed / totalFiles) * 100);
    setLoad(percentage);
}

function SetStatusChanged(status) {
    // Отображаем только реальные статусы (без списка файлов)
    if(status && status.length > 0) {
        $("#history").prepend('<div class="history-item">'+status+'</div>');
        $(".history-item").each(function(i, el){
            if(i>10) $(el).remove();
            $(el).css("opacity", "" + (1 - i*0.1));
        });
    }
}

function setLoad(p) {
    if(p < lastPercentage) return; // запрещаем "откат"
    lastPercentage = p;
    $(".overhaul").css("transform", "translateX(" + p + "%)");
}

// Объявления
var permanent = false;
function announce(message, ispermanent) {
    if(Config.enableAnnouncements && !permanent) {
        $("#announcement").hide().html(message).fadeIn();
    }
    if(ispermanent) permanent=true;
}

// Фоновая смена каждые 30 секунд
$(document).ready(function() {
    if(Config.backgroundImages && Config.backgroundImages.length>0){
        let bgIndex = 0;
        setInterval(()=>{
            bgIndex = (bgIndex+1) % Config.backgroundImages.length;
            $(".background").fadeOut(2000, function(){
                $(this).css("background-image",'url("images/'+Config.backgroundImages[bgIndex]+'")').fadeIn(2000);
            });
        }, 30000);
    }
});
