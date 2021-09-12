import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import { createAppContainer } from 'react-navigation';
import { createSwitchNavigator } from 'react-navigation';
import Login from './screens/Login';
import Goals from './screens/Goals';
import ToDo from './screens/ToDo';
import Create from './screens/CreateGoals';
import Loading from './screens/Loading';
import Profile from './screens/Profile';
import { createDrawerNavigator } from 'react-navigation-drawer';


export default class App extends React.Component{
  render(){
    return (
<AppContainer></AppContainer>
  );
    }
}



const bottomNav = createMaterialBottomTabNavigator({
  Goals:{screen:Goals,
  navigationOptions:{tabBarIcon:<Icon type="feather" name="award"/>}},
  ToDo:{screen:ToDo, navigationOptions:{tabBarIcon:<Icon type="feather" name="edit"/>}},
  Profile:{screen: Profile, navigationOptions:{tabBarIcon:<Icon type="feather" name="user"/>}},
})

const profileNav = createDrawerNavigator({
  Home:{screen:bottomNav},
  Profile:{screen:Profile}
});

const loginNav = createSwitchNavigator({  
  Loading:{screen:Loading},
  Login:{screen:Login},
  bottomNav:{screen:profileNav},

})

const AppContainer = createAppContainer(loginNav);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
