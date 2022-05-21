import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { io } from "socket.io-client";
const socket = io.connect('http://api.uuch.lo-cus.ru', {
  path: '/ws/v1/active-teachers',
  auth: {
    token: "Bearer 1"
  }});

const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ5LCJ1c2VyUm9sZVRpdGxlIjoi0KPRh9C40YLQtdC70YwiLCJ1c2VyUm9sZVRpdGxlQ29kZSI6IlRFQUNIRVIiLCJ1c2VyUm9sZUdyb3VwVGl0bGVDb2RlIjoiU1lTVEVNX1VTRVJTIiwiYXZhdGFyTGluayI6bnVsbCwibmFtZSI6IlRlc3QgbmFtZSIsInN1cm5hbWUiOiJ0ZXN0IiwibWlkZGxlbmFtZSI6InRlc3QiLCJwaG9uZSI6Ijg5OTk3Nzc2NjU1IiwiZW1haWwiOiJvaW5rcGFnZTVAZ21haWwuY29tIiwiaXNBY3RpdmF0ZWQiOjAsImlzQmFubmVkIjowLCJpYXQiOjE2NTMxNTY1MTgsImV4cCI6MTY1MzE2MDExOH0.tItnpcSFkX-ucu25UViBX-c85PP4GSkcdfyz0V4N3Y0'

const App = () => {

  console.log('Start app');

  const createAlert = (title, message) =>
      Alert.alert(
          title,
          message
      );

  let check = false;

  /**
   * Event на обработку ошибок подключения
   */
  socket.on("connect_error", (err) => {
    /**
     * От сервера приходит строку, а не JSON. Следовательно, парсим, чтобы получить результат.
     * @type {any}
     */
    const log = JSON.parse(err.data)
    console.log(log)
    if(log.httpStatusCode === 401 && check === false){
      /**
       * Обновляем токен, новый токен мы должны получить из auth service
       * @type {string}
       */
      socket.auth.token = 'Bearer ' + accessToken;
      /**
       * Делаем реконект
       */
      socket.connect(()=>{
        check=false
      })
      check = true
    }
  });

  /**
   * Event который слушает результат подключения
   */
  socket.on("teacher:active", (res) => {
    const data = JSON.parse(res)
    createAlert('Активность', data.message)
  })

  return (
      <View style={styles.container}>
        <Text style={styles.headerText} >Приложение для теста подключения к сервису активные учителя</Text>
        <Text>
          Условие подключения. Токен не валиден нужно сперва создать новый
        </Text>
        <StatusBar style="auto" />
      </View>
  );
}

export default App

const styles = StyleSheet.create({
  container: {
    marginLeft: 25,
    marginRight: 25,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom:20,
  }
});
