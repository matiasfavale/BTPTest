sap.ui.define(["simplot/portalsprd/utils/FileDownHelp"],function(t){"use strict";return{convertHtmlToText:function(t){return t},getAutorDescription:function(t){if(!t){return""}return this.getResourceBundle().getText("claim.autor."+t)},formatStringDate:function(t,a){if(!t||t.length!==8||!a||a.length!==6){return""}const e=new Date(parseInt(t.substring(0,4),10),parseInt(t.substring(4,6),10)-1,parseInt(t.substring(6,8),10),parseInt(a.substring(0,2),10),parseInt(a.substring(2,4),10),parseInt(a.substring(4,6),10));return this.formatter.formatDate(e,"dd/MM/yyyy HH:mm:ss")},formatDate:function(t,a="dd/MM/yyyy"){var e=sap.ui.core.format.DateFormat.getDateInstance({pattern:a});return e.format(t)},getReasonDescription:function(t){if(!t){return""}let a=this.CommonClaims.getModelClaims();return a.getProperty(`/Reasons/Data/${t}/Texto`)},getPriorityDescription:function(t){let a="";switch(t){case"1":a=this.getResourceBundle().getText("claim.priority.low");break;case"2":a=this.getResourceBundle().getText("claim.priority.normal");break;case"3":a=this.getResourceBundle().getText("claim.priority.high");break}return a},getPriorityState:function(t){let a=sap.ui.core.ValueState.None;switch(t){case"1":a=sap.ui.core.ValueState.Success;break;case"2":a=sap.ui.core.ValueState.Warning;break;case"3":a=sap.ui.core.ValueState.Error;break}return a},getStatusDescription:function(t){let a="";switch(t){case"1":a=this.getResourceBundle().getText("claim.status.new");break;case"2":a=this.getResourceBundle().getText("claim.status.inProcess");break;case"3":a=this.getResourceBundle().getText("claim.status.closed");break}return a},getStatusState:function(t){let a=sap.ui.core.ValueState.None;switch(t){case"1":a=sap.ui.core.ValueState.Success;break;case"2":a=sap.ui.core.ValueState.Warning;break;case"3":a=sap.ui.core.ValueState.Information;break}return a},removeLeadingZeros:function(t){return parseInt(t,10).toString()},getMimeType:function(t){const a={img:"sap-icon://attachment-photo",png:"sap-icon://attachment-photo",bm:"sap-icon://attachment-photo",bmp:"sap-icon://attachment-photo",boz:"application/x-bzip2",bsh:"application/x-bsh",bz:"application/x-bzip",bz2:"application/x-bzip2",c:"sap-icon://document","c++":"sap-icon://document",cat:"application/vnd.ms-pki.seccat",cc:"sap-icon://document",conf:"sap-icon://document",css:"text/css",doc:"sap-icon://doc-attachment",dot:"sap-icon://doc-attachment",gif:"sap-icon://attachment-photo",gz:"application/x-compressed",gzip:"application/x-gzip",htm:"sap-icon://attachment-html",html:"sap-icon://attachment-html",htmls:"sap-icon://attachment-html",jpe:"sap-icon://attachment-photo",jpeg:"sap-icon://attachment-photo",jpg:"sap-icon://attachment-photo",jps:"sap-icon://attachment-photo",js:"text/javascript",json:"text/json",pic:"sap-icon://attachment-photo",pict:"sap-icon://attachment-photo",pps:"sap-icon://ppt-attachment",ppt:"sap-icon://ppt-attachment",ppz:"sap-icon://ppt-attachment",tex:"sap-icon://attachment-text-file",text:"sap-icon://attachment-text-file",tgz:"application/x-compressed",tif:"sap-icon://attachment-photo",tiff:"sap-icon://attachment-photo",word:"sap-icon://doc-attachment",wp:"sap-icon://doc-attachment",wp5:"sap-icon://doc-attachment",wp6:"sap-icon://doc-attachment",wpd:"sap-icon://doc-attachment",xbm:"sap-icon://attachment-photo",xls:"sap-icon://excel-attachment",xlt:"sap-icon://excel-attachment",xlv:"sap-icon://excel-attachment",xlw:"sap-icon://excel-attachment",xml:"text/xml",z:"application/x-compress",zip:"application/zip"},e=t.split(".").pop();if(!a.hasOwnProperty(e)){return null}return a[e]},getThumbnailUrl:function(t){const a={img:"sap-icon://attachment-photo",png:"sap-icon://attachment-photo",bm:"sap-icon://attachment-photo",bmp:"sap-icon://attachment-photo",bz:"sap-icon://attachment-zip-file",bz2:"sap-icon://attachment-zip-file",c:"sap-icon://document","c++":"sap-icon://document",cc:"sap-icon://document",conf:"sap-icon://document",css:"sap-icon://document",doc:"sap-icon://doc-attachment",dot:"sap-icon://doc-attachment",gif:"sap-icon://attachment-photo",gz:"sap-icon://attachment-zip-file",gzip:"sap-icon://attachment-zip-file",htm:"sap-icon://attachment-html",html:"sap-icon://attachment-html",htmls:"sap-icon://attachment-html",jpe:"sap-icon://attachment-photo",jpeg:"sap-icon://attachment-photo",jpg:"sap-icon://attachment-photo",jps:"sap-icon://attachment-photo",js:"sap-icon://document",json:"sap-icon://document",pdf:"sap-icon://pdf-attachment",pic:"sap-icon://attachment-photo",pict:"sap-icon://attachment-photo",pps:"sap-icon://ppt-attachment",ppt:"sap-icon://ppt-attachment",ppz:"sap-icon://ppt-attachment",tex:"sap-icon://attachment-text-file",text:"sap-icon://attachment-text-file",tgz:"sap-icon://attachment-zip-file",tif:"sap-icon://attachment-photo",tiff:"sap-icon://attachment-photo",word:"sap-icon://doc-attachment",wp:"sap-icon://doc-attachment",wp5:"sap-icon://doc-attachment",wp6:"sap-icon://doc-attachment",wpd:"sap-icon://doc-attachment",xbm:"sap-icon://attachment-photo",xls:"sap-icon://excel-attachment",xlt:"sap-icon://excel-attachment",xlv:"sap-icon://excel-attachment",xlw:"sap-icon://excel-attachment",xml:"sap-icon://document",z:"sap-icon://attachment-zip-file",zip:"sap-icon://attachment-zip-file"},e=t.split(".").pop();if(!a.hasOwnProperty(e)){return null}return a[e]},buildUrlFile:function(t,a){if(!t||!a){return""}return this.getModel().sServiceUrl+"/"+this.getModel().createKey("AdjuntoSet",{Nrorec:t,Archivo:a})+"/Contenido/$value"}}});