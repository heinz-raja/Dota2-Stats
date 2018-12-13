import React, { Component } from 'react';
import {View,Text,Keyboard} from 'react-native'
import SearchHeader from './SearchHeader'
import SearchResuls from './SearchResults'


class Search extends Component{

    static navigationOptions ={
        header: null
    }

    state = {
        searchPlayer: '',
        playerData: [],
        searchcomplete: false
    }

    playerSearch = () => {
        Keyboard.dismiss()
        const playerName = this.state.searchPlayer.toLocaleLowerCase()
        const query = 'https://api.opendota.com/api/search?q=' + playerName
        fetch(query)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                playerData: responseJson,
                searchcomplete: true
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:"#333333"}}>
                <SearchHeader
                    value = {this.state.searchPlayer}
                    onChangeText={(searchPlayer) => this.setState({searchPlayer})}   
                    playerSearch={this.playerSearch} 
                />
                {this.renderResults()}
            </View>
        )
    }

    renderResults = () => {
        if(this.state.searchcomplete){
            if(this.state.playerData.length == 0)
                return (
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#FFF',fontSize:18}}>No Results found</Text>
                    </View>
                )
            return <View style={{flex:1}}>
                            <SearchResuls playerData={this.state.playerData}
                                navigation={this.props.navigation}/>
                    </View>
        }
    }
}

export default Search