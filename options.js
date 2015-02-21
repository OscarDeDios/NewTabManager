$(document).ready(function(){
    muestraAyuda();
    muestraExtensiones();
});

function muestraAyuda()
{
    $('.titulo').html(chrome.i18n.getMessage("titulo"));
    $('.botonayuda').html(chrome.i18n.getMessage("botonAyuda"));
    $('#ayudaElegida').html(chrome.i18n.getMessage("ayudaElegida"));
    $('#ayudaActiva').html(chrome.i18n.getMessage("ayudaActiva"));
    $('#ayudaInstalada').html(chrome.i18n.getMessage("ayudaInstalada"));
    $('.contacta').html(chrome.i18n.getMessage("contacta"));
    $('#mensAyuda').html(chrome.i18n.getMessage("mensAyuda"));
    $('.botonayuda').on('click',function(){
        $('html, body').animate({scrollTop: $("#mensAyuda").offset().top}, 500);
    });
    $('.imgUp').on('click',function(){
        $('html, body').animate({scrollTop: 0}, 500);
    });
}


function muestraExtensiones()
{
    var html = '';
    var long = newTabExtensiones.length;
    
    /* Original */
    html += '<div class="extRow extInst" id="originalTab">';
    html += '<div class="extInfo"><img src="img/Google-Chrome-icon19.png" /><span>Original Chrome</span></div>';
    html += '<div class="extLink"><img class="extImg" src="img/originalTab.png"></div>';
    html += '<div class="pruebaExt" title="' + chrome.i18n.getMessage("prueba") + '"><img src="img/open.png"></div>';
    html += '</div>'
    
    
    for (var i=0;i<long;i++)
    {
        html += '<div class="extRow extNoInst" id="' + newTabExtensiones[i].extId + '" data-url="' + newTabExtensiones[i].extUrl + '">';
        html += '<div class="extInfo"><img class="extIcon" src="' + newTabExtensiones[i].extIcon + '" /><span>' + newTabExtensiones[i].extNombre + '</span></div>';
        html += '<div class="extLink"><img class="extImg" src="' + newTabExtensiones[i].extImg + '"></a></div>';
        html += '</div>'
        
    }
    $('.listaExt').html(html);
    marcaExtensionesInstaladas();
}


function cambiaExtElegida()
{
    var extId = $(this).attr('id');
    if (localStorage['extElegida'] != undefined)
    {
        $('#'+localStorage['extElegida']).removeClass('extElegida').addClass('extInst');
        $('#'+localStorage['extElegida']).find('.extInfo').after('<div class="botonActivar">' + chrome.i18n.getMessage("activar") + '</div>');
    }
    else
    {
        $('#originalTab').removeClass('extElegida').removeClass("extInst");
    }
    $(this).addClass('extElegida').removeClass('extInst').removeClass("extDisabled").removeClass("extEnabled");
    localStorage['extElegida'] = extId;
    chrome.management.setEnabled(extId, false);
    $(this).find(".botonDesactivar").remove();
    $(this).find(".botonActivar").remove();
    var img = document.getElementsByTagName('img')[2];
}

function instalaExt()
{
    chrome.tabs.create({url:$(this).data('url')}, function(){});
    chrome.management.onInstalled.addListener(function(extinfo){
        if (esExtensionNewtab(extinfo.id))
        {
            chrome.management.setEnabled(extinfo.id, false);
            $('#'+extinfo.id).addClass("extInst").removeClass("extNoInst").addClass("extDisabled");
            $('#'+extinfo.id).find(".botonInstala").text(chrome.i18n.getMessage("desinstalar")).removeClass("botonInstala").addClass("botonDesinstala"); 
            $('#'+extinfo.id).find('.extInfo').after('<div class="botonActivar">' + chrome.i18n.getMessage("activar") + '</div>');
            $('#'+extinfo.id).append('<div class="pruebaExt" title="' + chrome.i18n.getMessage("prueba") + '"><img src="img/open.png"></div>');
        }
    });
}


$(document).on('click','.extInst',cambiaExtElegida);
$(document).on('click','.extNoInst',instalaExt);


$(document).on('click','.botonActivar',function(evt){
    var extId = $(this).closest('.extRow').attr('id');
    $(this).text(chrome.i18n.getMessage("desactivar")).addClass("botonDesactivar").removeClass("botonActivar");
    chrome.management.setEnabled(extId, true);
    $('#'+extId).removeClass("extDisabled").addClass("extEnabled");
    evt.stopPropagation();
});
$(document).on('click','.botonDesactivar',function(evt){
    var extId = $(this).closest('.extRow').attr('id');
    $('#'+extId).addClass("extDisabled").removeClass("extEnabled");
    $(this).text(chrome.i18n.getMessage("activar")).addClass("botonActivar").removeClass("botonDesactivar");
    chrome.management.setEnabled(extId, false);
    evt.stopPropagation();
});
$(document).on('click','.extIcon',function(evt){
    chrome.tabs.create({url:$(this).closest('.extRow').data('url')}, function(){});
    evt.stopPropagation();
});

$(document).on('click','.botonDesinstala',function(evt){
    var extId = $(this).closest('.extRow').attr('id');
    chrome.management.uninstall(extId, {showConfirmDialog:true}, function(){
        $('#'+extId).removeClass("extDisabled").removeClass("extEnabled")
        .removeClass("extInst").addClass("extNoInst").removeClass("extElegida");
        $('#'+extId).find(".botonActivar").remove();
        $('#'+extId).find(".botonDesactivar").remove();
        $('#'+extId).find(".pruebaExt").remove();
        $('#'+extId).find(".botonDesinstala").text(chrome.i18n.getMessage("instalar")).addClass("botonInstala").removeClass("botonDesinstala"); 
        if (extId == localStorage['extElegida'])
        {   
            localStorage.removeItem("extElegida");
            $('#originalTab').addClass("extElegida").removeClass("extInst");
        }
    });
    evt.stopPropagation();
});

$(document).on('click','.pruebaExt',function(evt){
    var extId = $(this).closest('.extRow').attr('id');
    abreExtension(extId);
    evt.stopPropagation();
});
