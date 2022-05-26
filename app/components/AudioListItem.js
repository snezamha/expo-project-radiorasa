import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import color from '../misc/color';
const convertDate = (date) => {
  // const toTimestamp = (strDate) => {
  //   const dt = Date.parse(strDate);
  //   return dt / 1000;
  // };
  if (date) {
    var moment = require('moment-jalaali');
    var change = moment(date).format('jYYYY/jM/jD');
    return change;
  }
};
const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying)
    return (
      <Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT} />
    );
  return <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />;
};

const AudioListItem = ({
  title,
  date,
  onOptionPress,
  onAudioPress,
  isPlaying,
  activeListItem,
}) => {
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: activeListItem
                    ? color.ACTIVE_BG
                    : color.FONT_LIGHT,
                },
              ]}
            >
              <Text style={styles.thumbnailText}>
                {activeListItem ? (
                  renderPlayPauseIcon(isPlaying)
                ) : (
                  <MaterialIcons name="radio" size={18} color="black" />
                )}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              <Text style={styles.dateText}>
                تاریخ انتشار : {convertDate(date)}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer}>
          <Entypo
            onPress={onOptionPress}
            name="dots-three-vertical"
            size={30}
            color={color.FONT_LIGHT}
            style={{ padding: 0 }}
          />
        </View>
      </View>
      <View style={styles.separator} />
    </>
  );
};
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: width - 80,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    backgroundColor: color.FONT_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: color.FONT,
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'iranYekan',
    color: color.FONT,
    textAlign: 'right',
  },
  separator: {
    width: width - 80,
    backgroundColor: '#333',
    opacity: 0.2,
    height: 0.5,
    alignSelf: 'center',
    margin: 10,
  },
  dateText: {
    fontFamily: 'iranYekanFaNum',
    fontSize: 12,
    color: color.FONT_LIGHT,
    textAlign: 'right',
  },
});

export default AudioListItem;
