import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Screen from '../components/Screen';
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import {
  play,
  pause,
  resume,
  playNext,
  moveAudio,
} from '../misc/audioController';
import { convertTime, storeAudioForNextOpening } from '../misc/helper';

const { width } = Dimensions.get('window');
const Player = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, currentAudio } = context;
  const calculateSeebBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }
    return 0;
  };
  useEffect(() => {
    context.loadPreviousAudio();
  }, []);
  const handlePlayPause = async () => {
    // play
    if (context.soundObj === null) {
      const audio = context.currentAudio;
      const status = await play(context.playbackObj, audio.uri);
      context.playbackObj.setOnPlaybackStatusUpdate(
        context.onPlaybackStatusUpdate
      );
      return context.updateState(context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: context.currentAudioIndex,
      });
    }
    // pause
    if (context.soundObj && context.soundObj.isPlaying) {
      const status = await pause(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: false,
      });
    }
    // resume
    if (context.soundObj && !context.soundObj.isPlaying) {
      const status = await resume(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: true,
      });
    }
  };

  const handleNext = async () => {
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isLastAudio =
      context.currentAudioIndex + 1 === context.totalAudioCount;
    let audio = context.audioFiles[context.currentAudioIndex + 1];
    let index;
    let status;

    if (!isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await play(context.playbackObj, audio.url);
      context.playbackObj.setOnPlaybackStatusUpdate(
        context.onPlaybackStatusUpdate
      );
    }

    if (isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await playNext(context.playbackObj, audio.url);
    }

    if (isLastAudio) {
      index = 0;
      audio = context.audioFiles[index];
      if (isLoaded) {
        status = await playNext(context.playbackObj, audio.url);
      } else {
        status = await play(context.playbackObj, audio.url);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObj: context.playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  };
  const handlePrevious = async () => {
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isFirstAudio = context.currentAudioIndex <= 0;
    let audio = context.audioFiles[context.currentAudioIndex - 1];
    let index;
    let status;

    if (!isLoaded && !isFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await play(context.playbackObj, audio.url);
      context.playbackObj.setOnPlaybackStatusUpdate(
        context.onPlaybackStatusUpdate
      );
    }

    if (isLoaded && !isFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await playNext(context.playbackObj, audio.url);
    }

    if (isFirstAudio) {
      index = context.totalAudioCount - 1;
      audio = context.audioFiles[index];
      if (isLoaded) {
        status = await playNext(context.playbackObj, audio.url);
      } else {
        status = await play(context.playbackObj, audio.url);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObj: context.playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  };
  const renderCurrentTime = () => {
    if (!context.soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };

  if (!context.currentAudio) return null;
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>
          {`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}
        </Text>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
            }}
          >
            <Text>
              {currentPosition ? currentPosition : renderCurrentTime()}
            </Text>
            <Text>{convertTime(playbackDuration / 1000)}</Text>
          </View>
          <Slider
            style={{ width: width - 25, height: 40, alignSelf: 'center' }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeebBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
            onValueChange={(value) => {
              setCurrentPosition(
                convertTime(value * (playbackDuration / 1000))
              );
            }}
            onSlidingStart={async () => {
              if (!context.isPlaying) return;

              try {
                await pause(context.playbackObj);
              } catch (error) {
                console.log('error inside onSlidingStart callback', error);
              }
            }}
            onSlidingComplete={async (value) => {
              await moveAudio(context, value);
              setCurrentPosition(0);
            }}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType="PREV" onPress={handlePrevious} />
            <PlayerButton
              onPress={handlePlayPause}
              style={{ marginHorizontal: 25 }}
              iconType={context.isPlaying ? 'PLAY' : 'PAUSE'}
            />
            <PlayerButton iconType="NEXT" onPress={handleNext} />
          </View>
        </View>
      </View>
    </Screen>
  );
};
export default Player;
const styles = StyleSheet.create({
  audioControllers: {
    width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
    paddingTop: 40,
  },
  audioCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  audioCount: {
    fontFamily: 'iranYekanFaNum',
    textAlign: 'right',
    color: color.FONT_LIGHT,
    fontSize: 14,
    padding: 15,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTitle: {
    fontFamily: 'iranYekan',
    fontSize: 16,
    color: color.FONT,
    padding: 15,
    textAlign: 'right',
  },
});
