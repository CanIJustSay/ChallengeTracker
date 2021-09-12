import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';

export default class Create extends React.Component{

    isUserLoggedIn = () => {
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                this.props.navigation.navigate("bottomNav");
            }else{
                this.props.navigation.navigate("Login");
            }
        })
    };

    componentDidMount(){
        this.isUserLoggedIn();
    }
  render(){
    return (
    <View>
        <Text>Loading...</Text>
    </View>
  );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
