import { LightningElement } from 'lwc';
import CON_OBJ from '@salesforce/schema/Contact';
import CON_FST_NAME from '@salesforce/schema/Contact.FirstName';
import CON_LST_NAME from '@salesforce/schema/Contact.LastName';
import CON_EMAIL from '@salesforce/schema/Contact.Email';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ContactCreator extends LightningElement {
    fields=[CON_FST_NAME, CON_LST_NAME, CON_EMAIL];
    objectApiName = CON_OBJ.objectApiName;
    handleSuccess(event){
        const toastEvent = new ShowToastEvent({
            title: "Contact created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
    }

}