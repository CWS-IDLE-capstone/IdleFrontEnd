import React from 'react';
import {StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';

function CalendarView() {
  return (
    //https://github.com/wix/react-native-calendars
    <Calendar
      style={styles.calendar}
      theme={{
        todayBackgroundColor: '#fedebd',
        todayTextColor: '#ffffff',
        selectedDayBackgroundColor: '#00ff00',
      }}
    />
  );
}

const styles = StyleSheet.create({
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});

export default CalendarView;
