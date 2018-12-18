import React, { Component } from 'react';
import { Alert,StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import images from '../../assets/rank_icons/index'

import Swipeout from 'react-native-swipeout'

import * as firebase from 'firebase'

//Test
var Players = [
	368892412, //Arnav
	112139042, //Atul
	361505820, //Dadul
	360284493, //Kenny
	360065851, //Yash
	152398358,  //Me
	40813418   //Edge case
]

var medals = [images.no_rank, images.herald, images.guardian, images.crusader, images.archon, images.legend, images.ancient, images.divine, images.immortal]
var stars = [images.star_1, images.star_2, images.star_3, images.star_4, images.star_5]

var currUser
var Friends=[]

class HomeScreen extends Component {

	static navigationOptions=({navigation}) => ({
			headerTitle: "Friends",
			headerRight: <TouchableOpacity onPress={() => {navigation.navigate('Search')}}><Text style={{margin: 8,fontSize:19,color:"#FFF",fontWeight:"bold"}}
								>Add</Text></TouchableOpacity>
	});

	constructor() {
		super()
		this.state = {
			friends: Friends,
			playerObjects: [],
			delRow: null,
			isLoading: true
		}
	}

	renderItem = ({ item,index }) => {
		var medal = medals[Math.floor(item.rank_tier / 10)]
		var star = stars[(item.rank_tier - (Math.floor(item.rank_tier / 10) * 10)) - 1]
		const swipeSettings = {
			autoClose: true,
			backgroundColor: '#333333',
			onClose: (secId, rowId, dir) => {
		
			},
			onOpen: (secId, rowId, dir) => {
		
			},
			left: [
				{
					onPress: () => {
						const delrow = item.profile.account_id
						Alert.alert(
							'Alert',
							'Are you sure you want to delete ?',
							[
								{text: 'No', style:'cancel'},
								{text: 'Yes', onPress: () => {
									cPlayerObjects = this.state.playerObjects
									var currUser = firebase.auth().currentUser
									firebase.database().ref(currUser.uid).child('friends').orderByChild('id').equalTo(delrow).once('value',snapshot => {
										snapshot.forEach(function(snap){
											if(snap.exists){
												console.log(snap)
												snap.ref.remove()											
											}
										})
										
									})
									cPlayerObjects.splice(index,1)
									this.setState({
										playerObjects: cPlayerObjects,
										delRow: delrow
									})
									
								}}
							],
							{cancellable: true}
						)
					},
					text: 'Delete',type: 'delete'
				}
			],
			rowId: this.props.index,
		}
		return (
			<Swipeout {...swipeSettings}>
				<TouchableWithoutFeedback onPress={() => {
					this.props.navigation.navigate('Profile', {
						playerId: item.profile.account_id,
						playerName: item.profile.personaname,
					});
				}}>
					
						<View style={{ flex: 1, flexDirection: 'row', marginBottom: 3 }}>
							<ImageBackground
								style={{ height: 50, width: 50, marginTop: 5, marginLeft: 3 }}
								source={star}>
								<Image style={{ width: 50, height: 50 }}
									source={medal} />
							</ImageBackground>
							<Image style={{ width: 50, height: 50, margin: 3 }}
								source={{ uri: item.profile.avatarfull }} />

							<View style={{ flex: 1, justifyContent: 'center' }}>
								<Text style={{ fontSize: 16, color: '#fff', marginTop: 1 }}>
									{item.profile.personaname}
								</Text>
								<Text style={{ fontSize: 14, color: '#666666' }}>
									mmr:{item.mmr_estimate.estimate}(estimate)
								</Text>
							</View>
						</View>
				</TouchableWithoutFeedback>
			</Swipeout>
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

	getPlayerObjects = () =>{
		var url = 'https://api.opendota.com/api/players/'
		var i, tplayerObjects = []
		console.log(this.state.friends.length)
		for (i = 0; i < this.state.friends.length; i++) {
			fetch(url + this.state.friends[i])
				.then((response) => response.json())
				.then((responseJson) => {
					tplayerObjects.push(responseJson)
					if (tplayerObjects.length == (this.state.friends.length)) {
						this.setState({
							playerObjects: tplayerObjects,
							isLoading: false
						})
					}
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	getFriends = async() => {
		var obj = this

		firebase.database().ref(currUser.uid).child('friends').on('value',function(data){
			var newData = []
			data.forEach(function(childdata) {
				newData.push(childdata.val().id)
			})
			
			obj.setState({
				friends: newData
			},() => obj.getPlayerObjects())
		})
	}

	

	componentDidMount() {

		if(firebase.auth().currentUser == null){
			firebase.auth().signInAnonymously()
			.then(() => {
				currUser = firebase.auth().currentUser
				this.getFriends()
			})
		}
		else{
			currUser = firebase.auth().currentUser
			
		}
	}

	render() {
		const { navigate } = this.props.navigation;
		
		if(this.state.isLoading&&(!this.state.playerObjects||this.state.playerObjects.length==0)){
			return(
				<View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#333333'}}>
					<Text style={{fontSize:18,color:'#FFF'}}>Add some friends to get started</Text>
				</View>
			)
		}
		return (
			this.state.isLoading
				?
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#333333' }}>
					<ActivityIndicator size="large" color="fff" />
					<Text style={{ color: '#fff' }}>Loading</Text>
				</View>
				:
				<View style={styles.container}>
					<FlatList
						data={this.state.playerObjects.sort((a,b) => a.profile.personaname.localeCompare(b.profile.personaname))}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => item.profile.account_id.toString()}
						ItemSeparatorComponent={this.listSeparator}
					/>
				</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#333333'
	},
});



export default HomeScreen