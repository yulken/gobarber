import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {
  Container, Title, BackToSignIn, BackToSignInText
} from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const [isVisible, setVisible] = useState(true);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setVisible(false));
    Keyboard.addListener('keyboardDidHide', () => setVisible(true));
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logoImg} />
            <Title>Crie sua conta</Title>
            <Input name="name" icon="user" placeholder="Nome" />
            <Input name="email" icon="mail" placeholder="E-mail" />
            <Input name="password" icon="lock" placeholder="Senha" />

            <Button onPress={() => { }}>Entrar</Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      {isVisible && (
        <BackToSignIn onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
          <BackToSignInText>Voltar para logon</BackToSignInText>
        </BackToSignIn>
      )}
    </>
  );
};

export default SignUp;
