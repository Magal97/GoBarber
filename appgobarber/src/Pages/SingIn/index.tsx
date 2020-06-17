import React, {useRef, useCallback} from 'react';
import { Image, KeyboardAvoidingView, View, Platform, ScrollView, TextInput, Alert } from 'react-native';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import {useAuth} from '../../hooks/AuthContext';
import { Form } from '@unform/mobile';
import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/Feather'
import {useNavigation} from '@react-navigation/native';


import { Container, Title, ForgotPassword, ForgotPasswordText,
  CreateAccountButton, CreateAccountButtonText } from './styles';

interface SingInFormData {
    email: string;
    password: string;
}


const SingIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const passwordInputRef = useRef<TextInput>(null);
  const navigate = useNavigation();

  const {singIn, user} = useAuth();
  //console.log(user);
  const handleSingIn = useCallback(async (data:SingInFormData) => {

    try{
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório')
        .email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await singIn({
        email: data.email,
        password: data.password,
      })


    }catch(err){

      if(err instanceof Yup.ValidationError){
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert('Erro na autenticação', 'Ocorreu um erro no login');

    }

  }, []);

  return (
    <>
    <KeyboardAvoidingView style={{flex:1}}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    enabled
    >
      <ScrollView keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flex: 1}}>
        <Container>
          <Image source={logoImg} />
          <View>
            <Title>Faça seu logon</Title>
          </View>
          <Form onSubmit={handleSingIn} ref={formRef} >

            <Input name="email"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            icon="mail"
            placeholder="Digite seu e-mail"
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordInputRef.current?.focus();
            }}/>

            <Input
            ref={passwordInputRef}
            secureTextEntry
            name="password"
            icon="lock"
            placeholder="Digite sua senha"
            returnKeyType="send"
            onSubmitEditing={() => {formRef.current?.submitForm();
            }}/>

            <Button onPress={() => {formRef.current?.submitForm();}}>Entrar</Button>

          </Form>
          <ForgotPassword onPress={() => {console.log('deu')}} >
            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
          </ForgotPassword>
        </Container>
      </ScrollView>

        <CreateAccountButton onPress={() => navigate.navigate('SingUp')} >
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountButtonText>Criar conta</CreateAccountButtonText>
        </CreateAccountButton>

    </KeyboardAvoidingView>
    </>
  );

};

export default SingIn;
