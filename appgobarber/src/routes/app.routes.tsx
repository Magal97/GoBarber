import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DashBoard from '../Pages/DashBoard';

const Auth = createStackNavigator();

const AppRoutes: React.FC = () => (
  <Auth.Navigator screenOptions={{
    headerShown: false,
    cardStyle: { backgroundColor: '#312e38'}
    }}
  >
    <Auth.Screen name='DashBoard' component={DashBoard} />
  </Auth.Navigator>
);

export default AppRoutes;
