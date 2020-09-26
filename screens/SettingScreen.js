import React, { Component } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

import { Input } from "react-native-elements";

import { RFValue } from "react-native-responsive-fontsize";

export default class SettingScreen extends Component {
    constructor() {
        super();
        this.state = {
            emailId: '',
            firstName: '',
            lastName: '',
            address: '',
            contact: '',
            docId: ''
        }
    }

    getUserDetails = () => {
        var email = firebase.auth().currentUser.email;
        db.collection('user').where('User_Name', '==', email).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    var data = doc.data()
                    this.setState({
                        emailId: data.User_Name,
                        firstName: data.First_Name,
                        lastName: data.Last_Name,
                        address: data.Adress,
                        contact: data.Contact,
                        docId: doc.id
                    })

                });
            })
    }

    updateUserDetails = () => {
        db.collection('user').doc(this.state.docId)
            .update({
                "First_Name": this.state.firstName,
                "Last_Name": this.state.lastName,
                "Adress": this.state.address,
                "Contact": this.state.contact,
            })

        alert("Profile Updated Successfully")

    }

    componentDidMount() {
        this.getUserDetails()
    }


    render() {

        return (
            <ScrollView>
                <View>
                    <MyHeader title="Settings" navigation={this.props.navigation} />
                    <View style={styles.container} >

                        <View style={styles.formContainer}>
                            <Text style={styles.label} > First Name </Text>
                            <Input
                                style={styles.formTextInput}
                                placeholder={"First Name"}
                                maxLength={8}
                                onChangeText={(text) => {
                                    this.setState({
                                        firstName: text
                                    })
                                }}
                                value={this.state.firstName}
                            />
                            <Text style={styles.label} > Last Name </Text>
                            <Input
                                style={styles.formTextInput}
                                placeholder={"Last Name"}
                                maxLength={8}
                                onChangeText={(text) => {
                                    this.setState({
                                        lastName: text
                                    })
                                }}
                                value={this.state.lastName}
                            />
                            <Text style={styles.label} > Contact </Text>
                            <Input
                                style={styles.formTextInput}
                                placeholder={"Contact"}
                                maxLength={10}
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                    this.setState({
                                        contact: text
                                    })
                                }}
                                value={this.state.contact}
                            />
                            <Text style={styles.label} > Address </Text>
                            <Input
                                style={styles.formTextInput}
                                placeholder={"Address"}
                                onChangeText={(text) => {
                                    this.setState({
                                        address: text
                                    })
                                }}
                                value={this.state.address}
                            />
                            <View style={styles.buttonView} >
                                <TouchableOpacity style={styles.button}
                                    onPress={() => {
                                        this.updateUserDetails()
                                    }}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    formContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    formTextInput: {
        width: "75%",
        height: RFValue(50),
        alignSelf: 'center',
        borderColor: '#ffba0c',
        borderRadius: 5,
        borderWidth: 1,
        marginTop: 20,
        marginLeft: RFValue(20),
        padding: RFValue(10),
        marginBottom: RFValue(20),
    },
    button: {
        width: "75%",
        height: RFValue(60),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: RFValue(50),
        backgroundColor: "#ff9d00",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: RFValue(20)
    },
    buttonText: {
        fontSize: RFValue(23),
        fontWeight: "bold",
        color: "#fff"
    },
    label: {
        fontSize: RFValue(18),
        color: '#717d7e',
        fontWeight: 'bold',
        padding: RFValue(10),
        marginLeft: RFValue(20),
    },
    buttonView: {
        flex: 0.22,
        alignItems: 'center',
        marginTop: RFValue(100),

    },
})