import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const initial = {
  latitude: 13.7563,
  longitude: 100.5018,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const MyMap = ({ selectedTrip }) => {
  console.log(selectedTrip, 'mymap')
  const [region, setRegion] = useState(initial);
  const mapRef = useRef(null);
  const [markerPositions, setMarkerPositions] = useState([]);

  useEffect(() => {
    if (selectedTrip) {
      const transformedMarkers = transformPlaces(selectedTrip.items);
      const newRegion = calculateInitialRegion(transformedMarkers);
      setRegion(newRegion);
  
      if (mapRef.current && newRegion) {
        mapRef.current.animateToRegion(newRegion, 1000);
        setTimeout(() => {
          calculateMarkerPositions(transformedMarkers);
        }, 500); // Delay to ensure the map has updated
      }
    }
  }, [selectedTrip]);

  const transformPlaces = (places) => {
    const transformedPlaces = places.map(place => ({
      id: place.id,
      coordinate: {
        latitude: place.lat,
        longitude: place.lng
      },
      title: place.name
    }));
    return transformedPlaces;
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion); 

    if (selectedTrip) {
      const transformedMarkers = transformPlaces(selectedTrip.items);
  
        mapRef.current.animateToRegion(newRegion, 1000);
        setTimeout(() => {
          calculateMarkerPositions(transformedMarkers);
        }, 100); 
    }
  };

  // Function to calculate the marker positions on the screen
  const calculateMarkerPositions = async (placesToUse) => {
    if (mapRef.current) {
      try {
        const positions = await Promise.all(placesToUse.map(async (place) => {
          try {
            const point = await mapRef.current.pointForCoordinate(place.coordinate);
            return { ...point, title: place.title };
          } catch (error) {
            console.error('Error calculating position:', error);
            return null;
          }
        }));
  
        setMarkerPositions(positions.filter(position => position !== null));
      } catch (error) {
        console.error('Unhandled error in calculateMarkerPositions:', error);
      }
    }
  };

  // Function to calculate initial region based on all marker coordinates
  const calculateInitialRegion = (markers) => {
    if (markers?.length === 0) return null;

    const latitudes = markers.map(marker => marker.coordinate.latitude);
    const longitudes = markers.map(marker => marker.coordinate.longitude);

    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);
    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);

    const midLatitude = (minLatitude + maxLatitude) / 2;
    const midLongitude = (minLongitude + maxLongitude) / 2;

    const latitudeDelta = (maxLatitude - minLatitude) + 0.02; // Add padding
    const longitudeDelta = (maxLongitude - minLongitude) + 0.02; // Add padding
    console.log(latitudeDelta, longitudeDelta, 'zoom');

    return {
      latitude: midLatitude,
      longitude: midLongitude,
      latitudeDelta,
      longitudeDelta,
    };
  };

  const handleZoomIn = () => {
    // Decrease the latitudeDelta and longitudeDelta for zooming in
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const handleZoomOut = () => {
    // Increase the latitudeDelta and longitudeDelta for zooming out
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  return (
    <View style={styles.container}>
      {/* Render the MapView */}
      {region && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}  // Use controlled region state
          onRegionChangeComplete={handleRegionChange}  // Recalculate positions on region change
          scrollEnabled={false}  // Disable dragging
        />
      )}
  
      {/* Render the marker positions as overlays on the map */}
      {markerPositions.map((position, index) => (
        <View
          key={index}
          style={[
            styles.customPin,
            {
              top: position.y - 20, // Adjust for pin size
              left: position.x - 20, // Adjust for pin size
            },
          ]}
        >
          <Text style={styles.pinText}>📍</Text>
          <Text style={styles.pinLabel}>{position.title}</Text>
        </View>
      ))}
  
      {/* Render Zoom Controls as an Overlay */}
      <View style={styles.zoomControls}>
        <Button title="+" onPress={handleZoomIn} />
        <Button title="-" onPress={handleZoomOut} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: 300,  // Adjust map height if needed
  },
  customPin: {
    position: 'absolute',  // Make the pins float on the map
    alignItems: 'center',
  },
  pinText: {
    fontSize: 18,
    color: 'blue',
  },
  pinLabel: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
    marginTop: -10,
  },
  zoomControls: {
    position: 'absolute',  // Make the zoom controls float on the map
    bottom: 10,  // Position near the bottom of the map
    right: 10,  // Align to the right
    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Slightly transparent background
    borderRadius: 5,
    padding: 5,  // Add some padding for spacing
    flexDirection: 'column',  // Stack the buttons vertically
  },
});

export default MyMap;