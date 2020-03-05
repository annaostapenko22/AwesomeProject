import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, StyleSheet, AsyncStorage} from 'react-native';
import {LoginButton, AccessToken} from 'react-native-fbsdk';
import {NativeRouter, Link, Route, withRouter} from 'react-router-native';
import HomeScreen from './HomeScreen';
import WeatherScreen from './WeatherScreen';
import {fetchUserImage} from '../../redux/operations';

const DefaultScreen = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [isHomeButtonActive, setIsHomeButtonActive] = useState(true);
  const [isWeatherButtonActive, setIsWeatherButtonActive] = useState(false);
  const dispatch = useDispatch();
  const userImg = useSelector(state => state.login.userImg);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const token = await AsyncStorage.getItem('token');
      const id = await AsyncStorage.getItem('id');
      if (token && !userImg) {
        await dispatch(fetchUserImage(token, id));
        await setIsLogged(true);
      }
    };
    checkIfLoggedIn();
  }, []);

  const handleLogin = async (error, result) => {
    if (error) {
      console.log('login has error: ' + result.error);
    } else if (result.isCancelled) {
      console.log('login is cancelled.');
    } else {
      try {
        const data = await AccessToken.getCurrentAccessToken();
        const userID = data.userID;
        const token = await data.accessToken.toString();
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('id', userID);
        await dispatch(fetchUserImage(token, userID));
        await setIsLogged(true);
        await setIsHomeButtonActive(true);
      } catch (err) {
        console.log('another', err);
      }
    }
  };
  const handleLogOut = async () => {
    console.log('logout.');
    await AsyncStorage.removeItem('token');
    await setIsLogged(false);
  };
  const onLinkWeatherPress = () => {
    setIsHomeButtonActive(false);
    setIsWeatherButtonActive(true);
  };
  const onLinkHomePress = () => {
    setIsHomeButtonActive(true);
    setIsWeatherButtonActive(false);
  };
  return (
    <NativeRouter>
      <View style={styles.container}>
        <View>
          <LoginButton
            onLoginFinished={handleLogin}
            onLogoutFinished={handleLogOut}
          />
        </View>
        {isLogged && (
          <View style={styles.container}>
            <View style={styles.navigation}>
              <Link to="/" onPress={onLinkHomePress}>
                <Text
                  style={isHomeButtonActive ? styles.activeLink : styles.link}>
                  HOME
                </Text>
              </Link>
              <Link to="/weather" onPress={onLinkWeatherPress}>
                <Text
                  style={
                    isWeatherButtonActive ? styles.activeLink : styles.link
                  }>
                  WEATHER
                </Text>
              </Link>
            </View>
            <Route path="/" exact component={HomeScreen} />
            <Route path="/weather" component={WeatherScreen} />
          </View>
        )}
      </View>
    </NativeRouter>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  navigation: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fb8c00',
    height: 60,
    alignItems: 'center',
    marginTop: 20,
  },
  link: {
    color: 'white',
    fontWeight: 'bold',
    height: 60,
    lineHeight: 60,
    textAlign: 'center',
    width: 205,
  },
  activeLink: {
    color: 'black',
    fontWeight: 'bold',
    height: 60,
    lineHeight: 60,
    textAlign: 'center',
    width: 205,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});

export default DefaultScreen;
