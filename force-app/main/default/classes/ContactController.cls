public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){
        try {
            return [
                SELECT FirstName, LastName, Email 
                FROM Contact LIMIT 100
           ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
