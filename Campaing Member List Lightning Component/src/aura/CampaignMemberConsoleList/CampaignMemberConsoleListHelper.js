({
	updatePageNumbers : function(component, event, helper) {
		var pageNumbers = [];
        component.set("v.pageNumbers", pageNumbers );
        var totalRecords = component.get("v.totalMembers");
        var recordsPerPage = component.get("v.selectedValue");
        var currentPage = component.get("v.currentPage");
        
        var totalPages = Math.ceil(totalRecords / recordsPerPage);
        
        //More than 8 pages of results
        if(totalPages > 8){
            if(currentPage > 0){
               pageNumbers.push(0); 
            }
            // Show a few pages before the current and after the current
            if(currentPage >= 0 && currentPage < totalPages-1){
            	for(var i = currentPage-3; i < currentPage+3; i++ ){
                    if(i > 0 && i < currentPage){
                       pageNumbers.push(i); 
                    }
                    if(i == currentPage){
                    	pageNumbers.push(currentPage);
                    }
                    if(i > currentPage && i < totalPages-1){
                       pageNumbers.push(i); 
                    }					                   
       			}
            }
            // Show a few pages before the current if it's the last pge
            if(currentPage >= 0 && currentPage == totalPages-1){
            	for(var i = currentPage-3; i < totalPages-1; i++ ){
                    if(i > 0 && i < currentPage){
                       pageNumbers.push(i); 
                    }			                   
       			}
            }
			pageNumbers.push(totalPages-1);
        }else{
        	// Less than 8 Pages of results
            for(var i = 0; i < totalPages; i++ ){
            	pageNumbers.push(i);
        	}
        }
        component.set("v.pageNumbers", pageNumbers );
        //console.log(pageNumbers);
	}
})