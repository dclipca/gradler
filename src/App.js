import React from 'react';
import Cam from './Cam'
import Settings from './Settings'
import {StyleSheet, View} from 'react-native'
import Permissions from 'react-native-permissions'



const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})


export default class App extends React.Component {
    state = {
      displayCam: true
    }

    // Switch to camera or settings
    switchScreen = () => {
      this.setState( 
        {displayCam: !this.state.displayCam}
        )
    }
    
  render() {
    return (
      <View style={styles.container}>
      {(this.state.displayCam == true) ?
      <Cam switchScreen={this.switchScreen}/> : 
      <Settings switchScreen={this.switchScreen}/>}
      </View>
    )
  }
}
