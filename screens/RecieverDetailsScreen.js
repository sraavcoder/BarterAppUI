import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Card } from 'react-native-elements';

import firebase from 'firebase';
import db from '../config';

import { RFValue } from "react-native-responsive-fontsize";

export default class RecieverDetailsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userID: firebase.auth().currentUser.email,
            recieverID: this.props.navigation.getParam("details")["userID"],
            requestID: this.props.navigation.getParam("details")["RequestID"],
            itemName: this.props.navigation.getParam("details")["ItemType"],
            itemDetails: this.props.navigation.getParam("details")["ItemDetails"],
            reasonToRequest: this.props.navigation.getParam("details")["ReasonToRequest"],
            itemTempValue: this.props.navigation.getParam("details")["itemValue"],
            RecieverName: '',
            RecieverContact: '',
            RecieverAdress: '',
            RecieverRequestDocID: '',
            userName: '',
            itemPrice: '',
            currencyCode: '',
            currencyCode2: '',
        }
    }

    getUserName = (userID) => {
        db.collection('user').where("User_Name", "==", userID).get()
            .then(
                snapshot => {
                    snapshot.forEach(doc => {
                        this.setState({
                            userName: doc.data().First_Name + " " + doc.data().Last_Name,
                        })
                    }
                    )
                }
            )
    }

    getRicieverDetails() {
        db.collection("user").where("User_Name", "==", this.state.recieverID).get()
            .then(
                snapshot => {
                    snapshot.forEach((doc) => {
                        this.setState({
                            RecieverName: doc.data().First_Name,
                            RecieverAdress: doc.data().Adress,
                            RecieverContact: doc.data().Contact,
                        })
                    })
                }
            )

        db.collection("requestedItems").where("RequestID", "==", this.state.requestID).get()
            .then(
                snapshot => {
                    snapshot.forEach(doc => {
                        this.setState({
                            RecieverRequestDocID: doc.id
                        })
                    }
                    )
                }
            )
    }

    async getData() {
        await db.collection('user').where('User_Name', '==', this.state.recieverID)
            .onSnapshot(data => {
                data.forEach(doc => {
                    this.setState({
                        currencyCode: doc.data().currencyCode
                    })
                })
            })

        await db.collection('user').where('User_Name', '==', this.state.userID)
            .onSnapshot(data => {
                data.forEach(doc => {
                    this.setState({
                        currencyCode2: doc.data().currencyCode
                    })
                })
            })

        fetch("http://data.fixer.io/api/latest?access_key=a0994a85d21c529ccb449f80192c4a4c")
            .then(response => {
                return response.json();
            }).then(responseData => {
                var RecieverCurrencyCode = this.state.currencyCode
                var RecieverCurrency = responseData.rates[RecieverCurrencyCode]

                var DonaterCurrencyCode = this.state.currencyCode2
                var DonaterCurrency = responseData.rates[DonaterCurrencyCode]

                var itemInEuro = this.state.itemTempValue / RecieverCurrency

                var itemPrice = itemInEuro * DonaterCurrency

                this.setState({
                    itemPrice: itemPrice
                })

            })
    }

    componentDidMount() {
        this.getRicieverDetails();
        this.getUserName(this.state.userID);
        this.getData();
    }

    updateStatus = () => {
        db.collection("AllBarters").add({
            itemName: this.state.itemName,
            itemDetails: this.state.itemDetails,
            requestID: this.state.requestID,
            RequestedBy: this.state.RecieverName,
            DonarID: this.state.userID,
            RequestStatus: 'Donar Intrested',
        })
    }

    addNotifications = () => {
        var message = this.state.userName + " Has Shown Intrest In Donating The Item";
        db.collection("AllNotification").add({
            "UserID": this.state.recieverID,
            "itemName": this.state.itemName,
            "requestID": this.state.requestID,
            "date": firebase.firestore.FieldValue.serverTimestamp(),
            "message": message,
            "DonarID": this.state.userID,
            "NotificationStatus": 'Unread',
        })
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container} >
                    <View>
                        <Card
                            title={"ItemInformation"}
                            titleStyle={{ fontSize: 20, }}
                        >
                            <Card>
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(25), textAlign: 'center' }}>itemName: {this.state.itemName}</Text>
                            </Card>
                            <Card>
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(15), textAlign: 'center', marginTop: RFValue(15) }}>itemDetails: {this.state.itemDetails}</Text>
                            </Card>
                            <Card>
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(15), textAlign: 'center', marginTop: RFValue(15) }}>ReasonToRequest: {this.state.reasonToRequest}</Text>
                            </Card>
                            <Card>
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(25), textAlign: 'center' }}>Item Price: {this.state.itemPrice}</Text>
                            </Card>
                        </Card>
                    </View>
                    <View>
                        <Card
                            title={"RecieverInformation"}
                            titleStyle={{ fontSize: 20, }}
                        >
                            <Card>
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(20), textAlign: 'center', marginTop: RFValue(30) }}>RecieverName: {this.state.RecieverName}</Text>
                            </Card>
                            <Card>
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(20), textAlign: 'center', marginTop: RFValue(30) }}>RecieverAdress: {this.state.RecieverAdress}</Text>
                            </Card>
                            <Card>
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(20), textAlign: 'center', marginTop: RFValue(30) }}>RecieverContact: {this.state.RecieverContact}</Text>
                            </Card>
                        </Card>

                    </View>
                    <View style={styles.buttonContainer} >
                        {
                            this.state.recieverID !== this.state.userID ?
                                <TouchableOpacity onPress={() => {
                                    this.addNotifications();
                                    this.updateStatus();
                                    this.props.navigation.navigate("MyBarters");
                                }} style={styles.button} >
                                    <Text>Exchange</Text>
                                </TouchableOpacity>
                                : null
                        }
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, },
    buttonContainer: { flex: 0.3, justifyContent: 'center', alignItems: 'center' },
    button: { width: 200, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: 'orange', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, elevation: 16, shadowOpacity: 0.44, shadowRadius: 10.32, elevation: 16, }
})