import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { StyleSheet, Text, View } from "react-native";
import firebase from "firebase";
import { Alert } from "react-native";
import db from "../config";
import { Header, Icon } from "react-native-elements";
import { SocialIcon } from "react-native-elements";
import * as Google from "expo-google-app-auth";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      modalVisible: false,
      confirmPassword: "",
      phoneNumber: "",
    };
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser) => {
    console.log("Google Auth Response", googleUser);
    console.log(googleUser.user.photoUrl);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((result) => {
            if (result.additionalUserInfo.isNewUser) {
              db.collection("Users").add({
                email: result.user.email,
                phoneNumber: "",
                photoUrl: googleUser.user.photoUrl,
              });
            }
            this.props.navigation.navigate("bottomNav");
          })
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };
  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId:
          "862826237250-142l1p0u3qjoumsqi7kgenecplfho2if.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  userSignUp = async () => {
    console.log("hi");
    if (this.state.password !== this.state.confirmPassword) {
      Alert.alert("Incorrect Confirmation");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          db.collection("Users").add({
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            photoUrl: "#",
          });
          this.setState({
            modalVisible: false,
          });
          this.props.navigation.navigate("Login");
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    }
  };
  userLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.props.navigation.navigate("bottomNav");
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };
  showModal = () => {
    return (
      <Modal visible={this.state.modalVisible}>
        <View>
          <KeyboardAvoidingView>
            <Text>Sign Up</Text>
            <TextInput
              placeholder={"Email"}
              style={styles.textInputs}
              placeholderTextColor={"white"}
              onChangeText={(data) => {
                this.setState({
                  email: data,
                });
              }}
            ></TextInput>
            <TextInput
              placeholder={"Password"}
              placeholderTextColor={"white"}
              style={styles.textInputs}
              onChangeText={(data) => {
                this.setState({
                  password: data,
                });
              }}
            ></TextInput>
            <TextInput
              placeholder={"Confirm Password"}
              placeholderTextColor={"white"}
              style={styles.textInputs}
              onChangeText={(data) => {
                this.setState({
                  confirmPassword: data,
                });
              }}
            ></TextInput>
            <TextInput
              placeholder={"Phone Number(Optional)"}
              placeholderTextColor={"white"}
              style={styles.textInputs}
              onChangeText={(data) => {
                this.setState({
                  phoneNumber: data,
                });
              }}
            ></TextInput>
            <TouchableOpacity
              onPress={() => {
                this.userSignUp();
              }}
            >
              <Text>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  modalVisible: false,
                });
              }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#22577A" }}>
        <Header
          centerComponent={{
            text: "Log In or Sign Up",
            style: {
              fontWeight: "bold",
              fontSize: 20,
            },
          }}
          backgroundColor="#38A3A5"
        ></Header>
        <View style={styles.container}>
          <TextInput
            keyboardType={"email-address"}
            placeholder={"Email"}
            placeholderTextColor={"white"}
            style={styles.textInputs}
            onChangeText={(data) => {
              this.setState({
                email: data,
              });
            }}
          ></TextInput>
          <TextInput
            secureTextEntry={true}
            placeholder={"Password"}
            placeholderTextColor={"white"}
            style={styles.textInputs}
            onChangeText={(data) => {
              this.setState({
                password: data,
              });
            }}
          ></TextInput>
          {this.showModal()}
          <View style={{ padding: 50 }}>
            <View style={{ borderRadius: 20, backgroundColor: "#00b4d8" }}>
              <Icon
                name="login"
                containerStyle={{ position: "absolute", top: 6, left: 10 }}
              ></Icon>
              <TouchableOpacity
                onPress={() => {
                  this.userLogin();
                }}
                style={styles.buttons}
              >
                <Text style={styles.text}>Login</Text>
              </TouchableOpacity>
            </View>

            <SocialIcon
              type="google"
              title="Login In With Google"
              button
              style={{ width: 150 }}
              onPress={() => {
                this.signInWithGoogleAsync();
              }}
            />

            <Text style={{ textAlign: "center", fontSize: 20 }}>Or</Text>

            <View style={{  borderRadius: 20, backgroundColor: "#00b4d8"}}>
              <Icon type="feather" name="corner-up-right" containerStyle={{position:'absolute',top:5,left:10}} />

              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: true });
                }}
              >
                <Text style={styles.text}>Sign Up</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,

    alignItems: "center",
    justifyContent: "center",
  },
  textInputs: {
    borderWidth: 2,
    height: 50,
    marginTop: 50,
    textAlign: "center",
    width: 250,
    color: "white",
    borderRadius: 5,
    borderColor: "white",
  },
  buttons: {},
  text: {
    textAlign: "center",
    color: "white",
    padding: 10,
    fontWeight: "bold",
  },
});
