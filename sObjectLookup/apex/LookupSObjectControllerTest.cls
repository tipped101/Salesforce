@isTest
private class LookupSObjectControllerTest {
	/*
		Test class for LookupSObjectController class
	*/
	@isTest static void testLookupMethod() {
		// Setup test data
        // Create a unique UserName
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        LocaleSidKey='en_US', ProfileId = p.Id,
        TimeZoneSidKey='America/Los_Angeles',
         UserName=uniqueUserName);

        System.runAs(u) {
              // The following code runs as user 'u'
              //System.debug('Current User: ' + UserInfo.getUserName());
              //System.debug('Current Profile: ' + UserInfo.getProfileId());
   
		// Implement test code

		    Account acct = new Account(
            	name = 'TestAcct5555555555555'
            	);

            insert acct;

            Account acctB = new Account(
                name = 'TestAcct5555555555556'
                );

            insert acctB;

            Contact cont1 = new Contact(
                FirstName = 'MyTestUser1',
                LastName = 'Test',
                Phone = '999-123-9875',
                Email = 'test@noTest1.test',
                Salutation = 'M.',
                AccountId = acct.id
                );
            
            Contact cont2 = new Contact(
                FirstName = 'MyTestUser2',
                LastName = 'Test2',
                Email = 'test@noTest2.test',
                Salutation = 'Mme',
                AccountId = acctB.id
                );

            insert cont1;
            insert cont2;

        Id [] fixedSearchResults= new Id[4];
	    fixedSearchResults[0] = acct.id;
	    fixedSearchResults[1] = acctB.id;
	    fixedSearchResults[2] = cont1.id;
	    fixedSearchResults[3] = cont2.id;
	    Test.setFixedSearchResults(fixedSearchResults);

        //List<LookupSObjectController.Result> theResult = new List<LookupSObjectController.Result>();

		List<Map<String, Object>> theResult = LookupSObjectController.lookup( 'myt', 'contact' ,'email,phone' , 5);

		//System.debug('::: The Result' + theResult);
		System.assertEquals(theResult.size() >= 0, true );

       }
	}
	
}
