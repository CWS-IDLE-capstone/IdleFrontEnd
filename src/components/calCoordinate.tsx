import React, {useEffect, useState} from 'react';

export function calCoordinate() {
  const [startCoordinate, setStartCoordinate] = useState<{
    //시작점
    latitude: number;
    longitude: number;
  } | null>(null);
  if (routeCoordinates.length > 0 && !startCoordinate) {
    const startCoordinate1 = {
      latitude: routeCoordinates[0].latitude,
      longitude: routeCoordinates[0].longitude,
    };
    setStartCoordinate(startCoordinate1);
  }
  console.log('startCoordinate : ', startCoordinate);

  const [endCoordinate, setEndCoordinate] = useState<{
    //종료점 || 에너지떨어지기전
    latitude: number;
    longitude: number;
  } | null>(null);

  if (resultBtn === true) {
    const endCoordinate1 = {
      latitude: routeCoordinates[routeCoordinates.length - 1].latitude,
      longitude: routeCoordinates[routeCoordinates.length - 1].longitude,
    };
    setEndCoordinate(endCoordinate1);
  }
  const firEndLat =
    startCoordinate && endCoordinate
      ? (startCoordinate.latitude + endCoordinate.latitude) / 2
      : 0;
  //시작과종료의 평균위도
  const firEndLng =
    startCoordinate && endCoordinate
      ? (startCoordinate.longitude + endCoordinate.longitude) / 2
      : 0;
  //시작과종료의 평균경도
  const [avgCoordinate, setAvgCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  //시작과종료의 평균경도
  const firEndAvgCoordinate = {latitude: firEndLat, longitude: firEndLng}; //시작과종료의 평균 위치
  // const MaxCoord = {latitude: avgLat, longitude: avgLng}; //평균값
  let maxDifference = 0; //기본배열의 먼 위치 저장
  let maxCoordinate = {latitude: 0, longitude: 0};

  useEffect(() => {
    const midIndex = routeCoordinates.length / 2;
    const midLatCoordinate =
      routeCoordinates.length > 0 ? routeCoordinates[midIndex].latitude : 0;
    console.log('midLatCoordinate : ', midLatCoordinate);

    const midLngCoordinate =
      routeCoordinates.length > 0 ? routeCoordinates[midIndex].longitude : 0;
    console.log('midLngCoordinate : ', midLngCoordinate);
    return () => {
      // 클린업 함수
    };
  }, [routeCoordinates]);
  // for (const coordinate of routeCoordinates) {
  //   const latDiff = Math.abs(
  //     firEndAvgCoordinate.latitude - firEndAvgCoordinate.latitude,
  //   );
  //   const lngDiff = Math.abs(
  //     firEndAvgCoordinate.longitude - firEndAvgCoordinate.longitude,
  //   );
  //   const diff = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  //   if (diff > maxDifference) {
  //     maxDifference = diff;
  //     maxCoordinate = {latitude: latDiff, longitude: lngDiff};
  //   }
  // }
  const difCoorLat = Math.abs(
    (maxCoordinate.latitude - firEndAvgCoordinate.latitude) / 2,
  ); //먼 위치 위도와 평균 위치 위도의 중간 위도
  const difCoorLng = Math.abs(
    (maxCoordinate.longitude - firEndAvgCoordinate.longitude) / 2,
  ); //먼 위치 경도와 평균 위치 경도의 중간 경도

  console.log('Max difference:', maxDifference);
}
