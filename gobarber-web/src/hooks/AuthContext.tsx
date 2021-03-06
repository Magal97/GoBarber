import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface SingInCredentials{
  email: string;
  password: string;
}


interface AuthContextData{
  user: object;
  singIn(cridentials : SingInCredentials): Promise<void>;
}

interface AuthSate {
  token: string;
  user: object;

}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({children}) =>{
  const [data, setData] = useState<AuthSate>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if(token && user){
      return { token, user: JSON.parse(user)};
    }

    return {} as AuthSate;

  })

  const singIn = useCallback(async ({email, password}) =>{
    const response = await api.post('sessions', {
      email,
      password,
    })

    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));
    setData({token, user});

  }, []);

  const singOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');
    setData({} as AuthSate);
  }, [])

  return (
      <AuthContext.Provider value={{ user: data.user, singIn }}>
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
