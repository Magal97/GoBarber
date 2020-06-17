import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api';

interface SingInCredentials{
  email: string;
  password: string;
}


interface AuthContextData{
  user: object;
  singOut(): void;
  singIn(cridentials : SingInCredentials): Promise<void>;
  loading: boolean;
}

interface AuthSate {
  token: string;
  user: object;

}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({children}) =>{
  const [data, setData] = useState<AuthSate>({} as AuthSate);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadStoregData(): Promise<void>{
      const [token, user] = await AsyncStorage.multiGet(['@GoBarber:token', '@GoBarber:user']);

      if(token[1] && user[1]){
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStoregData();
  }, []);

  const singIn = useCallback(async ({email, password}) =>{
    const response = await api.post('sessions', {
      email,
      password,
    })

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)]
    ]);
    setData({token, user});

  }, []);

  const singOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);
    setData({} as AuthSate);
  }, [])

  return (
      <AuthContext.Provider value={{ user: data.user, loading, singIn, singOut }}>
        {children}
      </AuthContext.Provider>

  );
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if(!context){
    throw new Error('useAuth must be used whitin an AuthProvider');

  }

  return context;

}

export { AuthProvider, useAuth };
