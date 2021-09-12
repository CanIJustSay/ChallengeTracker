import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  ShadowPropTypesIOS,
} from "react-native";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Header } from "react-native-elements";
import firebase from "firebase";
import { Icon } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import db from "../config";

export default class ToDo extends React.Component {
  constructor() {
    super();
    this.state = {
      holdTitle: "",
      holdDes: "",
      holdDeadline: "",
      holdPriority: "",
      isThereDeadline: true,
      showDatePicker: false,
      modalShown: false,
      storeData:"",
    };
  }
  handlerPicker = () => {
    this.setState({
      showDatePicker: false,
    });
  };
  hidePicker = () => {
    this.setState({
      showDatePicker: false,
    });
  };
  showModal = () => {
    return (
      <Modal visible={this.state.modalShown}>
        <View>
          <KeyboardAvoidingView>
            <Header
              centerComponent={{
                text: "Create your Task",
                style: { fontWeight: "bold", fontSize: 20 },
              }}
            ></Header>
            <View style={styles.container}>
              <TextInput
                style={styles.textInputs}
                onChangeText={(data) => {
                  this.setState({
                    holdTitle: data,
                  });
                }}
                placeholder={"Title"}
                placeholderTextColor={"black"}
              ></TextInput>
              <TextInput
                style={styles.textInputs}
                onChangeText={(data) => {
                  this.setState({
                    holdDes: data,
                  });
                }}
                placeholder={"Description"}
                placeholderTextColor={"black"}
              ></TextInput>

              <DropDownPicker
                items={[
                  { label: "Deadline", value: "true" },
                  { label: "No Deadline", value: "false" },
                ]}
                style={{ marginTop: 10 }}
                containerStyle={{ width: 300, height: 50 }}
                onChangeItem={async (item) => {
                  var b;
                  if (item.value === "true") {
                    b = true;
                  } else {
                    b = false;
                  }
                  await this.setState({
                    isThereDeadline: b,
                    showDatePicker: b,
                  });
                }}
              ></DropDownPicker>

              <Text style={{ marginTop: 70, fontWeight: "bold" }}>
                Choose your severity
              </Text>

              <DropDownPicker
                items={[
                  { label: "Severe", value: "servere" },
                  { label: "Moderate", value: "moderate" },
                  { label: "Low", value: "low" },
                ]}
                style={{ marginTop: 10 }}
                containerStyle={{ width: 300, height: 50 }}
                onChangeItem={async (item) => {
                  await this.setState({
                    dropSelected: item.value,
                  });
                }}
              ></DropDownPicker>

              <DateTimePicker
                isVisible={this.state.showDatePicker}
                onConfirm={this.handlerPicker}
                onCancel={this.hidePicker}
              ></DateTimePicker>

              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    modalShown: false,
                  });
                  this.makeTask();
                }}
              >
                <Text style={{ fontWeight: "bold", marginTop: 20 }}>
                  Submit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    modalShown: false,
                  });
                }}
              >
                <Text style={{ fontWeight: "bold", marginTop: 20 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  };
  makeTask = () => {
    db.collection("Tasks").add({
      Title: this.state.holdTitle,
      Des: this.state.holdDes,
      Deadline: this.state.holdDeadline,
      Priority: this.state.holdPriority,
      isThereDeadline: true,
      email: firebase.auth().currentUser.email,
    });
  };
  fetchData = async () => {
    var list = [];
    var ref = await db
      .collection("Tasks")
      .where("email", "==", firebase.auth().currentUser.email)
      .onSnapshot((snapShot)=>{
        snapShot.docs.map((eachDoc) => {
            var data = eachDoc.data();
        list.push(data);
        });
        this.setState({
          storeData:list,
        })
      });
    
  
  };
  componentDidMount() {
    setTimeout(()=>{
    this.fetchData();
    },600)

  }
  render() {
    console.log(this.state.storeData)
    return (
      <View>
        <Header
          centerComponent={{
            text: "Tasks",
            style: { fontWeight: "bold", fontSize: 20 },
          }}
        ></Header>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              modalShown: true,
            });
          }}
        >
          <Icon type="feather" name="plus"></Icon>
        </TouchableOpacity>
        {this.showModal()}
        <FlatList
              data={this.state.storeData}
              renderItem={({ item }) => {
                return (
                  <View>
                    <Text>{item.Title}</Text>
                  </View>
                );
              }}
            ></FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInputs: {
    borderWidth: 2,
    height: 50,
    marginTop: 20,
    textAlign: "center",
    width: 250,
    color: "black",
    borderRadius: 5,
    borderColor: "black",
  },
});
