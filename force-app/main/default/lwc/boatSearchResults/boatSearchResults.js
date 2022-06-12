import { LightningElement, wire, track, api } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import {publish, MessageContext} from 'lightning/messageService';
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';
export default class BoatSearchResults extends LightningElement {
    selectedBoatId;
    columns = [
        {label:'Name', fieldName:'Name', editable:true},
        {label: 'length', fieldName: 'Length__c', type: 'number', editable:true},
        {label: 'Price', fieldName: 'Price__c', type: 'currency', editable:true},
        {label:'Description', fieldName:'Description__c', editable:true}
    ];
    boatTypeId = '';
    @track boats;
    isLoading = false;
    @track
    draftValues = [];

    // wired message context
    @wire(MessageContext)
    messageContext;
    // wired getBoats method 
    @wire(getBoats, {boatTypeId: '$boatTypeId'})
    wiredBoats(data, error) {
        if(data)
        {
            this.boats = data;
        }
        if(error)
        {
            console.log(error);
        }
     }

    // public function that updates the existing boatTypeId property
    // uses notifyLoading
    
    @api searchBoats(boatTypeId) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId = boatTypeId; 
    }
    
    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    @api
    async refresh() { 
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        await refreshApex(this.boats);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }
    
    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile(event) { 
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
    }
    
    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) { 
      // explicitly pass boatId to the parameter recordId
      const message = {
        recordId:{
            value:boatId
        }
            }
    publish(this.messageContext, BOATMC, message)
    }
    
    // The handleSave method must save the changes in the Boat Editor
    // passing the updated fields from draftValues to the 
    // Apex method updateBoatList(Object data).
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave(event) {
      // notify loading
      const updatedFields = event.detail.draftValues;
      // Update the records via Apex
      updateBoatList({data: updatedFields})
      .then(() => {
          this.dispatchEvent(
            new ShowToastEvent({
                title: SUCCESS_TITLE,
                message: MESSAGE_SHIP_IT,
                variant: SUCCESS_VARIANT
            })
          )
          this.draftValues=[];
          return this.refresh();
      })
      .catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: ERROR_TITLE,
                message: error.message,
                variant: ERROR_VARIANT
            })
          )
      })
      .finally(() => {});
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) { 

        if(isLoading)
        {
            const loadingEvent = new CustomEvent('loading');
            this.dispatchEvent(loadingEvent);
        }
        else{
            const doneEvent = new CustomEvent('doneloading');
            this.dispatchEvent(doneEvent);
        }
        
    }

}