import auth from '@react-native-firebase/auth';

export function signIn({email, password}: any) {
  return auth().signInWithEmailAndPassword(email, password);
}
export function signUp({email, password}: any) {
  return auth().createUserWithEmailAndPassword(email, password);
}
export function subscribeAuth(callback: any) {
  return auth().onAuthStateChanged(callback);
}
export function sendEmail({email, actionCodeSettings}: any) {
  return auth().sendSignInLinkToEmail(email, actionCodeSettings);
}
export function verifyEmail(actionCodeSettings: any) {
  return auth().currentUser?.sendEmailVerification(actionCodeSettings);
}
export function signOut() {
  return auth().signOut();
}
