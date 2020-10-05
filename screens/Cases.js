import { Text, View } from 'react-native-tailwind';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as React from 'react';
import { Avatar, Icon, SearchBar } from 'react-native-elements';
import Map from './Map';
import CaseList from './CaseList';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { userProfileImage } from '../store/reducers';
import AddButton from '../assets/images/floating-add.svg';
import MapIcon from '../assets/images/notactive.svg';
import SearchIcon from '../assets/images/search.svg';
import TableIcon from '../assets/images/table.svg';

export default function Cases({ navigation }) {
  const [search, setSearch] = React.useState('');
  const [showingSearch, setShowingSearch] = React.useState(false);
  const [showingMap, setShowingMap] = React.useState(false);
  const [showingList, setShowingList] = React.useState(true);
  const incidentStore = useSelector((state) => state.incidents);
  const [incident, setIncident] = React.useState(null);
  const [IncidentIcon, setIncidentIcon] = React.useState(null);
  const [worksites, setWorksites] = React.useState([]);
  const authStore = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  React.useEffect(() => {
    async function loadIncident() {
      try {
        const response = await axios.get(
          `https://api.dev.crisiscleanup.io/incidents/${incidentStore.incident}`,
          {
            headers: {
              Authorization: 'Token 9455d55d653337cabf31942083e5a537b7f8189a',
            },
          },
        );

        setIncident(response.data);
        const incidentKey = response.data.incident_type.replace('_', '-');
        console.log(incidentKey);
        const url = `../assets/disaster_icons/${incidentKey}.svg`;
        const incidentIcon = await import('../assets/disaster_icons/virus.svg');

        console.log(incidentIcon.default);
        setIncidentIcon(incidentIcon.default);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      }
    }
    async function loadWorksites() {
      try {
        const response = await axios.get(
          `https://api.dev.crisiscleanup.io/worksites_all`,
          {
            params: { incident: incidentStore.incident },
            headers: {
              Authorization: 'Token 9455d55d653337cabf31942083e5a537b7f8189a',
            },
          },
        );

        setWorksites(response.data.results);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      }
    }

    if (incidentStore.incident) {
      loadWorksites();
      loadIncident();
    }
  }, [incidentStore.incident]);

  return (
    <View style={{ height: '100%' }}>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          position: 'absolute',
          bottom: 10,
          right: 10,
          height: 70,
          borderRadius: 100,
          zIndex: 1000,
        }}
        onPress={() => {
          navigation.navigate('CaseForm', {
            incident,
          });
        }}
      >
        <AddButton width={200} height={80} />
      </TouchableOpacity>
      {!showingSearch && (
        <View className="flex flex-row items-center justify-between py-2 px-2 bg-white">
          <View className="flex flex-row items-center w-3/4">
            {incident && IncidentIcon}
            <View className="w-full">
              <RNPickerSelect
                value={incidentStore.incident}
                placeholder={{
                  label: 'Select an Incident',
                  value: null,
                }}
                onValueChange={(item) =>
                  dispatch({ type: 'SET_CURRENT_INCIDENT', incident: item })
                }
                items={incidentStore.incidents.map((incident) => {
                  return { label: incident.name, value: incident.id };
                })}
                Icon={() => {
                  return (
                    <Icon name="caret-down" type="font-awesome-5" size={15} />
                  );
                }}
                style={{
                  iconContainer: {
                    top: 10,
                    right: 15,
                  },
                  inputIOS: {
                    fontSize: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    color: 'black',
                    paddingRight: 30, // to ensure the text is never behind the icon
                  },
                  inputAndroid: {
                    fontSize: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    color: 'black',
                    paddingRight: 30, // to ensure the text is never behind the icon
                  },
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserProfile');
            }}
          >
            <Avatar
              rounded
              source={{
                uri: userProfileImage(authStore),
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      {showingSearch && (
        <SearchBar
          lightTheme
          inputContainerStyle={{ height: 35 }}
          containerStyle={{ backgroundColor: '#fff' }}
          onClear={(text) => setSearch('')}
          onChangeText={(text) => setSearch(text)}
          value={search}
          platform={Platform.OS}
        />
      )}
      <View style={{ position: 'relative', height: '100%' }}>
        <View
          style={{ zIndex: 1000 }}
          className="flex flex-row items-center justify-end my-2"
        >
          <TouchableOpacity
            onPress={() => {
              setShowingMap(false);
              setShowingList(true);
            }}
          >
            <View className="p-3 border border-r-0 bg-white">
              <TableIcon width={20} height={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowingMap(true);
              setShowingList(false);
            }}
          >
            <View className="p-3 border border-r-0 bg-white">
              <MapIcon width={20} height={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowingSearch(!showingSearch);
            }}
          >
            <View className="p-3 border bg-white mr-1">
              <SearchIcon width={20} height={20} />
            </View>
          </TouchableOpacity>
        </View>
        {showingMap && (
          <View style={styles.mapStyle}>
            <Map worksites={worksites} />
          </View>
        )}
        {showingList && <CaseList worksites={worksites} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
