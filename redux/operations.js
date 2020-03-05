import axios from 'axios';
import {setUserImage, setDates, setTemps} from './actions';

export const fetchUserImage = (token, id) => async dispatch => {
  try {
    const res = await axios.get(
      `https://graph.facebook.com/${id}?access_token=${token}&fields=id,name,address,picture.type(large)`,
    );
    dispatch(setUserImage(res.data.picture.data.url));
  } catch (err) {
    throw err;
  }
};

export const fetchWeather = (lon, lat) => async dispatch => {
  try {
    const key = `b556b8a9d0ef0681959a194e9bf8845d`;
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`,
    );
    const dates = await res.data.list.map(elem => elem.dt_txt);
    const temps = await res.data.list.map(elem => elem.main.temp);
    dispatch(setDates(dates));
    dispatch(setTemps(temps));
  } catch (err) {
    throw err;
  }
};
