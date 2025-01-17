import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Button, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// const { width, height } = Dimensions.get('window');

const initial = {
  latitude: 13.7563,
  longitude: 100.5018,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const MyMap = ({ selectedTrip, tripOrder, setTripOrder }) => {
 
  const [region, setRegion] = useState(initial);
  const mapRef = useRef(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false); 
  const [markerPositions, setMarkerPositions] = useState([]);
  const [isDisplayedName, setIsDisplayedName] = useState([]);
  const interactionCount = useRef(0); 

  const MAX_UPDATES = 5;
    //fix infinite loop

  const resetInteractionCounter = () => {
    interactionCount.current = 0;
  };

  useEffect(() => {
    if (isUserInteracting) {
      console.log(isUserInteracting, 'true')
      resetInteractionCounter();
    } else {
      console.log(isUserInteracting, 'false')
    }

  }, [isUserInteracting])

  useEffect(() => {
    if (selectedTrip) {
      const transformedMarkers = transformPlaces(selectedTrip.items);
      const newRegion = calculateInitialRegion(transformedMarkers);
      setRegion(newRegion);

      const tripId = Object.keys(tripOrder);
      const updates = {};
      
      tripId.forEach((id) => {
        updates[id] = false;
      });
      
      setIsDisplayedName((prev) => ({ ...prev, ...updates }));
      
  
      if (mapRef.current && newRegion) {
        mapRef.current.animateToRegion(newRegion, 1000);
        setTimeout(() => {
          calculateMarkerPositions(transformedMarkers);
        }, 500); // Delay to ensure the map has updated
      }
    }
  }, [selectedTrip, tripOrder]);

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

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleRegionChange = debounce((newRegion) => {
    setIsUserInteracting(true); // User is interacting with the map
    setRegion(newRegion);
  }, 50);

  const handleRegionChangeComplete = (newRegion) => {
    interactionCount.current += 1;

    // Check if updates should stop
    console.log(interactionCount, 'count')
    if (interactionCount.current > MAX_UPDATES) {
      console.log('Maximum updates reached. Ignoring further changes.');
      return;
    }

    setIsUserInteracting(false); // User is interacting with the map
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
  const calculateMarkerPositions = async (placesToUse, ) => {
    if (mapRef.current) {
      try {
        const positions = await Promise.all(placesToUse.map(async (place) => {
          const value = tripOrder[place.id]?.value;
          const subLevel = tripOrder[place.id]?.subLevel;
          const id = place.id;
    
          try {
            const point = await mapRef.current.pointForCoordinate(place.coordinate);
            return { ...point, title: place.title, id: place.id, value, subLevel };

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

    return {
      latitude: midLatitude,
      longitude: midLongitude,
      latitudeDelta,
      longitudeDelta,
    };
  };

  const handleZoomIn = () => {
    setIsUserInteracting(true);
    // Decrease the latitudeDelta and longitudeDelta for zooming in
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const handleZoomOut = () => {
    setIsUserInteracting(true);
    // Increase the latitudeDelta and longitudeDelta for zooming out
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  const handleClickPin = (id) => {
    setIsDisplayedName((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));

  }

  return (
    <View style={styles.container}>
      {/* Render the MapView */}
      {region && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}  // Use controlled region state
          onRegionChange={handleRegionChange}
          onRegionChangeComplete={handleRegionChangeComplete}  // Recalculate positions on region change
          scrollEnabled={true}  // Disable dragging
        />
      )}
  
      {/* Render the marker positions as overlays on the map */}
      {markerPositions
      .sort((a,b) => Number(a.value) - Number(b.value))
      .map((position, index) => (
        <View
          key={index}
          style={[
            styles.location,
            {
              top: position.y - 20, // Adjust for pin size
              left: position.x - 20, // Adjust for pin size
            },
          ]}
        >
          <View style={styles.customPinContainer}>
            <TouchableOpacity onPress={()=> handleClickPin(position.id)}>
              <Text style={styles.customPin}>📍</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.nameContainer}>
            {isDisplayedName[position.id] && (
              <Text style={styles.nameLabel}>
                {position.title}
              </Text>
            )}
          </View>
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
  location: {
    position: 'absolute', // Detach from the layout
    alignItems: 'center', // Center the pin horizontally
  },
  customPinContainer: {
    position: 'relative', // Keep relative for positioning the absolute children
  },
  customPin: {
    fontSize: 18,
    color: 'blue',
  },
  nameLabel: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -60 }], // Adjust based on width
    width: 100,
    textAlign: 'center',
    fontSize: 12,
    backgroundColor: 'white', // Clean, neutral background
    color: 'black', // High contrast for readability
    padding: 5, 
    borderRadius: 5, // Optional: for a smoother appearance
    shadowColor: '#000', // Optional: shadow for better visibility
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    zIndex: 10, // Ensure it stays above other elements
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