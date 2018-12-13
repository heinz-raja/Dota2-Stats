import React, {Component} from 'react'
import {View,Text,StyleSheet,FlatList,Image,TouchableWithoutFeedback,TouchableOpacity} from 'react-native'

import * as firebase from 'firebase'

var curruser = {}


class SearchResults extends Component{
    
    addToFriends = async(account_id) => {
        curruser = await firebase.auth().currentUser
        var okTopush = true

        var uff = await firebase.database().ref(curruser.uid).child('friends')

        var friends = await firebase.database().ref(curruser.uid).child('friends').orderByChild('id').equalTo(account_id).once("value",snapshot => {
            if(snapshot.exists()){
                alert("Already a friend")
                okTopush = false
            }
        })

        if (okTopush) {
            var databaseRef = await uff.push()
            databaseRef.set({
                'id': account_id
            })
            alert("Added to friend list")
        }
    }
    renderItem = ({item}) => {
            return (
                <View style={{flex:1,flexDirection:'row'}}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.props.navigation.navigate('Profile', {
                                playerId: item.account_id,
                                playerName: item.personaname,
                            });
                        }}>
                        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 3,justifyContent: 'space-between' }}>
                            <View style={{flex:1,flexDirection:'row'}}>
                                <Image style={{ width: 50, height: 50, margin: 3 }}
                                    source={{ uri: item.avatarfull }} />

                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 16, color: '#fff', marginTop: 1 }}>
                                        {item.personaname}
                                    </Text>
                                    <Text style={{ fontSize: 14, color: '#666666' }}>
                                        ID:{item.account_id}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableOpacity 
                        onPress={() => this.addToFriends(item.account_id)} >
                        <View style={{marginTop:10,marginRight:15}}>
                            <Image style={{height:35,width:35}}source={require('../../assets/add_outline.png')}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                </View>
            )
    }
    listSeparator = () => {
		return (
			<View style={{ alignItems: 'center' }}>
				<View
					style={{ height: 1, width: '85%', backgroundColor: '#555555' }}>
				</View>
			</View>
		)
	}
    render(){
        return(
            <View style={{flex:1}}>
                <FlatList
                    data={this.props.playerData}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => item.account_id.toString()}
                    ItemSeparatorComponent={this.listSeparator}
                />
            </View>
        )
    }
}

const style = StyleSheet.create({
    image:{
        height: 50,
        width: 50,
    }
})
export default SearchResults