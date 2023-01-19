import { Linking } from 'react-native';

export default function openURL({url}: any) {
  Linking.openURL(url);
}