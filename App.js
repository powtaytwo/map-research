import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import MapView from 'react-native-maps';
import {Marker, Polyline} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import {getPreciseDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';

export default function App() {
  const [subId, setSubId] = React.useState(null);
  const [startData, onChangeStartData] = React.useState({
    latitude: 48.8587741,
    longitude: 2.2069771,
  });
  const [endData, onChangeEndData] = React.useState({
    latitude: 48.8587741,
    longitude: 2.2069771,
  });
  const [currentlocation, setCurrentLocation] = React.useState(null);

  const initialRegion = {
    latitude: 48.8587741,
    longitude: 2.2069771,
    latitudeDelta: 0.0622,
    longitudeDelta: 0.0121,
  };
  const [coordinates] = React.useState([
    {
      latitude: 48.8587741,
      longitude: 2.2069771,
    },
    {
      latitude: 48.8323785,
      longitude: 2.3361663,
    },
  ]);
  const [markers, setMarkers] = React.useState([]);
  // const [initialValues, setInitialValues] = React.useState({
  //   latitude: 48.8587741,
  //   longitude: 2.2069771,
  //   latitudeDelta: 0.0622,
  //   longitudeDelta: 0.0121,
  // });

  const initialValues = {
    latitude: 48.8587741,
    longitude: 2.2069771,
    latitudeDelta: 0.0622,
    longitudeDelta: 0.0121,
  };

  const mapRef = React.createRef();

  // Geolocation.getCurrentPosition(pos => {
  //   const crd = pos.coords;
  //   initialValues.latitude = crd.latitude,
  //   initialValues.longitude = crd.longitude,
  //   initialValues.latitudeDelta = 0.0421,
  //   initialValues.longitudeDelta = 0.0421,
  // },);

  // useEffect(() => {
  //   Geolocation.getCurrentPosition(pos => {
  //     const crd = pos.coords;
  //     setInitialValues({
  //       latitude: crd.latitude,
  //       longitude: crd.longitude,
  //       latitudeDelta: 0.0421,
  //       longitudeDelta: 0.0421,
  //     });
  //   });
  // }, []);
  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        if (pos) {
          setCurrentLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        }
      },
      error => console.log('GetCurrentPosition Error', JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 10000},
    );
  };

  const watchPosition = () => {
    try {
      const watchID = Geolocation.watchPosition(
        pos => {
          setCurrentLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        error => console.log('WatchPosition Error', JSON.stringify(error)),
      );
      setSubId(watchID);
    } catch (error) {
      console.log('WatchPosition Error', JSON.stringify(error));
    }
  };

  const clearWatch = () => {
    subId !== null && Geolocation.clearWatch(subId);
    setSubId(null);
    // setCurrentLocation(null);
  };

  useEffect(() => {
    getCurrentPosition();
    // mapRef.current.animateToRegion(
    //   {
    //     latitude: currentlocation.latitude,
    //     longitude: currentlocation.longitude,
    //     latitudeDelta: 0.1,
    //     longitudeDelta: 0.1,
    //   },
    //   100,
    // );
  }, []);

  // useEffect(() => {
  //   watchPosition();

  //   return () => {
  //     clearWatch();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    // if (currentlocation) {
    //   mapRef.current.animateToRegion(
    //     {
    //       latitude: currentlocation.latitude,
    //       longitude: currentlocation.longitude,
    //       latitudeDelta: 0.1,
    //       longitudeDelta: 0.1,
    //     },
    //     100,
    //   );
    // } else

    if (startData) {
      mapRef.current.animateToRegion(
        {
          latitude: startData.latitude,
          longitude: startData.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        100,
      );
    } else {
      mapRef.current.animateToRegion(
        {
          latitude: endData.latitude,
          longitude: endData.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        100,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startData, endData, currentlocation]);

  return (
    <View style={styles.container}>
      {/*Render our MapView*/}
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType="hybrid"
        //specify our coordinates.
        initialRegion={initialValues}
        onPress={e =>
          setMarkers([...markers, {latlng: e.nativeEvent.coordinate}])
        }
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}>
        <Marker coordinate={startData} />
        <Marker coordinate={endData} pinColor="blue" />
        {/* need to comment out if map has not rendered yet */}
        {/* <Marker coordinate={currentlocation} pinColor="yellow" /> */}
        {markers.map((marker, i) => (
          <Marker
            coordinate={marker.latlng}
            key={i}
            pinColor="#841584"
            onPress={() =>
              setMarkers(markers.filter(item => item.latlng !== marker.latlng))
            }
          />
        ))}
        <MapViewDirections
          origin={startData}
          destination={endData}
          apikey="AIzaSyB9LUw2BcNiR-AR_SZFrCMH-X15fibnnxY"
          strokeColor="hotpink"
          strokeWidth={3}
        />
      </MapView>
      {/* <TextInput onChangeText={onChangeText} value={text} />
      <TextInput onChangeText={onChangeEndText} value={endtext} /> */}
      <GooglePlacesAutocomplete
        placeholder="Start Point"
        fetchDetails={true}
        onPress={(data, details = null) => {
          onChangeStartData({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          });
        }}
        query={{
          key: 'AIzaSyB9LUw2BcNiR-AR_SZFrCMH-X15fibnnxY',
          language: 'en',
        }}
        styles={{
          textInputContainer: {
            backgroundColor: 'grey',
            width: '95%',
          },
          textInput: {
            height: 38,
            color: '#5d5d5d',
            fontSize: 16,
          },
        }}
      />
      <GooglePlacesAutocomplete
        placeholder="End Point"
        fetchDetails={true}
        onPress={(data, details = null) => {
          onChangeEndData({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          });
        }}
        query={{
          key: 'AIzaSyB9LUw2BcNiR-AR_SZFrCMH-X15fibnnxY',
          language: 'en',
        }}
        styles={{
          textInputContainer: {
            backgroundColor: 'grey',
            width: '95%',
          },
          textInput: {
            height: 38,
            color: '#5d5d5d',
            fontSize: 16,
          },
        }}
      />
      <Text style={{color: 'red'}}>
        {getPreciseDistance(startData, endData, 1)}
      </Text>
      {/* need to comment out if map has not rendered yet */}
      {/* <Text style={{color: 'yellow'}}>
        {getPreciseDistance(currentlocation, endData, 1)}
      </Text> */}
      {/* <Text style={{color: 'white'}}>{JSON.stringify(subId)}</Text> */}
      {/* <Button
        onPress={getCurrentPosition}
        title="Get Current Position"
        color="#841584"
      /> */}
      {/* {subId !== null ? (
        <Button title="Clear Watch" onPress={clearWatch} />
      ) : (
        <Button title="Watch Position" onPress={watchPosition} />
      )} */}
    </View>
  );
}
//create our styling code:
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
