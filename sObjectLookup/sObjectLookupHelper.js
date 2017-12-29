({
    /**
     * Perform the SObject search via an Apex Controller
     */
    doSearch : function(cmp) {
        // Get the search string, input element and the selection container
        var searchString = cmp.get('v.searchString');
        var additionalFields = cmp.get('v.addFields').toString();
        var inputElement = cmp.find('lookup');
        var lookupListWrapper = cmp.find('lookuplistWrapper');
        var lookupList = cmp.find('lookuplistContainer');
        var rowLimit = cmp.get("v.rowLimit");
 
        // Clear any errors and destroy the old lookup items container
        inputElement.set('v.errors', null);
         
        // We need at least 2 characters for an effective search
        if (typeof searchString === 'undefined' || searchString.length < 2)
        {
            // Hide the lookuplist
            $A.util.removeClass(lookupListWrapper, 'slds-is-open');
            $A.util.addClass(lookupListWrapper, 'slds-combobox-lookup');
            //$A.util.removeClass(lookupList, 'slds-has-input-focus');
            return;
        }
 
        // Show the lookuplist
        //$A.util.addClass(lookupList, 'slds-has-input-focus');
        $A.util.removeClass(lookupListWrapper, 'slds-combobox-lookup');
        $A.util.addClass(lookupListWrapper, 'slds-is-open');

        // Get the API Name
        var sObjectAPIName = cmp.get('v.sObjectAPIName');
 
        // Create an Apex action
        var action = cmp.get('c.lookup');
 
        // Mark the action as abortable, this is to prevent multiple events from the keyup executing
        action.setAbortable();
 
        // Set the parameters
        action.setParams({ 
            "searchString" : searchString, 
            "sObjectAPIName" : sObjectAPIName, 
            "additionalFields" : additionalFields,
            "rowLimit" : rowLimit
        });
                           
        // Define the callback
        action.setCallback(this, function(response) {
            var state = response.getState();
 
            // Callback succeeded
            if (cmp.isValid() && state === "SUCCESS")
            {
                // Get the search matches
                var matches = response.getReturnValue();
 
                // If we have no matches, return nothing
                if (matches.length == 0)
                {
                    cmp.set('v.hasResults', false);
                    cmp.set('v.matches', null);
                    return;
                }
                 
                // Store the results
                //console.log(matches);
                cmp.set('v.hasResults', true);
                cmp.set('v.matches', matches);
            }
            else if (state === "ERROR") // Handle any error by reporting it
            {
                var errors = response.getError();
                 
                if (errors) 
                {
                    if (errors[0] && errors[0].message) 
                    {
                        this.displayToast('Error', errors[0].message);
                    }
                }
                else
                {
                    this.displayToast('Error', 'Unknown error.');
                }
            }
        });
         
        // Enqueue the action                  
        $A.enqueueAction(action);                
    },
 
    /**
     * Handle the Selection of an Item
     */
    handleSelection : function(cmp, event) {
        // Resolve the Object Id from the events Element Id (this will be the <a> tag)
        var objectId = this.resolveId(event.currentTarget.id);

 
        // The Object label is the inner text)
        //var objectLabel = event.currentTarget.innerText;
        //console.log(event.currentTarget);
        var elem = cmp.get("v.matches")[this.resolveIndex(event.currentTarget.id)];
        var objectLabel = elem.SObjectLabel;
        var oPohone = (elem.phone != undefined) ? elem.phone : '';
        var oEmail = (elem.email != undefined) ? elem.email : '';
        var objectTitle = objectLabel +'  '+ oPohone +'   ' + oEmail;

        var pillFieldz = {
            fields : {
                Name : { value : objectLabel},
                Phone : { value : oPohone },
                Email : { value : oEmail }
            },
        };

        cmp.set("v.pillFieldz", pillFieldz);

        // Log the Object Id and Label to the console
        //console.log('objectId=' + objectId);
        //console.log('objectLabel=' + objectLabel);
                 
        // Create the UpdateLookupId event
        var updateEvent = cmp.getEvent("updateLookupIdEvent");
         
        // Populate the event with the selected Object Id
        cmp.set("v.selectedRecord", objectId);
        cmp.set('v.hasResults', false);
        //cmp.set("v.selectedIsRecord", true);

        // Update the Searchstring with the Label
        cmp.set("v.searchString", objectLabel);
        cmp.set("v.objectTitle", objectTitle);
 
        // Hide the Lookup List
        var lookupList = cmp.find("lookuplist");
        var lookupListWrapper = cmp.find('lookuplistWrapper');

        $A.util.removeClass(lookupListWrapper, 'slds-is-open');
        $A.util.addClass(lookupListWrapper, 'slds-combobox-lookup');
        //$A.util.removeClass(lookupList, 'slds-has-input-focus');
        //$A.util.addClass(lookupList, 'slds-hide');
 
        // Hide the Input Element
        var inputElement = cmp.find('lookup');
        //$A.util.removeClass(lookupList, 'slds-has-input-focus');
        //$A.util.addClass(inputElement, 'slds-hide');
 
        // Show the Lookup pill
        var lookupPill = cmp.find("lookup-pill");
        //$A.util.removeClass(lookupPill, 'slds-hide');
 
        // Lookup Div has selection
        var inputElement = cmp.find('lookup-div');
        //$A.util.addClass(inputElement, 'slds-has-selection');
        $A.util.addClass(cmp.find('pillWrapper'), 'slds-p-around--x-small' );

         
    },
 
    /**
     * Clear the Selection
     */
    clearSelection : function(cmp) {
        // Create the ClearLookupId event
        
        cmp.set("v.selectedRecord", null);
        cmp.set("v.selectedIsRecord", false);

        // Clear the Searchstring
        cmp.set("v.searchString", null);
 
        // Hide the Lookup pill
        var lookupPill = cmp.find("lookup-pill");
        //$A.util.addClass(lookupPill, 'slds-hide');
 
        // Show the Input Element
        var inputElement = cmp.find('lookup');
        //$A.util.removeClass(inputElement, 'slds-hide');
 
        // Lookup Div has no selection
        var inputElement = cmp.find('lookup-div');
        //$A.util.removeClass(inputElement, 'slds-has-selection');
        $A.util.removeClass(cmp.find('pillWrapper'), 'slds-p-around--x-small' );
    },
 
    /**
     * Resolve the Object Id from the Element Id by splitting the id at the _
     */
    resolveId : function(elmId)
    {
        var i = elmId.indexOf('_id_');
        return elmId.substr(i+4, 18);
    },

    resolveIndex : function(elmId)
    {
        var i = elmId.lastIndexOf('_');
        return elmId.substr(i+1);
    },
 
    /**
     * Display a message
     */
    displayToast : function (title, message) 
    {
        var toast = $A.get("e.force:showToast");
 
        // For lightning1 show the toast
        if (toast)
        {
            //fire the toast event in Salesforce1
            toast.setParams({
                "title": title,
                "message": message
            });
 
            toast.fire();
        }
        else // otherwise throw an alert
        {
            alert(title + ': ' + message);
        }
    }
})