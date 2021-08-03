import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration } from 'react-native';
import {Camera} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as MediaLibrary from 'expo-media-library';
import CameraButton from './component/CameraButton';
import FlipButton from './component/CameraFlipBtn';
import axios from 'axios';



export default class App extends React.Component{
    constructor(){
      super()
      this.state = {
        hasCameraPermissions: true,
        type: Camera.Constants.Type.back,
        showSnapBtn: false,
        isLoading: false,
        isVibrating: false,
        faces: [],
        predict: [],
        isPreview: false,
        path: []
      }
      this.camera = null
      this.onFlip = this.onFlip.bind(this)
      this.faceDetector = this.faceDetector.bind(this)
      this.takeSnap = this.takeSnap.bind(this)
    }

    async ComponentWillMount(){
      const {status} = await Camera.requestCameraPermissionsAsync()
      this.setState = {
        hasCameraPermissions:status === 'granted'
      }
    }

    onFlip() {
      this.setState({
        type: this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
      })
    }

    faceDetector = ({faces}) => {
      if(faces.length > 0){
        if(!this.state.isVibrating){
          Vibration.vibrate(100)
        }
        this.setState({showSnapBtn: true, isVibrating: true})
      }else{
        this.setState({showSnapBtn: false, isVibrating: false})
      }
    }

    async takeSnap(){
      if(this.camera){
        const options = { quality: 0.5, base64: true, mirrorImage: true };
        let photo = await this.camera.takePictureAsync(options)
        try{
          var formdata = new FormData()
          formdata.append('image',{
            uri: photo.uri,
            name: 'picture.jpg', 
            type: 'image/jpg' 
          })
          const config = {
            method: 'POST',
            body: formdata
          };
  
          const url = 'https://service-face.herokuapp.com/';
          fetch(url,config)
          .then((response) => response.text())
          .then((responseEND)=>{
             let name = responseEND.substring()
             alert(name)
          })
          
        }catch (error){
          console.log('Failed to fetch products: ', error);
        }
        
      }
     }
    
  


  render(){
    const {showSnapBtn, type, hasCameraPermissions} = this.state;

    if(!hasCameraPermissions){
      return (<Text>Not Camerara</Text>)
    }

    return(
        <View style={styles.wrapper}>
            <Camera style={styles.wrapper}
                    ref={ref=>{this.camera = ref}}
                    type={type}
                    onFacesDetected={this.faceDetector}
                    faceDetectorSettings={{
                      mode: FaceDetector.Constants.Mode.fast
                    }}>
             
            <View style={styles.cameraContainer}>
                <FlipButton onPress={this.onFlip} type={type} />
                {showSnapBtn && <CameraButton iconName="camera" color="green" onPress={this.takeSnap} />}
            </View>
            </Camera>
        </View>
    );
  }

}

const styles = StyleSheet.create({

   wrapper: {
    flex: 1 
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: "space-between"
  }
});