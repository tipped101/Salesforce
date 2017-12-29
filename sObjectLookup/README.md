## Salesforce sObject Lookup for Lightning

This component will mimics a lookup field for any lightning component / application. 

### How to use me

1. - Create attributes for the selected Record

<aura:attribute name="contact1RecordId" type="Id" description="The current record Id to display" />

2. - Set optional Paramaters

<c:sObjectLookup label="Contact Primarire" 
                                    sobjectLabel="Contact" 
                                    required="true"
                                    pluralLabel="Contacts" 
                                    iconType="contact" 
                                    sObjectAPIName="Contact"
                                    rowLimit="5" // Optional (if it's not set it will default to 10)
                                    selectedRecord="{!v.contact1RecordId}"
                                    parentRecordId="{!v.accountRecordId}" // Optional can be used with custom record creators that requires a parent id.
                                    required="true" // Optional Boolean that ensures the field is required to save.
                                    addFields="phone,email" // optional sets additional fields to query. String value with commas between fieldApiNames
                                />

### Support or Contact

Having trouble with this component?  [emailMe](mailto:ino@websbybwills.com) and we’ll help you sort it out.
