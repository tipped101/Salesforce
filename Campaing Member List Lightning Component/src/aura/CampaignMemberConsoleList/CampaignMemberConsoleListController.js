({
	doInit : function(component, event, helper) {
		var getMemberList = component.get("c.getCampaignMembers");     
     	getMemberList.setParams({
        campaignId: component.get('v.recordId') 
      });
      
      getMemberList.setCallback(this, function(response) {
        var state = response.getState();
          if(state=='SUCCESS'){
            //console.log( response.getReturnValue() );
            if(response.getReturnValue().length > 0){
              //console.log('----SET TO TRUE');
              component.set("v.memberList", response.getReturnValue());     
              component.set("v.totalMembers",response.getReturnValue().length );
              helper.updatePageNumbers(component);
            } else {
              //console.log('----SET TO FALSE');
              component.set("v.memberList", []);
            }
          }

      });
    $A.enqueueAction(getMemberList);
	},
     
    itemsToDisplayChange: function (component, event, helper) {
        //Do something with the change handler
        
        var recordsToDisplay = parseInt( event.getSource().get("v.value") );
        var currentStatPos = parseInt( component.get("v.listStartPos") ); 
        var newEndPos = (currentStatPos + recordsToDisplay);
        component.set("v.listEndPos", newEndPos );

        helper.updatePageNumbers(component);
        
        //console.log('Curretn Start Pos: '+currentStatPos);
        //console.log('New End Pos: ' + newEndPos)
      },
    

    handlePageClick: function (component, event, helper) {      
	    var selectedButtonValue = parseInt( event.getSource().get("v.value") );    
        var recordsToDisplay = parseInt( component.get("v.selectedValue") );
        
        var newStartPos = ( (recordsToDisplay * selectedButtonValue ) );
        var newEndPosCalc = ( newStartPos + recordsToDisplay );
        var newEndPos = (newEndPosCalc > 0 ) ? newEndPosCalc : recordsToDisplay;
        
        component.set("v.currentPage", selectedButtonValue);
        component.set("v.listStartPos", newStartPos );
        component.set("v.listEndPos", newEndPos );
        helper.updatePageNumbers(component);
        //console.log("Button Val: " + selectedButtonValue + 'New Start: '+ newStartPos+ 'New End: '+newEndPos);
    },
    
    handleTileClick : function(component, event, helper){
        
        var workspaceAPI = component.find("rafaleWorkspace");
        var campaingId = component.get('v.recordId');
        //var memberId = event.getSource().get("v.value");
        var memberId = event.target.id;
        	//console.log(event.target);
            //console.log('Tile Click '+memberId);
         workspaceAPI.isConsoleNavigation().then(function(response) {
            //console.log(response);
            if(response){
            	workspaceAPI.openTab({
            		url: '#/sObject/'+campaingId+'/view',
            		focus: true
        		}).then(function(response) {
                    workspaceAPI.openSubtab({
                        parentTabId: response,
                        url: '#/sObject/'+memberId+'/view',
                        focus: true
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });  
            }else{
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                    "url": '#/sObject/'+memberId+'/view'
                });
                urlEvent.fire();
            }
        })
        .catch(function(error) {
 	       console.log(error);
        });
    }
})