import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native'
import heroes from '../../heroes.json'
import images from '../../assets/rank_icons/index'

var medals = [images.no_rank, images.herald, images.guardian, images.crusader, images.archon, images.legend, images.ancient, images.divine, images.immortal]
var stars = [images.star_1, images.star_2, images.star_3, images.star_4, images.star_5]

let isMounted = false

class Profile extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('playerName')
        };
    };

    constructor() {
        super();
        this.state = { 
            wins: 0,
            loss: 0,
            rad_wins: 0,
            rad_loss: 0,
            dire_wins: 0,
            dire_loss: 0,
            cour_kills: 0,
            obs_bought: 0,
            sentries_bought: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
            rapiers_bought: 0,
            tp_bought: 0,
            denies: 0,
            last_hits: 0,
            gems_bought: 0,
            pings: 0,
            time_played: 0,
            tower_kills: 0,
            neutral_klls: 0,
            best_heroes: [],
            hero_images: [],
            playerObject:{},
            statsLoaded:false,
        }
    }

    componentWillUnmount(){
        isMounted = false
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    componentDidMount() {

        const { navigation } = this.props
        const playerId = navigation.getParam('playerId')
        let newState = Object.assign({},this.state)
        var url = 'https://api.opendota.com/api/players/' + playerId 
        var i
        isMounted = true
        fetch(url+'/wl')
        .then((response) => response.json())
        .then((responseJson) => {
            newState.wins = responseJson.win
            newState.loss = responseJson.lose
            fetch(url+'/wl?is_radiant=1')
            .then((response) => response.json())
            .then((responseJson) => {
                newState.rad_wins = responseJson.win
                newState.rad_loss = responseJson.lose
                fetch(url+'/totals')
                .then((response) => response.json())
                .then((responseJson) => {
                    newState.kills = this.numberWithCommas(responseJson[0].sum)
                    newState.deaths = this.numberWithCommas(responseJson[1].sum)
                    newState.assists = this.numberWithCommas(responseJson[2].sum)
                    newState.last_hits = this.numberWithCommas(responseJson[6].sum)
                    newState.denies = this.numberWithCommas(responseJson[7].sum)
                    newState.time_played = responseJson[9].sum
                    newState.tower_kills = this.numberWithCommas(responseJson[15].sum)
                    newState.neutral_klls = this.numberWithCommas(responseJson[16].sum)
                    newState.cour_kills = this.numberWithCommas(responseJson[17].sum)
                    newState.tp_bought = this.numberWithCommas(responseJson[18].sum)
                    newState.obs_bought = this.numberWithCommas(responseJson[19].sum)
                    newState.sentries_bought = this.numberWithCommas(responseJson[20].sum)
                    newState.gems_bought = responseJson[21].sum
                    newState.rapiers_bought = this.numberWithCommas(responseJson[22].sum)
                    newState.pings = this.numberWithCommas(responseJson[23].sum)
                    newState.dire_loss = newState.loss - newState.rad_loss
                    newState.dire_wins = newState.wins - newState.rad_wins
                    newState.statsLoaded = true
                    fetch(url+'/rankings')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        for(i=0;i<responseJson.length&&i<5;i++){
                            newState.best_heroes.push(responseJson[i])
                        }
                        for(i=0;i<5&&i<newState.best_heroes.length;i++){
                            hicon = (newState.best_heroes[i].hero_id)
                            console.log(heroes[hicon])
                            newState.hero_images.push(heroes[hicon].icon)
                        }
                        fetch(url)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            newState.playerObject = responseJson
                            if(isMounted){
                                this.setState(
                                    newState
                                )
                                
                            }
                        })
                    })
                    .catch((error) => {
                        console.log(error+0)
                    })
                    
                })
                .catch((error) => {
                    console.log(error+1)
                })
            })
            .catch((error) => {
                console.log(error+2)
            })
        })
        .catch((error) => {
            console.log(error+3)
        })
    }

    render() {
        if (this.state.statsLoaded) {
            const winperc = ((this.state.wins/(this.state.loss+this.state.wins))*100).toFixed(1)
            const rwinperc = ((this.state.rad_wins/(this.state.rad_loss+this.state.rad_wins))*100).toFixed(1)
            const dwinperc = ((this.state.dire_wins/(this.state.dire_loss+this.state.dire_wins))*100).toFixed(1)
            const obs_image = require('../../assets/wards/obs_ward.png')
            const sent_image = require('../../assets/wards/sen_ward.png')
            const gem_image = require('../../assets/wards/Gem_of_True_Sight_icon.png')
            const tp_image = require('../../assets/wards/Town_Portal_Scroll_icon.png')
            const rapier_image = require('../../assets/wards/Divine_Rapier_icon.png')
            const medal = medals[Math.floor(this.state.playerObject.rank_tier / 10)]
            console.log(this.state)
		    const star = stars[(this.state.playerObject.rank_tier - (Math.floor(this.state.playerObject.rank_tier / 10) * 10)) - 1]
            return (
                <View style={style.container}>
                    <View style={style.summary}>
                        <Image style={style.image}
                            source={{ uri: this.state.playerObject.profile.avatarfull }} />
                        <View>
                            <View style={{flex:1,flexDirection:'row',marginTop:18}}>
                                <View>
                                    <Text style={[style.text, { color: '#00ff00', fontSize: 22}]}>{this.numberWithCommas(this.state.wins)}</Text>
                                    <Text style={[style.text, { color: '#fff' }]}>Wins</Text>
                                </View>
                                <View style={{marginLeft:8,marginRight:8}}>
                                    <Text style={[style.text, { color: '#ff0000', fontSize: 22 }]}>{this.numberWithCommas(this.state.loss)}</Text>
                                    <Text style={[style.text, { color: '#fff' }]}>Loss</Text>
                                </View>
                                <View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{fontSize:13,color:'#FFF'}}>Win Rate:</Text>
                                        <Text style={{fontSize:13,color:'#c9c9c9'}}>{winperc}%</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{fontSize:13,color:'#FFF'}}>Radiant: </Text>
                                        <Text style={{fontSize:13,color:'#c9c9c9'}}>{rwinperc}%</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{fontSize:13,color:'#FFF'}}>Dire:</Text>
                                        <Text style={{fontSize:13,color:'#c9c9c9'}}>{dwinperc}%</Text>
                                    </View>
                                </View>
                            </View> 
                        </View>
                        <View style={[style.medal,{marginTop:8,marginLeft:2}]}>
                            <ImageBackground
                                style={[style.image, { margin: 0,height:65,width:65 }]}
                                source={star}>
                                <Image style={[style.image, { margin: 0,height:65,width:65 }]}
                                    source={medal} />
                            </ImageBackground>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <View>
                            <Text style={style.desc}>{this.state.kills}</Text>
                            <Text style={style.text}>Kills</Text>
                        </View>
                        <View>
                            <Text style={style.desc}>{this.state.assists}</Text>
                            <Text style={style.text}>Assists</Text>
                        </View>
                        <View>
                            <Text style={style.desc}>{this.state.deaths}</Text>
                            <Text style={style.text}>Deaths</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{marginLeft:10,marginTop:8}}>
                            <Text style={[style.text,{fontSize:18}]}>Purchases</Text>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 8 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={{ width: 40, height: 40 }} source={obs_image} />
                                    <Text style={[style.text, { marginLeft: 8, marginTop: 8 }]}>{this.state.obs_bought}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={{ width: 40, height: 40 }} source={sent_image} />
                                    <Text style={[style.text, { marginLeft: 8, marginTop: 8 }]}>{this.state.sentries_bought}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 8 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={{ width: 40, height: 40 }} source={gem_image} />
                                    <Text style={[style.text, { marginLeft: 8, marginTop: 8 }]}>{this.state.gems_bought}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={{ width: 40, height: 40 }} source={tp_image} />
                                    <Text style={[style.text, { marginLeft: 8, marginTop: 8 }]}>{this.state.tp_bought}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 8 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={{ width: 40, height: 40 }} source={rapier_image} />
                                    <Text style={[style.text, { marginLeft: 8, marginTop: 8 }]}>{this.state.rapiers_bought}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <View>
                                    <Text style={style.desc}>{this.state.neutral_klls}</Text>
                                    <Text style={style.text}>Neutrals killed</Text>
                                </View>
                                <View>
                                    <Text style={style.desc}>{this.state.last_hits}</Text>
                                    <Text style={style.text}>Last Hits</Text>
                                </View>
                                <View>
                                    <Text style={style.desc}>{this.state.denies}</Text>
                                    <Text style={style.text}>Denies</Text>
                                </View> 
                                <View>
                                    <Text style={style.desc}>{this.state.pings}</Text>
                                    <Text style={style.text}>Pings</Text>
                                </View>                        
                            </View>
                        </View>
                    </View>
                    <View style={{marginLeft:10,marginTop:8}}>
                            <Text style={[style.text,{fontSize:18}]}>Best Heroes</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <Image style={{ height: 40, width: 40 }}
                            source={{ uri: "http://cdn.dota2.com" + this.state.hero_images[0] }} />
                        <Image style={{ height: 40, width: 40 }}
                            source={{ uri: "http://cdn.dota2.com" + this.state.hero_images[1] }} />
                        <Image style={{ height: 40, width: 40 }}
                            source={{ uri: "http://cdn.dota2.com" + this.state.hero_images[2] }} />
                        <Image style={{ height: 40, width: 40 }}
                            source={{ uri: "http://cdn.dota2.com" + this.state.hero_images[3] }} />
                        <Image style={{ height: 40, width: 40 }}
                            source={{ uri: "http://cdn.dota2.com" + this.state.hero_images[4] }} />
                    </View>
                </View>
            )
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#333333' }}>
					<ActivityIndicator size="large" color="fff" />
					<Text style={{ color: '#fff' }}>Loading</Text>
			</View>
        )
    }

}

const style = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#333333',
    },
    summary: {
        flexDirection:'row',
        justifyContent:'space-between',
        height: 100,
        width: '100%'
    },
    image:{
        width:80,
        height:80,
        margin:8
    },
    medal:{
        margin:8
    },
    text:{
        fontSize: 15,
        color:'#FFF'
    },
    desc:{
        fontSize: 22,
        color: '#a9a9a9'
    }
})

export default Profile