import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
// @ts-ignore
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import { View, Text } from 'react-native-tailwind';
import { Input, ListItem } from 'react-native-elements';
import BaseInput from './BaseInput';
import SearchIcon from '../assets/images/search.svg';
import CancelIcon from '../assets/images/clear.svg';
import { searchWorksites } from '../api/worksites';
import Geocoder from '../services/Geocoder.service';
import { useSelector } from 'react-redux';
import { SvgCss } from 'react-native-svg';
import { getWorkTypeImage } from '../utils/worksite';

const { width: WindowWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  loggedInDesc: {},
  itemView: {
    paddingBottom: 10,
    paddingTop: 10,
    width: WindowWidth,
    borderBottomColor: '#000',
  },
  listItemSubtitle: {
    color: '#fff',
  },
});

function Item({ item }) {
  return (
    <TouchableOpacity onPress={() => {}}>
      <ListItem
        title={item.description}
        // subtitle={item.description}
      />
    </TouchableOpacity>
  );
}

const AutoComplete = (props) => {
  const [showSearch, setShowSearch] = React.useState(false);
  const [worskiteResults, setWorksiteResults] = useState([]);
  const [geocoderResults, setGeocoderResults] = useState([]);
  const [search, setSearch] = useState('');
  const incidentStore = useSelector((state) => state.incidents);
  const fetchSuggestions = async () => {
    if (!search) {
      setWorksiteResults([]);
      setGeocoderResults([]);
      return;
    }

    const searchResults = await searchWorksites(search, incidentStore.incident);
    const addressResults = await Geocoder.getMatchingAddressesGoogle(
      search,
      '12343535',
    );
    setWorksiteResults(searchResults);
    setGeocoderResults(addressResults);
  };
  // const debounceLoadData = useCallback(debounce(fetchSuggestions, 300), []);
  const handleInput = async (text) => {
    setSearch(text);
    props.onChangeText(text);
    await fetchSuggestions();
  };

  return (
    <View>
      {!showSearch && (
        <BaseInput {...props} onFocus={() => setShowSearch(true)} />
      )}
      <Modal
        animationType="slide"
        visible={showSearch}
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowSearch(false);
        }}
      >
        <SafeAreaView
          className="flex flex-grow"
          style={{ backgroundColor: 'white', overflow: 'visible' }}
        >
          <View className="flex flex-row items-center p-3">
            <View className="pr-2">
              <SearchIcon width={15} height={15} />
            </View>
            <TextInput
              placeholder={'Search for user'}
              onChangeText={handleInput}
              value={search}
              underlineColorAndroid="transparent"
              autoFocus={true}
              style={{ flexGrow: 1, fontSize: 18 }}
            />
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                props.onChangeText('');
                setShowSearch(false);
              }}
            >
              <CancelIcon width={15} height={15} />
            </TouchableOpacity>
          </View>

          <View className="flex-grow" style={{ overflow: 'visible' }}>
            {Boolean(worskiteResults.length) && (
              <View>
                <Text>Worksite Results</Text>
                {worskiteResults.map((item) => {
                  return (
                    <TouchableOpacity>
                      <ListItem
                        title={item.address}
                        subtitle={item.name}
                        leftElement={
                          <SvgCss
                            width="30"
                            height="30"
                            xml={getWorkTypeImage(item.work_types[0])}
                          />
                        }
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {Boolean(geocoderResults.length) && (
              <View>
                <Text>Geocoder Results</Text>
                {geocoderResults.map((item) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        props.onSelectGeocode(item);
                        setShowSearch(false);
                      }}
                    >
                      <ListItem title={item.description} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default AutoComplete;
