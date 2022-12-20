import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';

import { Camera, CameraType } from 'expo-camera';

import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  const camRef = useRef<null | any>(null);
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<undefined | string>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    requestPermission();
  }, []);

  const toggleCameraType = () => {
    setType((current) => current === CameraType.back ? CameraType.front : CameraType.back);
  };

  const takePicture = async () => {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
    }
  };

  if (hasPermission === null) {
    return <View />
  }

  if (!hasPermission) {
    return <Text>Access to camera denied</Text>
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={camRef}
      >
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraType}
          >
            <FontAwesome name="exchange" size={25} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={takePicture}
          >
            <FontAwesome name="camera" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
      <Modal
        animationType="slide"
        transparent
        visible={open}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setOpen(false)}
          >
            <FontAwesome name="close" size={50} color="#fff" />
          </TouchableOpacity>
          <Image style={styles.imgPhoto} source={{ uri: capturedPhoto }} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    height: '100%',
    width: '100%',
  },
  buttonsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  flipButton: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  photoButton: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 2,
    margin: 10,
  },
  imgPhoto: {
    width: '100%',
    height: 400,
  },
});
