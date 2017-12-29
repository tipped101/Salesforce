/**
 * Apex Controller for looking up an SObject via SOSL
 */
public without sharing class LookupSObjectController 
{
    /**
     * Aura enabled method to search a specified SObject for a specific string
     */
    @AuraEnabled
    public static List<Map<String, Object>> lookup(String searchString, String sObjectAPIName , String additionalFields, Integer rowLimit)
    {
        // Sanitze the input
        String sanitizedSearchString = String.escapeSingleQuotes(searchString);
        String sanitizedSObjectAPIName = String.escapeSingleQuotes(sObjectAPIName);
        String sanitizedAdditionalFields = (additionalFields != null ) ? ','+String.escapeSingleQuotes(additionalFields) : '';
        Integer sanitizedRowLimit = (rowLimit != null ) ? rowLimit : 10;

    
        //List<Result> results = new List<Result>();
        List<Map<String, Object>> resultsNew = new List<Map<String, Object>>();
 
        // Build our SOSL query
        String searchQuery = 'FIND \'' + sanitizedSearchString + '*\' IN ALL FIELDS RETURNING ' + sanitizedSObjectAPIName + '(id,name'+sanitizedAdditionalFields+') Limit '+ rowLimit +''; 
 
        // Execute the Query
        //System.debug(searchQuery);
        List<List<SObject>> searchList = Search.query(searchQuery);
        
        //System.debug('Results::: ' + searchList);
 
        // Create a list of matches to return
        for (SObject so : searchList[0])
        {

            Map<String, Object> resultsNewMap = new Map<String, Object>();

            resultsNewMap.put('SObjectLabel', (String)so.get('Name') );
            resultsNewMap.put('SObjectId', so.Id);
            
            if(additionalFields != null){
                List<String> fields = additionalFields.split(',');
                for(String field : fields){
                    resultsNewMap.put( field, (Object)so.get(field));
                }
            }
            
            resultsNew.add(resultsNewMap);
            
            /*
            results.add(
                new Result(
                    (String)so.get('Name'), 
                    so.Id, 
                    (String)so.get('Phone'), 
                    (String)so.get('Email') 
                )
            );

            */

            
        }
         
            System.debug('::: New Resulst  ' + resultsNew);

        return resultsNew;
    }
     
    /**
     * Inner class to wrap up an SObject Label and its Id
     */
    public class Result
    {
        @AuraEnabled public String SObjectLabel {get; set;}
        @AuraEnabled public Id SObjectId {get; set;}
        @AuraEnabled public String phone {get; set;}
        @AuraEnabled public String email {get; set;}

         
        //public Result(String sObjectLabel, Id sObjectId, String sObjectPhone, String sObjectEmail)
        //{
         //   this.SObjectLabel = sObjectLabel;
         //   this.SObjectId = sObjectId;
         //   this.phone = sObjectPhone;
         //   this.email = sObjectEmail;
       // }
    }
}
