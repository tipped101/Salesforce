({

    doInit : function(cmp, event, helper){
        var lableIsRequired = cmp.get("v.required");
        var theLabel = cmp.find("fieldRequired");


        if(lableIsRequired){
            //$A.util.addClass(theLabel, 'slds-required');

        }
        //cmp.set("v.label", theLabel);
    },
    /**
     * Search an SObject for a match
     */
    search : function(cmp, event, helper) {
        helper.doSearch(cmp);        
    },
 
    /**
     * Select an SObject from a list
     */
    select: function(cmp, event, helper) {
        helper.handleSelection(cmp, event);
    },
     
    /**
     * Clear the currently selected SObject
     */
    clear: function(cmp, event, helper) {
        helper.clearSelection(cmp);    
    },

    createRecord : function (component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Contact"
        });
        createRecordEvent.fire();
    },

    handlePillFieldId : function (component, event, helper){
        console.log("Save completed successfully.");
        var frcRcd = component.find('forceRecordCmp');
        if(frcRcd != 'undefined'){
            frcRcd.reloadRecord()
        }

    },

    handlePillFields : function (component, event, helper){
        console.log('Contact RecordId Changed Id= '+ component.get("v.selectedRecord"));
        var lableIsRequired = component.get("v.required");
        var theLabel = component.find("fieldRequired");
        
        var changeType = event.getParams().changeType;

        if (changeType === "ERROR") { /* handle error; do this first! */ }
            else if (changeType === "LOADED") { /* handle record load */ 
                
                if( component.get("v.pillFields") == null ){
                    console.log('tt'+component.get("v.selectedRecord"));
                    component.set("v.pillFields", component.get("v.pillFieldz") );
                }else{
                    console.log('lightData');
                    //component.find('forceRecordCmp').reloadRecord();
                    //component.set("v.pillFields", component.get("v.pillFields") );
                }
            }
            else if (changeType === "REMOVED") { /* handle record removal */ }
            else if (changeType === "CHANGED") {
            /* handle record change; reloadRecord will cause you to lose your current record, including any changes you’ve made */
                var frcRcd = component.find("forceRecordCmp");
                if(frcRcd != 'undefined'){
                    frcRcd.reloadRecord()
                }
            }

        if(component.get("v.selectedRecord") != null ){
            
            //component.find('forceRecordCmp').reloadRecord();

            if( component.get("v.pillFields") == null ){
                console.log('Private Record' + component.get("v.selectedRecord"));
                component.set("v.pillFields", component.get("v.pillFieldz") );
            }


            
               
            //console.log("call reload");
            component.set("v.selectedIsRecord", false);
            component.set("v.selectedIsRecord", true); 

            console.log( component.get("v.pillFields") );

        }
        
    }
})