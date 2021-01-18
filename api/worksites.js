import axios from 'axios';
import { AsyncStorage } from 'react-native';

const searchWorksites = async (search, incident) => {
  const accessToken = await AsyncStorage.getItem('@accessToken');
  const respone = await axios.get(
    `https://api.dev.crisiscleanup.io/worksites?fields=id,name,address,case_number,postal_code,city,state,incident,work_types&limit=5&search=${search}&incident=${incident}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return respone.data.results;
};

const createWorksite = async (worksite) => {
  const accessToken = await AsyncStorage.getItem('@accessToken');
  const respone = await axios.post(
    `https://api.dev.crisiscleanup.io/worksites`,
    { ...worksite },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return respone.data;
};

const updateWorksite = async (worksite) => {
  const accessToken = await AsyncStorage.getItem('@accessToken');
  const respone = await axios.patch(
    `https://api.dev.crisiscleanup.io/worksites`,
    { ...worksite },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return respone.data;
};

const getWorksite = async (id) => {
  const accessToken = await AsyncStorage.getItem('@accessToken');
  const respone = await axios.get(
    `https://api.dev.crisiscleanup.io/worksites/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return respone.data;
};

export { searchWorksites, createWorksite, updateWorksite, getWorksite };
