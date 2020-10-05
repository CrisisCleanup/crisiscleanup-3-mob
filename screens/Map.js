import * as React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useSelector } from 'react-redux';
import { colors, templates } from '../icon_templates';
import { SvgCss } from 'react-native-svg';

export default function Map(props) {
  const [mapZoom, setMapZoom] = React.useState(null);
  const [trackViewChanges, setTrackViewChanges] = React.useState(false);

  const getWorkTypeImage = (workType, zoom) => {
    const colorsKey = `${workType.status}_${
      workType.claimed_by ? 'claimed' : 'unclaimed'
    }`;
    let worksiteTemplate;
    if (!mapZoom || mapZoom < 10) {
      worksiteTemplate = templates.circle;
    } else {
      worksiteTemplate = templates[workType.work_type] || templates.unknown;
    }
    const svgColors = colors[colorsKey];

    if (svgColors) {
      return worksiteTemplate
        .replace('{{fillColor}}', svgColors.fillColor)
        .replace('{{strokeColor}}', svgColors.strokeColor)
        .replace('{{multiple}}', '');
    }
    return null;
  };

  const onRegionChange = (value) => {
    let zoom = Math.round(Math.log(360 / value.longitudeDelta) / Math.LN2);
    if (mapZoom < 10 && zoom >= 10) {
      setTrackViewChanges(true);
    } else if (mapZoom > 10 && zoom <= 10) {
      setTrackViewChanges(true);
    } else {
      setTrackViewChanges(false);
    }
    setMapZoom(zoom);
  };

  function getMarker(worksite) {
    return (
      <Marker
        coordinate={{
          latitude: worksite.location.coordinates[1],
          longitude: worksite.location.coordinates[0],
        }}
        key={worksite.id}
        tracksViewChanges={trackViewChanges}
        title={worksite.case_number}
        description={worksite.address}
      >
        <SvgCss
          width="40"
          height="40"
          xml={getWorkTypeImage(worksite.work_types[0], mapZoom)}
        />
      </Marker>
    );
  }

  return (
    <MapView
      style={styles.mapStyle}
      onRegionChange={onRegionChange}
      loadingEnabled={true}
    >
      {props.worksites.map((worksite) => getMarker(worksite))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
});
