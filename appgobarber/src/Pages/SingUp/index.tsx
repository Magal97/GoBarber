import React, {useCallback, useRef} from 'react';
import { Image, KeyboardAvoidingView, View, Platform, ScrollView, TextInput, Alert } from 'react-native';
import {FormHandles} from '@unform/core';
import api from '../../services/api';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import {Form} from '@unform/mobile';
import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';


import { Container, Title, BackToSingIn, BackToSingInText } from './styles';

interface SingUpFormData{
  name: string;
  email: string;
  password: string;
}

const SingUp: React.FC = () => {
  const navigate = useNavigation();
  const formRef = useRef<FormHandles>(null);

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSingUp = useCallback(async (data:SingUpFormData) => {
    try{
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório')
        .email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'No minímo 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });


      await api.post('/users', data);

      Alert.alert('Cadastro realizado', 'Seu cadastro foi realizado com sucesso.')

      navigate.goBack();

    }catch(err){

      console.log(err)
      if(err instanceof Yup.ValidationError){
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer o cadastro.');
      console.log(err)
    }

  }, [navigate]);

  return (
    <>
    <KeyboardAvoidingView style={{flex:1}}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    enabled
    >
      <ScrollView keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flex: 1}}>
        <Container  >
          <Image source={logoImg} />
          <View>
            <Title>Crie sua conta</Title>
          </View>
        <Form ref={formRef} onSubmit={handleSingUp} >
          <Input
          autoCapitalize="words"
          name="name"
          icon="user"
          placeholder="Digite seu nome"
          returnKeyType="next"
          onSubmitEditing={() => {
            emailInputRef.current?.focus();
          }} />

          <Input
          ref={emailInputRef}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          name="email" icon="mail"
          placeholder="Digite seu e-mail"
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordInputRef.current?.focus();
          }} />

          <Input
          ref={passwordInputRef}
          secureTextEntry
          name="password"
          icon="lock"
          placeholder="Digite sua senha"
          returnKeyType="send"
          textContentType="newPassword"
          onSubmitEditing={() => {formRef.current?.submitForm();}} />

          <Button onPress={() => {formRef.current?.submitForm();}}>Cadastrar</Button>
        </Form>
        </Container>
      </ScrollView>

        <BackToSingIn onPress={() => navigate.goBack()} >
          <Icon name="arrow-left" size={20} color="#fff" />
          <BackToSingInText>Voltar para o logon</BackToSingInText>
        </BackToSingIn>

    </KeyboardAvoidingView>
    </>
  );

};

export default SingUp;
