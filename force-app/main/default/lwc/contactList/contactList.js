import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import CON_FST_NAME from '@salesforce/schema/Contact.FirstName';
import CON_LST_NAME from '@salesforce/schema/Contact.LastName';
import CON_EMAIL from '@salesforce/schema/Contact.Email';
import { reduceErrors } from 'c/ldsUtils';
const COLUMNS = [
    { label: 'Contact First Name', fieldName: CON_FST_NAME.fieldApiName, type: 'text' },
    { label: 'Contact Last Name', fieldName: CON_LST_NAME.fieldApiName, type: 'text' },
    { label: 'Contact Email', fieldName: CON_EMAIL.fieldApiName, type: 'email' }
];
export default class ContactList extends LightningElement {
    columns = COLUMNS;
    @wire(getContacts)
    contacts

    get errors()
    {
        return (this.contacts.error) ? reduceErrors(this.contacts.error) : [];
    }
}