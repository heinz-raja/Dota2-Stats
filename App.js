import {createStackNavigator,createAppContainer} from 'react-navigation'
import HomeScreen from "./Components/Home/HomeScreen"
import Profile from "./Components/Profile/Profile"
import Search from "./Components/Search/Search"
import * as firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCDdZlzz6Fc7SbkR1zCEzqQEf6sHLgTfDg",
    authDomain: "dota-stats-2b116.firebaseapp.com",
    databaseURL: "https://dota-stats-2b116.firebaseio.com",
    projectId: "dota-stats-2b116",
    storageBucket: "dota-stats-2b116.appspot.com",
    messagingSenderId: "195372653850"
}

firebase.initializeApp(firebaseConfig)

const MainNavigator = createStackNavigator({

    HomeScreen: {screen: HomeScreen},
    Profile: {screen: Profile},
    Search: {screen: Search}
    },

    {
        initialRouteName: 'HomeScreen',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#262626',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);

const App = createAppContainer(MainNavigator)

export default App