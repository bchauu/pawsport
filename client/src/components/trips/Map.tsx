import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// Example static places data from Google Places API
const places = [
  { id: 1, coordinate: { latitude: 13.7563, longitude: 100.5018 }, title: 'Grand Palace' },
  { id: 2, coordinate: { latitude: 13.7468, longitude: 100.5341 }, title: 'Lumphini Park' },
  { id: 3, coordinate: { latitude: 13.7500, longitude: 100.4830 }, title: 'Wat Arun' },
  { id: 4, coordinate: { latitude: 13.7456, longitude: 100.5231 }, title: 'Siam Paragon' },
];

const initial = {
  latitude: 13.7563,
  longitude: 100.5018,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const MyMap = ({ selectedTrip }) => {
  const [region, setRegion] = useState(initial);
  const mapRef = useRef(null);
  const [markerPositions, setMarkerPositions] = useState([]);

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
    console.log(markerPositions, 'but not latest')
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

  useEffect(() => {
    // Calculate positions when the map is ready
    
    calculateMarkerPositions(places);
  }, []);

  useEffect(() => {
    if (selectedTrip) {
      const transformedMarkers = transformPlaces(selectedTrip.items);
      const newRegion = calculateInitialRegion(transformedMarkers);
      setRegion(newRegion);
  
      if (mapRef.current && newRegion) {
        mapRef.current.animateToRegion(newRegion, 1000);
        setTimeout(() => {
          calculateMarkerPositions(transformedMarkers);
        }, 100); // Delay to ensure the map has updated
      }
    }
  }, [selectedTrip]);

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region} // Use controlled region state  //changes as region changes --> center of map
          onRegionChangeComplete={handleRegionChange} // Recalculate positions on region change
        />
      )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: 200,
  },
  customPin: {
    position: 'absolute',
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
});

export default MyMap;