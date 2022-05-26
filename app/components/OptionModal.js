import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from 'react-native';
import color from '../misc/color';
const { width } = Dimensions.get('window');

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
const OptionModal = ({ visible, currentItem, onClose }) => {
  return (
    <>
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent visible={visible}>
          <View style={styles.modal}>
            <Text style={styles.title}>عنوان : {currentItem.title}</Text>
            <Text style={styles.title}>
              تاریخ انتشار : {convertDate(currentItem.date)}
              {console.log(currentItem)}
            </Text>
            <Text style={styles.title}>پوستر / کاور :</Text>
            <Image
              style={styles.tinyLogo}
              source={{
                uri: currentItem.artwork,
              }}
            />
          </View>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalBg} />
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    fontFamily: 'iranYekan',
  },
  title: {
    fontFamily: 'iranYekan',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 0,
    color: color.FONT_MEDIUM,
    textAlign: 'right',
  },

  modal: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    paddingBottom: 20,
    backgroundColor: color.APP_BG,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
  },
  modalBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG,
  },
  tinyLogo: {
    alignSelf: 'center',
    marginTop: 20,
    width: width - 30,
    height: width - 30,
  },
});

export default OptionModal;
