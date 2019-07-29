import React from 'react'
import {StyleSheet, View, Text, Picker} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import ActionButton from 'react-native-action-button'
import Sound from 'react-native-sound'
import Icon from 'react-native-vector-icons/Ionicons'
import Slider from 'react-native-slider'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: "stretch",
    justifyContent: "center",
    backgroundColor: '#ffffff'
  },
  containerSlider: {
    margin: 25,
    alignItems: "stretch",
    backgroundColor: '#ffffff'
  },
  actionButtonIcon: {
    fontSize: 35,
    height: 35,
    color: 'white'
  }
})

export default class Settings extends Component.Component {
    state = {
      unit: 'second(s)',
      interval: 1,
      qualityPercentage: 1
    }
    
  // Send the interval data to AsyncStorage
  saveIntervalData = async (value) => {
    try {
      await AsyncStorage.setItem('interval', JSON.stringify(value))
      .then(this.setState({interval: Math.round(value * 10) / 10}))
    } catch (error) {
      alert(error)
    }
  }
  // Send interval unit data to AsyncStorage
  saveUnitData = async (value) => {      
    try {
      await AsyncStorage.setItem('unit', value)
      .then(this.setState({unit: value}))
    } catch (error) {
      alert(error)
    }
  }
  // Send image quality settings to ASyncStorage
  saveQualityPercentage = async (value) => {
    try {
      await AsyncStorage.setItem('qualitypercentage', JSON.stringify(value))
      .then(this.setState({qualityPercentage: value}))
    } catch (error) {
      alert(error)
    }
  }

  componentDidMount() {
    // Declare button sound
    soundbutton = new Sound('button.mp3', null, (error) => {
      if (error) {
        alert(error)
      }
    })
    // Get data from AsyncStorage
    getData = async () => {
      try {
        const value = await AsyncStorage.getItem('interval')
        if(value !== null) {
          let numberDecimalValue = parseFloat(value)
          this.setState({interval: Math.round(numberDecimalValue * 10) / 10})
        }
      } catch(error) {
        alert(error)
      }
      try {
        const value = await AsyncStorage.getItem('unit')
        if(value !== null) {
          this.setState({unit: value})
        }
      } catch(error) {
        alert(error)
      }
      try {
        const value = await AsyncStorage.getItem('qualitypercentage')
        if(value !== null) {
          let percentageDecimalValue = parseFloat(value)
          this.setState({qualityPercentage: percentageDecimalValue})
        }
      } catch(error) {
        alert(error)
      }
      }
    getData()
      }

   render() {
    return (
      <View style={styles.container}>
      {/* Slider region start */}
      <View style={styles.containerSlider}>
      <Slider
          step={0.1}
          minimumValue={0.2}
          maximumValue={10}
          minimumTrackTintColor='#f12d33'
          maximumTrackTintColor='#faaeb0'
          thumbTintColor='#f12d33'
          value={this.state.interval}
          onValueChange={value => this.saveIntervalData(value)}
      />
      <Text>
        Make a picture every {this.state.interval} {this.state.unit}
      </Text>
      <Slider
          step={0.01}
          minimumValue={0.01}
          maximumValue={1}
          minimumTrackTintColor='#f12d33'
          maximumTrackTintColor='#faaeb0'
          thumbTintColor='#f12d33'
          value={this.state.qualityPercentage}
          onValueChange={value => this.saveQualityPercentage(value)}
      />
      <Text>
        Picture quality: {parseInt(this.state.qualityPercentage * 100)} %
      </Text>
      <Picker
        selectedValue={this.state.unit}
        style={{height: 50, width: 150}}
        onValueChange={this.saveUnitData}>
        <Picker.Item
        label="Seconds"
        value="second(s)"/>
        <Picker.Item
        label="Minutes"
        value="minute(s)" />
      </Picker>
      </View>
      {/* Slider region end */}

      {/* Action button region start */}
        <ActionButton size={80} useNativeFeedback={false} buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item useNativeFeedback={false} buttonColor='#1abc9c' title="Cam" onPress={ () => {this.props.switchScreen()
          soundbutton.play()}}>
            <Icon name="md-camera" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      {/* Action button region end */}
      </View>
    )
  }
}
