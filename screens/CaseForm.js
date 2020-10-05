import * as React from 'react';
import { View, Text } from 'react-native-tailwind';
import SectionHeading from '../components/SectionHeading';
import BaseInput from '../components/BaseInput';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AutoComplete from '../components/Autocomplete';
import { Divider, Icon } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from '../services/Geocoder.service';
import { nest } from '../utils/array';
import { sortBy } from 'lodash';
import FormTree from '../components/FormTree';
import { createWorksite, updateWorksite } from '../api/worksites';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { getErrorMessage } from '../utils/errors';

const CaseForm = ({ route, navigation, showActionSheetWithOptions }) => {
  const win = Dimensions.get('window');
  const [worksite, setWorksite] = React.useState({
    dynamicFields: {},
  });
  const [fieldTree, setFieldTree] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const setWorksiteValue = (key, value) => {
    worksite[key] = value;
    setWorksite({ ...worksite });
  };

  const setWorksiteDynamicValue = (key, value) => {
    worksite.dynamicFields[key] = value;
    setWorksite({ ...worksite });
    console.log(worksite);
  };

  const setAddressFields = async (addressResult) => {
    const geocodeKeys = ['address', 'city', 'county', 'state', 'postal_code'];
    const geocode = await Geocoder.getDetails(addressResult.place_id);
    geocodeKeys.forEach((key) =>
      setWorksiteValue(key, geocode.address_components[key]),
    );
    const { lat, lng } = geocode.location;
    setWorksiteValue('location', {
      type: 'Point',
      coordinates: [lng, lat],
    });
  };

  const getDyanamicFields = (worksite) => {
    if (!worksite.form_data) {
      return {};
    }

    return worksite.form_data.reduce((obj, item) => {
      return {
        ...obj,
        [item.field_key]: item.field_value,
      };
    }, {});
  };

  React.useEffect(() => {
    function fieldTree() {
      const formFields = route.params.incident.form_fields;
      setFieldTree(sortBy(nest(formFields), (o) => o.list_order));
    }
    if (route.params.incident && route.params.incident.form_fields) {
      fieldTree();
    }
  }, [route.params.incident]);

  const findPotentialGeocode = async () => {
    const geocodeKeys = ['address', 'city', 'county', 'state', 'postal_code'];
    const nonEmptyKeys = geocodeKeys.filter((key) => Boolean(worksite[key]));
    if (nonEmptyKeys.length > 1) {
      const values = nonEmptyKeys.map((key) => worksite[key]);
      const address = values.join(', ');
      const [addressResult] = await Geocoder.getMatchingAddressesGoogle(
        address,
      );
      setAddressFields(addressResult);
    }
  };

  const saveWorksite = async (reload = true) => {
    // const isValid = this.$refs.form.reportValidity();
    // if (!isValid) {
    //   this.$log.debug('worksite failed to save, invalid.');
    //   return;
    // }

    // if (this.location) {
    //   this.updateWorksite(
    //       {
    //         type: 'Point',
    //         coordinates: [
    //           this.location.coords.longitude,
    //           this.location.coords.latitude,
    //         ],
    //       },
    //       'location',
    //   );
    //
    //   const what3words = await What3wordsService.getWords(
    //       this.location.coords.latitude,
    //       this.location.coords.longitude,
    //   );
    //   this.updateWorksite(what3words, 'what3words');
    // }
    const fieldData = worksite.dynamicFields;

    const truthyValues = Object.keys(fieldData).filter((key) => {
      return (
        Boolean(fieldData[key]) &&
        route.params.incident.form_fields
          .map((field) => field.field_key)
          .includes(key)
      );
    });

    const formData = truthyValues.map((key) => {
      return {
        field_key: key,
        field_value: fieldData[key],
      };
    });

    setWorksiteValue('form_data', formData);

    if (worksite.id) {
      const data = { ...worksite, skip_duplicate_check: true };
      delete data.flags;
      delete data.dynamicFields;
      const savedWorksite = await updateWorksite(data);
      setWorksite({
        ...savedWorksite,
        dynamicFields: getDyanamicFields(savedWorksite),
      });
    } else {
      const data = {
        ...worksite,
        incident: route.params.incident.id,
        skip_duplicate_check: true,
      };
      delete data.flags;
      delete data.dynamicFields;
      const savedWorksite = await createWorksite(data);
      setWorksite({
        ...savedWorksite,
        dynamicFields: getDyanamicFields(savedWorksite),
      });
    }
    // await this.$toasted.success(this.$t('caseForm.new_case_success'));
    // this.dirtyFields = new Set();
    // if (reload) {
    //   this.$emit('reloadTable');
    //   this.$emit('reloadMap', this.worksite.id);
    //   this.$emit('savedWorksite', this.worksite);
    // }
  };

  const onSaveActionSheet = () => {
    const options = ['Save', 'Save & Claim', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          try {
            setLoading(true);
            await saveWorksite();
            setLoading(false);
            navigation.navigate('Cases', {});
          } catch (e) {
            Alert.alert(
              'Validation Error',
              getErrorMessage(e),
              [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
              { cancelable: true },
            );
          } finally {
            setLoading(false);
          }
        }
        if (buttonIndex === 1) {
          try {
            setLoading(true);
            await saveWorksite();
            setLoading(false);
            navigation.navigate('Cases', {});
          } catch (e) {
            Alert.alert(
              'Validation Error',
              getErrorMessage(e),
              [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
              { cancelable: true },
            );
          } finally {
            setLoading(false);
          }
        }
      },
    );
  };

  navigation.setOptions({
    headerRight: () => <Button onPress={onSaveActionSheet} title="Save" />,
  });

  return (
    <ScrollView
      nestedScrollEnabled={true}
      style={{ backgroundColor: 'white', width: win.width }}
    >
      {loading && (
        <View style={styles.loadingStyle}>
          <ActivityIndicator />
        </View>
      )}
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          alignSelf: 'stretch',
          flex: 1,
          position: 'relative',
        }}
      >
        <SectionHeading>
          <Text style={{ fontSize: 20 }}>
            Property and Personal Information
          </Text>
        </SectionHeading>
        <BaseInput
          style={styles.formField}
          placeholder="Resident Name"
          onChangeText={(text) => setWorksiteValue('name', text)}
        />
        <BaseInput
          style={styles.formField}
          placeholder="Phone"
          onChangeText={(text) => setWorksiteValue('phone1', text)}
        />
        <BaseInput
          style={styles.formField}
          placeholder="Email"
          onChangeText={(text) => setWorksiteValue('email', text)}
        />
        <Divider style={styles.divider} />
        <View className="flex flex-row justify-between items-center">
          <Text className="font-bold text-base">Location</Text>
          <Button
            title="Show on map"
            type="clear"
            icon={<Icon name="arrow-right" size={15} color="white" />}
            titleStyle={{ fontSize: 15 }}
          />
        </View>
        <AutoComplete
          style={styles.formField}
          placeholder="Address"
          value={worksite.address}
          onChangeText={(text) => setWorksiteValue('address', text)}
          onSelectGeocode={setAddressFields}
        />
        <BaseInput
          style={styles.formField}
          placeholder="City"
          value={worksite.city}
          onChangeText={(text) => setWorksiteValue('city', text)}
          onBlur={findPotentialGeocode}
        />
        <BaseInput
          style={styles.formField}
          placeholder="County"
          value={worksite.county}
          onChangeText={(text) => setWorksiteValue('county', text)}
          onBlur={findPotentialGeocode}
        />
        <BaseInput
          style={styles.formField}
          placeholder="State"
          value={worksite.state}
          onChangeText={(text) => setWorksiteValue('state', text)}
          onBlur={findPotentialGeocode}
        />
        <BaseInput
          style={styles.formField}
          placeholder="Postal Code"
          value={worksite.postal_code}
          onChangeText={(text) => setWorksiteValue('postal_code', text)}
          onBlur={findPotentialGeocode}
        />
        <BaseInput
          style={styles.formField}
          placeholder="What 3 Words"
          onChangeText={(text) => setWorksiteValue('What 3 Words', text)}
        />
        {worksite.location && (
          <MapView
            style={{ height: 150, width: '100%' }}
            initialRegion={{
              latitude: worksite.location.coordinates[1],
              longitude: worksite.location.coordinates[0],
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}
          >
            <Marker
              coordinate={{
                latitude: worksite.location.coordinates[1],
                longitude: worksite.location.coordinates[0],
              }}
            />
          </MapView>
        )}

        {fieldTree &&
          fieldTree.map((field) => (
            <FormTree
              worksite={worksite}
              field={field}
              key={field.field_key}
              onUpdate={setWorksiteDynamicValue}
            />
          ))}
        {/*<Text>{route.params.incident && JSON.stringify(fieldTree)}</Text>*/}
      </View>
    </ScrollView>
  );
};
export default connectActionSheet(CaseForm);

const styles = StyleSheet.create({
  formField: {
    marginVertical: 5,
  },
  divider: {
    marginVertical: 10,
  },
});
