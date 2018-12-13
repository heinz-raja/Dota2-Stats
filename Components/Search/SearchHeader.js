import React, { Component } from 'react';
import {StatusBar} from 'react-native'

import {Header, Item, Icon, Input} from 'native-base'

class SearchHeader extends Component{
    render(){
        const barheight = StatusBar.currentHeight
        return(
            <Header
                style={{height:80,backgroundColor:'#222222',marginTop: barheight}}
                searchBar
                rounded
            >
                <Item>
                    <Icon name='ios-search'/>
                    <Input
                        placeholder='Enter player name or Steam ID'
                        onChangeText={this.props.onChangeText}
                        returnKeyType='search'
                        onSubmitEditing =  {this.props.playerSearch}
                    />
                </Item>
            </Header>
        )
    }
}

export default SearchHeader