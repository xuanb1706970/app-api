import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {Camera} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [faces, setFaces] = useState([])

    const faceDetector = ({faces}) =>{
      if (faces.length >= 0){
        setFaces(faces)
      }
    }

    useEffect(()=>{
      (async()=>{
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    return(
      <View style = {{flex: 1}}>
        <Camera style={styles.camera}
                type='front'
                onFacesDetected={faceDetector}
                faceDetectorSettings={{
                  mode: FaceDetector.Constants.Mode.fast,
                  detectLandmarks: FaceDetector.Constants.Landmarks.all,
                  runClassifications: FaceDetector.Constants.Classifications.none,
                }}>
        </Camera>

        <View style={styles.ViewButton}>     
          <TouchableOpacity style={styles.button1}
              onPress={() => this.snap(false)}>
              <Text
                  style={{ fontSize: 18, marginBottom: 5, color: 'black', textAlign: 'center'}}>
                  {' '}Enroll{' '}
              </Text>
            </TouchableOpacity>
            
            <Text style={{ color: 'black' }}>{`Faces in view: ${faces.length}`}</Text>

            <TouchableOpacity style={styles.button2}
              onPress={() => this.snap(true)}>
                  <Text
                      style={{ fontSize: 18, marginBottom: 5, color: 'black', textAlign: 'center' }}>
                      {' '}Recognize{' '}
                  </Text>
              </TouchableOpacity>
          </View>  
      </View>  
    );

}  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between'
    
  },
  ViewButton:{
    width: '100%',
    height: '10%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#5D5E5C'
  },
  button1:{
    width: '25%',
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 20
    
  },
  button2:{
    backgroundColor: 'white',
    width: '25%',
    borderRadius: 5,
    margin: 20
  }
});

