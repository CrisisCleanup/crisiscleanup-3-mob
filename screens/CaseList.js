import * as React from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { View, Text } from 'react-native-tailwind';
import { templates, colors } from '../icon_templates';
import { SvgCss } from 'react-native-svg';
import MarkerIcon from '../assets/images/marker.svg';

export default function CaseList(props) {
  const getWorkTypeImage = (workType) => {
    const colorsKey = `${workType.status}_${
      workType.claimed_by ? 'claimed' : 'unclaimed'
    }`;
    const worksiteTemplate = templates[workType.work_type] || templates.unknown;
    const svgColors = colors[colorsKey];

    if (svgColors) {
      return worksiteTemplate
        .replace('{{fillColor}}', svgColors.fillColor)
        .replace('{{strokeColor}}', svgColors.strokeColor)
        .replace('{{multiple}}', '');
    }
    return null;
  };

  const getWorkTypeColors = (workType) => {
    const colorsKey = `${workType.status}_${
      workType.claimed_by ? 'claimed' : 'unclaimed'
    }`;
    const svgColors = colors[colorsKey];
    if (svgColors) {
      return {
        fillColor: svgColors.fillColor,
        strokeColor: svgColors.strokeColor,
      };
    }
    return null;
  };

  function getRenderItem() {
    return ({ item }) => {
      return (
        <View className="bg-white my-1" key={item.id}>
          <View className="flex-1">
            <View className="flex-1 flex-row items-center p-2 border-b border-gray-300">
              <Text className="font-bold text-xl mr-3">{item.case_number}</Text>
              {item.work_types.length && (
                <View className="flex-1 flex-row">
                  {item.work_types.map((wt) => (
                    <View
                      className="px-2 py-1 rounded-full mx-1"
                      style={{
                        backgroundColor:
                          getWorkTypeColors(wt) &&
                          `${getWorkTypeColors(wt).fillColor}3D`,
                      }}
                    >
                      <SvgCss
                        width="25"
                        height="25"
                        xml={getWorkTypeImage(wt)}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View className="flex flex-row items-center px-2">
              <MarkerIcon/>
              <Text style={styles.item}>{item.name}</Text>
            </View>
            <View className="flex flex-row items-center px-2">
              <MarkerIcon/>
              <Text style={styles.item}>{item.address}</Text>
            </View>
          </View>
        </View>
      );
    };
  }

  return (
    <FlatList
      data={props.worksites}
      renderItem={getRenderItem()}
      initialNumToRender={5}
      removeClippedSubviews={true}
      windowSize={10}
      keyExtractor={(item) => String(item.id)}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    fontSize: 16,
    paddingHorizontal: 5,
    paddingVertical: 5
  },
});
