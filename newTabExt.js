function esExtensionNewtab(id)
{
    var long = newTabExtensiones.length;
    for (var i=0;i<long;i++)
    {
        if (newTabExtensiones[i].extId === id) return true
    }
    return false;
}

function marcaExtensionesInstaladas()
{
    chrome.management.getAll(function(result){
        
        var htmlActiva = '<div class="botonActivar">' + chrome.i18n.getMessage("activar") + '</div>';
        var htmldesActiva = '<div class="botonDesactivar">' + chrome.i18n.getMessage("desactivar") + '</div>';
        var htmlInstala = '<div class="botonInstala">' + chrome.i18n.getMessage("instalar") + '</div>';
        var htmlDesinstala = '<div class="botonDesinstala">' + chrome.i18n.getMessage("desinstalar") + '</div>';
        var htmlPrueba = '<div class="pruebaExt" title="' + chrome.i18n.getMessage("prueba") + '"><img src="img/open.png"></div>';
        
        for (var i=0;i<result.length;i++)
        {
            $('#'+result[i].id).removeClass("extNoInst").addClass("extInst");
            $('#'+result[i].id).append(htmlPrueba);
            if (result[i].enabled)
            {
                $('#'+result[i].id).addClass("extEnabled");
                $('#'+result[i].id).find('.extInfo').after(htmldesActiva);
            }
            else
            {
                $('#'+result[i].id).addClass("extDisabled");
                if (result[i].id != localStorage['extElegida']) $('#'+result[i].id).find('.extInfo').after(htmlActiva);
            } 
        }
        $('.extNoInst').append(htmlInstala);
        $('.extInst').not('#originalTab').append(htmlDesinstala);
        
        if (localStorage['extElegida'] != undefined)
            $('#'+localStorage['extElegida']).addClass('extElegida').removeClass("extInst").removeClass("extDisabled");
        else
            $('#originalTab').addClass('extElegida').removeClass("extNoInst").removeClass("extInst");
        
        // ponemos al principio las extensiones instaladas y la elegida
        $('.extInst').detach().prependTo('.listaExt');
        $('.extElegida').detach().prependTo('.listaExt');
        
    });
}



function abreExtension(extId)
{
    var extensionesApagadas = new Array();
    var extEnabled = false;
    
    chrome.management.getAll(function(result){
        for (var i=0;i<result.length;i++)
        {
            if (esExtensionNewtab(result[i].id))
            {
                if (result[i].enabled && result[i].id != extId)
                {
                    chrome.management.setEnabled(result[i].id, false);
                    extensionesApagadas.push(result[i].id);   
                }
                else if (result[i].id == extId)
                {
                    if (result[i].enabled) extEnabled = true;
                    chrome.management.setEnabled(result[i].id, true);
                }
            }
        }
        chrome.tabs.create({'url': 'chrome://newtab/'}, function(tab) {
            for (var i=0;i<extensionesApagadas.length;i++)
            {
                chrome.management.setEnabled(extensionesApagadas[i], true);
            }
            extensionesApagadas = [];
            guardaTab(tab.id,extId,extEnabled)
        });  
    });    
    if (extId != localStorage["extElegida"])
    {
        localStorage["extPrueba"] = extId;
    }
}

function guardaTab(tabId,extId,extEnabled)
{
    var tabsNewTab = new Array();
    if (localStorage["tabsNewTab"]) 
        var tabsNewTab = JSON.parse(localStorage["tabsNewTab"]);

    tabsNewTab.push({tabId: tabId, extId: extId, extEnabled: extEnabled});
    localStorage["tabsNewTab"] = JSON.stringify(tabsNewTab);
}

function esTabNewTab(tabId)
{
    var obj = {};
    if (localStorage["tabsNewTab"]) 
    {
        var tabsNewTab = JSON.parse(localStorage["tabsNewTab"]);
        for (i=0;i<tabsNewTab.length;i++)
        {
            if (tabsNewTab[i].tabId  == tabId) 
                return {extId: tabsNewTab[i].extId, extEnabled: tabsNewTab[i].extEnabled};
        }
        return '';
    }
    else return '';
}

function quitaTab(tabId)
{
    if (localStorage["tabsNewTab"]) 
        var tabsNewTab = JSON.parse(localStorage["tabsNewTab"]);
    else return;

    var i=0;
    while (i< tabsNewTab.length && tabsNewTab[i].tabId != tabId)
    {
        i++;
    }     
    if (i < tabsNewTab.length) 
    {
        tabsNewTab.splice(i,1);
    }
    localStorage["tabsNewTab"] = JSON.stringify(tabsNewTab);   
}