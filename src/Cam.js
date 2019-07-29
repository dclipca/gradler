import React, {Component} from 'react';
import {StyleSheet, View, CameraRoll} from 'react-native'
import { RNCamera } from 'react-native-camera'
import Sound from 'react-native-sound'
import AsyncStorage from '@react-native-community/async-storage'
import Permissions from 'react-native-permissions'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'
import KeepAwake from 'react-native-keep-awake'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  button: {
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  actionButtonIcon: {
    fontSize: 35,
    height: 35,
    color: 'white',
  },
  buttonLeft: {
    marginRight: 100,
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});


export default class Cam extends Component {
    state = {
      interval: 1,
      intervalInMiliseconds: 1000,
      unit: 'second(s)',
      qualityPercentage: 1,
      camType: 'front',
      cameraModeOn: false
    }

  componentDidMount() {
    // Activate sleep resistance
    KeepAwake.activate()

    // Declare button sound
    soundbutton = new Sound('button.mp3', null, (error) => {
      if (error) {
        alert(error)
      }
    })

    // Declare photo sound
    photosound = new Sound('photo.mp3', null, (error) => {
      if (error) {
        alert(error)
      }
    })

    // Get data from AsyncStorage
    getData = async () => {
      try {
        const value = await AsyncStorage.getItem('unit')
        if(value !== null) {
          this.setState({unit: value})
        }
      } catch(error) {
        alert(error)
      }

      try {
        const value = await AsyncStorage.getItem('interval')
        if(value !== null) {
          let numberDecimalValue = parseFloat(value)
          this.setState({interval: numberDecimalValue})
        }
      } catch(error) {
        alert(error)
      }

      try {
        if (this.state.unit == 'second(s)') {this.setState({intervalInMiliseconds: this.state.interval * 1000})}
        if (this.state.unit == 'minute(s)') {this.setState({intervalInMiliseconds: this.state.interval * 1000 * 60})}    
      
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

  componentWillUnmount() {
  // Deactivate sleep resistance
  KeepAwake.deactivate()

  // Deactivate setInterval loop
  clearInterval(this.isTakingPictures)
  }

  // Request storage permission
  requestStorage = async function() {
    Permissions.check('storage').then(response => {
      if (response != 'authorized') {
        Permissions.request('storage')
      }
    })
  }

  // Take a picture and send it to CameraRoll
  takePicture = async function() {
    if (this.camera) {
      photosound.play()
      const data = await this.camera.takePictureAsync({ quality: this.state.qualityPercentage, base64: true, fixOrientation: true })
      CameraRoll.saveToCameraRoll(data.uri)
    }
  }

  // Empty method
  doNothing() {}

  // Reverse camera source (from front to back and vice versa)
  swapCamType = () => {
    if (this.state.camType == "front") {
      this.setState({camType: "back"})
    }
    else {
      this.setState({camType: "front"})
    }
  }

  // Start the picture-taking loop
  startCameraMode = () => {
    this.isTakingPictures = setInterval(() => this.takePicture(), this.state.intervalInMiliseconds)
  }

  // Deactivate the picture-taking loop
  stopCameraMode = () => {
    clearInterval(this.isTakingPictures)
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {this.camera = ref}}
          style={{
            flex: 1,
            width: '100%',
            position: 'relative'
          }}
          type={this.state.camType}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />

          <ActionButton
          size={80}
          useNativeFeedback={false}
          buttonColor="rgba(231,76,60,1)"
          autoInactive={false}
          onPress={this.requestStorage}>
            <ActionButton.Item
            useNativeFeedback={false}
            buttonColor='#1abc9c'
            title="Change Cam"
            onPress={() => {
            this.swapCamType()
            soundbutton.play()
            }}>
              <Icon name="md-redo"
              style={styles.actionButtonIcon}
              />
            </ActionButton.Item>
            <ActionButton.Item
            useNativeFeedback={false}
            buttonColor='#1abc9c'
            title="Settings"
            onPress={() => {
            this.props.switchScreen()
            soundbutton.play()}}>
              <Icon
              name="md-settings"
              style={styles.actionButtonIcon}
              />
            </ActionButton.Item>

            <ActionButton.Item
            useNativeFeedback={false}
            buttonColor='#1abc9c'
            title="Stop"
            onPress={() => {
            this.stopCameraMode()
            soundbutton.play()}}>
              <Icon
              name="ios-square"
              style={styles.actionButtonIcon}
              />
            </ActionButton.Item>
            <ActionButton.Item
            useNativeFeedback={false}
            buttonColor='#1abc9c'
            title="Start"
            onPress={() => {
            this.startCameraMode()
            soundbutton.play()}}>
              <Icon name="md-play"
              style={styles.actionButtonIcon}
              />
            </ActionButton.Item>
        </ActionButton>
      </View>
    )
  }
}
