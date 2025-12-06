export function useGenerateContactId() {
    const contact_id = Math.floor(Math.random()* 90000000).toString();  //generate a random 8 digit number
    const contactId = "57-" + contact_id; 
    return contactId
}