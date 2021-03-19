import * as React from 'react';
import { View, Text } from 'react-native-tailwind';
import SectionHeading from './SectionHeading';
import { StyleSheet, Switch, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Collapsible from 'react-native-collapsible';
import { Icon } from 'react-native-elements';
import BaseInput from './BaseInput';
import RecurringSchedule from './RecurringSchedule';

export default function FormTree(props) {
  const { field, worksite, children, onUpdate } = props;
  const [showChildren, setShowChildren] = React.useState(true);

  const getSelectValuesList = (field) => {
    if (field.values) {
      return field.values.map((item) => {
        return {
          value: item.value,
          label: item.name_t,
        };
      });
    }
    return Object.keys(field.values_default_t).map((key) => {
      return {
        value: key,
        label: field.values_default_t[key],
      };
    });
  };

  React.useEffect(() => {
    if (field.if_selected_then_work_type) {
      setShowChildren(
        Boolean(
          worksite.dynamicFields && worksite.dynamicFields[field.field_key],
        ),
      );
    } else if (!field.if_selected_then_work_type && field.html_type === 'h5') {
      setShowChildren(true);
      return;
    }

    const hasSelectedChildren = field.children.some((childField) => {
      return (
        childField.if_selected_then_work_type &&
        Boolean(
          worksite.dynamicFields &&
            worksite.dynamicFields[childField.field_key],
        )
      );
    });
    if (hasSelectedChildren) {
      setShowChildren(true);
    }
  }, [worksite]);

  const renderField = (field) => {
    if (field.html_type === 'h4') {
      return (
        <SectionHeading count={field.order_label}>
          <Text style={{ fontSize: 20 }}>{field.label_t}</Text>
        </SectionHeading>
      );
    }
    if (field.html_type === 'h5') {
      return (
        <TouchableOpacity
          onPress={() => {
            const newVal = !showChildren;
            onUpdate(field.field_key, newVal);
            setShowChildren(newVal);
          }}
        >
          <View
            className="flex flex-row items-center justify-between py-1"
            style={styles.formField}
          >
            <Text style={{ fontSize: 18 }}>{field.label_t}</Text>
            <Icon
              name={showChildren ? 'caret-up' : 'caret-down'}
              type="font-awesome-5"
              size={15}
            />
          </View>
        </TouchableOpacity>
      );
    }
    if (field.html_type === 'select') {
      return (
        <RNPickerSelect
          style={pickerSelectStyles}
          placeholder={{
            label: field.label_t,
            value: null,
          }}
          value={worksite.dynamicFields[field.field_key]}
          onValueChange={(value) => onUpdate(field.field_key, value)}
          items={getSelectValuesList(field)}
          Icon={() => {
            return <Icon name="sort" type="font-awesome-5" size={15} />;
          }}
        />
      );
    }

    if (field.html_type === 'checkbox') {
      return (
        <View className="flex flex-row items-center justify-between py-1">
          <Text>{field.label_t}</Text>
          <Switch
            value={worksite.dynamicFields[field.field_key]}
            onValueChange={(value) => onUpdate(field.field_key, value)}
          />
        </View>
      );
    }
    if (field.html_type === 'text') {
      //undefined needs to be replaced with empty string
      if(!field.value) field.value = "";
      return (
        <BaseInput
          style={styles.formField}
          placeholder={field.label_t}
          value={worksite.dynamicFields[field.field_key]}
          onChangeText={(value) => onUpdate(field.field_key, value)}
        />
      );
    }
    if (field.html_type === 'cronselect') {
      return <RecurringSchedule style={styles.formField} field={field} />;
    }
    if (field.html_type === 'textarea') {
      return (
        <BaseInput
          multiline={true}
          numberOfLines={4}
          style={{ ...styles.formField, height: 100 }}
          placeholder={field.label_t}
          value={worksite.dynamicFields[field.field_key]}
          onChangeText={(value) => onUpdate(field.field_key, value)}
        />
      );
    }
    return null;
  };
  return (
    <View>
      {renderField(field)}
      {showChildren && (
        <View>
          {field.children &&
            field.children.map((item, index) => (
              <FormTree
                key={index}
                children={field.children}
                field={item}
                worksite={worksite}
                onUpdate={onUpdate}
              />
            ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formField: {
    marginVertical: 5,
  },
  divider: {
    marginVertical: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  iconContainer: {
    top: 25,
    right: 15,
  },
  inputIOS: {
    ...styles.formField,
    height: 50,
    padding: 10,
    borderColor: '#dadada',
    borderWidth: 1,
  },
  inputAndroid: {
    ...styles.formField,
    height: 50,
    padding: 10,
    borderColor: '#dadada',
    borderWidth: 1,
  },
});
