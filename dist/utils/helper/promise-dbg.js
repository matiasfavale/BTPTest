(function(global, fnFactory){
    "use strict";
    
    if(typeof sap === "undefined"){
        if(typeof helper === "undefined"){
            global.helper = {};
        }

        global.helper.promise = fnFactory();
    }else{
        sap.ui.define("simplot.portalsprd.utils.helper.promise", [], fnFactory, true);
    }
})(this, function(){
    "use strict";
    
    return function(fnFactoryPromise){
    	return function(vReciveData){
    		return new Promise(function(fnResolve, fnReject){
    			fnFactoryPromise(vReciveData, fnResolve, fnReject);
    		});
    	};
    };
});