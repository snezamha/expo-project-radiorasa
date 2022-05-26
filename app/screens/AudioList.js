import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import { pause, play, resume, playNext } from '../misc/audioController';
import { storeAudioForNextOpening } from '../misc/helper';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';

export class AudioList extends Component {
  static contextType = AudioContext;
  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
    };

    this.currentItem = {};
  }
  layoutProvider = new LayoutProvider(
    (i) => 'audio',
    (type, dim) => {
      switch (type) {
        case 'audio':
          dim.width = Dimensions.get('window').width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  handleAudioPress = async (audio) => {
    const { soundObj, playbackObj, currentAudio, updateState, audioFiles } =
      this.context;
    // playing audio for the first time.
    if (soundObj === null) {
      const playbackObj = new Audio.Sound();
      const status = await play(playbackObj, audio.url, audio.lastPosition);
      const index = audioFiles.indexOf(audio);
      updateState(this.context, {
        currentAudio: audio,
        playbackObj: playbackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      playbackObj.setOnPlaybackStatusUpdate(
        this.context.onPlaybackStatusUpdate
      );
      return storeAudioForNextOpening(audio, index);
    }

    // pause audio
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playbackObj);
      return updateState(this.context, { soundObj: status, isPlaying: false });
    }

    // if resume audio
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObj);
      return updateState(this.context, { soundObj: status, isPlaying: true });
    }

    // select another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.url);
      const index = audioFiles.indexOf(audio);

      updateState(this.context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return storeAudioForNextOpening(audio, index);
    }
  };
  componentDidMount() {
    this.context.loadPreviousAudio();
  }
  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.title}
        date={item.date}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };
  render() {
    return (
      <AudioContext.Consumer>
        {({ isDataLoading, dataProvider, isPlaying }) => {
          if (isDataLoading) {
            return (
              <View style={styles.container}>
                <ActivityIndicator />
                <Text style={styles.title}>
                  در حال بارگذاری می باشد. لطفا صبور باشید
                </Text>
              </View>
            );
          } else {
            if (!dataProvider._data.length) return null;
            return (
              <Screen>
                <RecyclerListView
                  dataProvider={dataProvider}
                  layoutProvider={this.layoutProvider}
                  rowRenderer={this.rowRenderer}
                  extendedState={{ isPlaying }}
                />
                <OptionModal
                  currentItem={this.currentItem}
                  onClose={() =>
                    this.setState({
                      ...this.state,
                      optionModalVisible: false,
                    })
                  }
                  visible={this.state.optionModalVisible}
                />
              </Screen>
            );
          }
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'iranYekan',
    marginTop: 10,
  },
});

export default AudioList;
