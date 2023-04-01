import React, {useCallback} from 'react';
import {View, StyleSheet, ScrollView, Image, Text} from 'react-native';

function CheckWalkScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollcontainer}>
      <View style={styles.container}>
        <View style={styles.titlecontainer}>
          <Text style={styles.title1}>4월 12일</Text>
          <Text style={styles.title2}>수요일 산책기록!</Text>
        </View>

        <View style={styles.imagecontainer}>
          <Image
            style={styles.image1}
            source={require('../assets/CheckWalkScreen.jpg')}
          />
        </View>

        <Text style={styles.time}>16:30 ~ 17:10pm</Text>
        <View style={styles.durationcontainer}>
          <Text style={styles.duration1}>40분</Text>
          <Text style={styles.duration2}>28초 동안</Text>
        </View>
        <View style={styles.distancecontainer}>
          <Text style={styles.distance1}>총 3km</Text>
          <Text style={styles.distance2}>산책했어요!</Text>
          <Image
            style={styles.image2}
            source={require('../assets/check.png')}
          />
        </View>
        <Image
          style={{
            width: 100,
            height: 100,
            marginTop: '20%',
            marginBottom: '40%',
          }}
          source={require('../assets/under.png')}
        />
      </View>
      {/* 두번째 화면 */}
      <View style={styles.container}>
        <View style={styles.firstcontainer}>
          <View style={styles.devide1}>
            <Text style={styles.summary1}>총 거리: 3.01 km</Text>
            <Text style={styles.summary1}>시간: 40분 30초</Text>
            <Text style={styles.summary1}>16:30:05 - 17:10:45</Text>
            <Text style={styles.summary1}>페이스: 13’30’’</Text>
          </View>
          <View style={styles.devide2}>
            <Image
              style={styles.image3}
              source={require('../assets/CheckWalkScreen.jpg')}
            />
          </View>
        </View>

        <View style={styles.secondcontainer}>
          <Text style={styles.energeLow1}>산책을 시작하고 </Text>

          <View style={styles.EnergeContainer1}>
            <Text style={styles.energeLow2_1}>25분</Text>
            <Text style={styles.energeLow2_2}>
              14초 후에 체력이 떨어졌어요.
            </Text>
          </View>

          <View style={styles.EnergeContainer2}>
            <Text style={styles.energeLow3_1}>2.1 km</Text>
            <Text style={styles.energeLow3_2}>를 기운차게 뛰었어요!</Text>
          </View>
        </View>

        <View style={styles.thirdcontainer}>
          <Text style={styles.month1}>이번달 산책기록!</Text>
          <Text style={styles.month2}>산책 횟수: 16회</Text>
          <Text style={styles.month2}>평균 산책 시간: 30분</Text>
          <Text style={styles.month2}>평균 산책 거리: 2.7km </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollcontainer: {
    // flex: 1, 스크롤 안되는 원인
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlecontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  title1: {
    width: 140,
    height: 40,
    fontFamily: 'Blinker-Bold',
    fontSize: 40,
    fontWeight: '900',
    fontStyle: 'normal',
    lineHeight: 40,
    textAlign: 'left',
    color: '#000000',
  },
  title2: {
    width: 200,
    height: 30,
    fontFamily: 'Blinker-Bold',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 50,
    textAlign: 'left',
    color: '#000000',
    marginLeft: -20,
  },
  imagecontainer: {
    width: 330,
    height: 330,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    backgroundColor: '#FFFF00',
  },

  image1: {
    width: 330,
    height: 330,
    borderRadius: 30,
    marginTop: 5,
    marginBottom: 5,
  },
  time: {
    width: 200,
    height: 30,
    fontFamily: 'Blinker-SemiBold',
    fontSize: 25,
    fontWeight: '600',
    lineHeight: 40,
    textAlign: 'left',
    color: '#000000',
    marginLeft: -120,
    marginTop: 20,
  },
  durationcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 7,
  },
  duration1: {
    fontSize: 50,
    width: 140,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '900',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000',
    marginLeft: -40,
  },
  duration2: {
    fontSize: 30,
    width: 200,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '800',
    textAlign: 'left',
    color: '#000000',
    marginLeft: -52,
  },
  distancecontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
  },
  distance1: {
    fontSize: 50,
    width: 140,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '900',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000',
    marginLeft: -35,
  },
  distance2: {
    fontSize: 30,
    width: 200,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '800',
    // fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000',
    marginLeft: -10,
  },
  image2: {
    width: 50,
    height: 50,
    marginLeft: -80,
    marginBottom: '10%',
  },
  firstcontainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: 50,
  },
  secondcontainer: {flex: 1, marginBottom: 50},
  thirdcontainer: {flex: 1, marginBottom: '20%'},
  devide1: {marginLeft: -230},
  devide2: {marginLeft: 10},
  summary1: {
    width: 400,
    height: 20,
    fontFamily: 'Blinker-SemiBold',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 20,
    textAlign: 'right',
    color: '#6A74CF',
  },
  image3: {width: 188, height: 186, borderRadius: 30},
  energeLow1: {
    fontSize: 28,
    width: 400,
    height: 40,
    lineHeight: 30,
    fontFamily: 'Blinker-Bold',
    fontWeight: '400',
    textAlign: 'left',
    color: '#000000',
    marginLeft: 150,
  },
  energeLow2_1: {
    fontSize: 50,
    width: 140,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '900',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000',
    marginLeft: 150,
  },
  energeLow2_2: {
    fontSize: 28,
    width: 400,
    height: 40,
    lineHeight: 61,
    fontFamily: 'Blinker-SemiBold',
    fontWeight: '900',
    textAlign: 'left',
    color: '#000000',
    marginLeft: -55,
  },
  energeLow3_1: {
    fontSize: 50,
    width: 140,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '900',
    textAlign: 'left',
    color: '#000000',
    marginLeft: 150,
  },

  energeLow3_2: {
    fontSize: 28,
    width: 400,
    height: 40,
    lineHeight: 55,
    fontFamily: 'Blinker-SemiBold',
    fontWeight: '900',
    textAlign: 'left',
    color: '#000000',
    marginLeft: -15,
  },
  EnergeContainer1: {flexDirection: 'row'},
  EnergeContainer2: {flexDirection: 'row'},
  month1: {
    fontSize: 40,
    width: 400,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '400',
    textAlign: 'left',
    color: '#279145',
    marginLeft: 30,
  },
  month2: {
    fontSize: 28,
    width: 400,
    height: 30,
    lineHeight: 30,
    fontFamily: 'Blinker-SemiBold',
    fontWeight: '900',
    textAlign: 'left',
    color: '#279145',
    marginLeft: 40,
  },
});

export default CheckWalkScreen;
