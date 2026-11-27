import { useState } from 'react';
// import * as Contacts from 'expo-contacts';
import * as Contacts from 'expo-contacts/legacy';

import { Alert, Share, Platform } from 'react-native';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const requestAndLoadContacts = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        const mockContacts = [
          { id: '1', name: 'Aarav Mehta', phoneNumbers: [{ number: '+91 98765 11111' }] },
          { id: '2', name: 'Bhavna Sen', phoneNumbers: [{ number: '+91 98765 22222' }] },
          { id: '3', name: 'Chirag Rao', phoneNumbers: [{ number: '+91 98765 33333' }] },
          { id: '4', name: 'Divya Iyer', phoneNumbers: [{ number: '+91 98765 44444' }] },
          { id: '5', name: 'Eshan Patel', phoneNumbers: [{ number: '+91 98765 55555' }] },
        ];
        setContacts(mockContacts);
        setHasPermission(true);
        setIsLoading(false);
        return mockContacts;
      }

      const { status } = await Contacts.requestPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);

      if (!granted) {
        setIsLoading(false);
        Alert.alert('Permission Needed', 'Contacts access is required to invite classmates.');
        return [];
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        sort: Contacts.SortTypes.FirstName,
      });

      const valid = data.filter((c) => c.name);
      setContacts(valid);
      setIsLoading(false);
      return valid;
    } catch (e) {
      console.warn('Contacts error:', e);
      setIsLoading(false);
      return [];
    }
  };

  const inviteContact = async (contact) => {
    try {
      const message = `Hey ${contact.name}! I'm buying and selling campus textbooks and electronics on Buy & Sell. Check it out: campusmarket://invite`;
      await Share.share({
        message,
        title: 'Join Buy & Sell',
      });
    } catch (e) {
      console.error('Invite error:', e);
    }
  };

  const saveSellerToContacts = async (seller) => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Saved to Contacts (Web Mock)', `Saved ${seller.name} to phone contacts!`);
        return true;
      }

      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Contacts access required to save seller.');
        return false;
      }

      const contact = {
        [Contacts.Fields.FirstName]: seller.name,
        [Contacts.Fields.Note]: `Buy & Sell Seller (${seller.college || 'Campus'})`,
      };

      if (seller.phone && seller.contactPreferences?.phone) {
        contact[Contacts.Fields.PhoneNumbers] = [{ label: 'mobile', number: seller.phone }];
      }

      if (seller.email && seller.contactPreferences?.email) {
        contact[Contacts.Fields.Emails] = [{ label: 'work', email: seller.email }];
      }

      await Contacts.addContactAsync(contact);
      Alert.alert('Seller Saved!', `${seller.name} was added to your device contacts.`);
      return true;
    } catch (e) {
      console.error('Error saving seller:', e);
      Alert.alert('Error', 'Could not save seller to contacts.');
      return false;
    }
  };

  return {
    contacts,
    isLoading,
    hasPermission,
    requestAndLoadContacts,
    inviteContact,
    saveSellerToContacts,
  };
};
