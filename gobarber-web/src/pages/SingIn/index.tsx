import React, {useRef, useCallback} from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import {Link, useHistory} from 'react-router-dom'
import {useAuth} from '../../hooks/AuthContext';
import {useToast} from '../../hooks/ToastContext';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import LogoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface SingInFormData {
  email: string;
  password: string;
}

const SingIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { singIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data:SingInFormData) => {

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

      history.push('/dashboard');

    }catch(err){

      if(err instanceof Yup.ValidationError){
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na autenticação',
        description: 'Ocorreu um erro no login',
      });
    }

  }, [addToast, singIn, history]);


  return (
  <Container>
    <Content>
      <AnimationContainer>
        <img src={LogoImg} alt="GoBarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu logon</h1>

          <Input name="email" icon={FiMail} placeholder="E-mail"/>

          <Input name="password" icon={FiLock} type="password" placeholder="Senha"/>

          <Button type="submit">Entrar</Button>

          <a href="fogot">Esqueci minha senha</a>

        </Form>
        <Link to="/singup">
          <FiLogIn/>
          Criar conta
        </Link>
      </AnimationContainer>
    </Content>
    <Background/>
  </Container>

  );

};


export default SingIn;
