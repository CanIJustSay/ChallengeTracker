import * as React from "react";
import { TextInput } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import firebase from "firebase";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native";
import db from "../config";
import Toast from "react-native-root-toast";
import * as ImagePicker from "expo-image-picker";
export default class Goals extends React.Component {
  constructor() {
    super();
    this.state = {
      holdEmail: "",
      holdPhone: "",
      enabled: false,
      showUpdate: false,
      showEdit: true,
      docID: "",
      storeUserImage: "#",
    };
  }
  fetchUserDetails = async () => {
    var userRef = await db
      .collection("Users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get();
    userRef.docs.map((doc) => {
      var data = doc.data();
      this.setState({
        holdPhone: data.phoneNumber,
        holdEmail: data.email,
        docID: doc.id,
      });
    });
  };
  componentDidMount = async() => {
   await this.fetchUserDetails();
    console.log(this.state.holdEmail, this.state.holdPhone);
    console.log(this.state.docID);
     await this.fetchImageFromCloud();
  };
  fetchImageFromCloud = async () => {
    console.log("yes"+this.state.holdEmail);
    var ref = firebase
      .storage()
      .ref()
      .child("UserImages/" + this.state.holdEmail);
    ref
      .getDownloadURL()
      .then( async(url) => {
        console.log("Inside here")
       await this.setState({
          storeUserImage: url,
        });
        console.log(this.state.storeUserImage + " Is There SMT")
      })
      .catch((err) => {
     //   console.log(err.message);
        console.log("Inside here")
        this.setState({
          storeUserImage: "#",
        });
      });
  };
  showUpdateButton = () => {
    if (this.state.showUpdate) {
      return (
        <View>
          <TouchableOpacity
            onPress={async () => {
              await this.setState({
                showUpdate: false,
                showEdit: true,
              });
              await this.updateValue();
            }}
          >
            <Text>Update</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (this.state.showEdit) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                showUpdate: true,
                showEdit: false,
                enabled: true,
              });
            }}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  pickImage = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [10, 10],
      quality: 1,
    });
    if (!cancelled) {
      this.setState({
        storeUserImage: uri,
      });
      this.uploadImage(uri);
    }
  };
  uploadImage = async (uri) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("UserImages/" + this.state.holdEmail);
    ref
      .put(blob)
      .then(() => {
        console.log("Upload Success");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  updateValue = async () => {
    db.collection("Users").doc(this.state.docID).update({
      phoneNumber: this.state.holdPhone,
    });
  };
  render() {
    return (
      <View>
        <Avatar
          rounded
          source={{ uri: this.state.storeUserImage }}
          size={"medium"}
          showEditButton
          containerStyle={styles.profilePic}
          onPress={() => {
            this.pickImage();
          }}
        ></Avatar>
        <Text>Email</Text>
        <TextInput value={this.state.holdEmail} editable={false}></TextInput>
        <Text>Phone Number</Text>

        <TextInput
          value={this.state.holdPhone}
          editable={this.state.enabled}
          onChangeText={(data) => {
            this.setState({
              holdPhone: data,
            });
          }}
        ></TextInput>

        {this.showUpdateButton()}
        <TouchableOpacity
        onPress={()=>{
          firebase.auth().signOut();
          this.props.navigation.navigate("Login");
        }}
        >
<Text>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: "50%",
    height: "50%",
    marginLeft: 100,
  },
});
