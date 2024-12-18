import { Button, Label, Fieldset, Input, Form, Titulo } from "../../components";
import { useForm, Controller } from "react-hook-form";
//! Controller: usa-se para trabalhar com componentes que são controlados (componentes que já estão prontos de bibliotecas 
// !externas) diferente do que o react-hook-from prefere
import { ErrorMessage } from "../../components";
import InputMask from "../../components/InputMask";
import { useEffect } from "react";

//? Definir os dados que serão recebidos no formulario
interface FormInputTipos {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  senhaVerificada: string;
}

const CadastroPessoal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful}, //* função do useform de errors
    watch, //* assistir a senha que é colocada no input para usar no validaSenha (função)
    control,
    reset,
  }
    = useForm<FormInputTipos>( {
      mode: 'all',
      defaultValues: {
        nome: '', 
        email: '', 
        telefone: '', 
        senha: '', 
        senhaVerificada: '', 
      },
    }); //* tipando o Hook (useForm<FormInputTipos>) e dizendo que ele vai receber dados desse tipo

    //! Pedindo para o useEffect ficar de olho nessa variavel (isSubmitSuccessful), para quando a variavel 
    //! mudar ele renderize a aplicação limpandos os dados porque estou passando o reset
    useEffect(() => {
      reset();
    }, [reset, isSubmitSuccessful]);


  const aoSubmeter = (dados: FormInputTipos) => {
    console.log(dados);
  }

  //? Para assistir a senha que é colocada no campo senha para usar na validação e confirmação da senha
  const senha = watch('senha')

  //? Criar um objeto para senhaVerificada
  const validaSenha = {
    obrigatorio: (val: string) => !!val || "Por favor, insira a senha novamente", //! vai receber um valor (val: string), converter o val em boleano (!!val) e se ela não for (||) válida vai ter a mensagem de erro
    tamanhoMinimo: (val: string) => val.length >= 8 || "A senha deve ter pelo menos 8 caracteres", //! verificar se o tamanho do val é maior ou igual a 8 
    senhaIguais: (val: string) => val == senha || "As senhas não correspondem" //! verificar se o val é igual a senha passada
  }

  //? Criar validações personalizadas
  function validarEmail(valor: string) {
    const formatoEmail = /^[^\s@]+@alura\.com\.br$/;
    if (!formatoEmail.test(valor)) {
      console.error("Endereço de email é inválido para este domínio");
      return false;
    }
    return true;
  }

  return (
    <>
      <Titulo>Insira alguns dados básicos:</Titulo>

      <Form onSubmit={handleSubmit(aoSubmeter)}>

        <Fieldset>
          <Label htmlFor="campo-nome">Nome</Label>
          <Input
            id="campo-nome"
            placeholder="Digite seu nome completo"
            type="text"
            //? Passar a borda vermelha no formulário quando invalido
            $error={!!errors.nome} //! props convertido em boleado (!!), aparece a bordinha vermelha no input
            {...register('nome', //* espalhando(...split) o register, ele tem que receber um nome que tem que ser diferente para cada um
              {
                required: "Campo de nome é obrigatório", //* mensagem que vai passar caso o campo seja inválido
                minLength: {
                  value: 5,
                  message: "O nome deve ter pelo menos 5 caracteres"
                }
              })}
          //! O register recebe o nome do campo e um objeto, onde passamos nossa validação (baseado no HTML nativo)

          />
          {errors.nome && <ErrorMessage>{errors.nome.message}</ErrorMessage>}{/* Usando o errors do UseForm, vai aparecer a mensagem de erro vermelha em baixo do input*/}
        </Fieldset>

        <Fieldset>
          <Label htmlFor="campo-email">E-mail</Label>
          <Input
            id="campo-email"
            placeholder="Insira seu endereço de email"
            type="email"
            $error={!!errors.email}
            {...register('email', {
              required: "O campo de email é obrigatório", //* mensagem que vai passar caso o campo seja inválido
              validate: validarEmail //* validação personalizada
              //* Como o validate realmente funciona (lá em cima foi uma forma abrevidada): validate: (val) => validarEmail(val)
              //! Pode passar várias funções de validação
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </Fieldset>

        //! COntroller para o telefone
        <Controller 
        control={control} 
        name="telefone" 
        rules={{
          pattern: {
            value: /^\(\d{2, 3}\) \d{5}-\d{4}$/,
            message: "O telefone inserido está no formato incorreto",
            },
            required: "O campo telefone é obrigatório",
          }}
          //! Reponsável por renderizar o componente controlado
          render={({field}) => ( //* deestruturar um objeto chamado field e renderizar o componente mask dentro dos ()
            <Fieldset>
              <Label>Telefone</Label>
              <InputMask 
              mask= "(99) 99999-9999"
              placeholder="Ex: (DD) XXXXX-XXXX"
              $error={!!errors.telefone}
              onChange={field.onChange} //! Serve para controlar o componente controlado (trabalha com componentes de bibliotecas externas)
              />
              {errors.telefone && <ErrorMessage>{errors.telefone.message}</ErrorMessage>}
            </Fieldset>
          )}
        />

        <Fieldset>
          <Label htmlFor="campo-senha">Crie uma senha</Label>
          <Input
            id="campo-senha"
            placeholder="Crie uma senha"
            type="password"
            $error={!!errors.senha}
            {...register('senha', {
              required: "O campo de senha é obrigatório",
              minLength: {
                value: 8,
                message: "A senha deve ter pelo menos 8 caracteres"
              }
            })}
          />
          {errors.senha && <ErrorMessage>{errors.senha.message}</ErrorMessage>}

        </Fieldset>
        <Fieldset>
          <Label htmlFor="campo-senha-confirmacao">Repita a senha</Label>
          <Input
            id="campo-senha-confirmacao"
            placeholder="Repita a senha anterior"
            type="password"
            $error={!!errors.senhaVerificada}
            {...register('senhaVerificada', {
              required: 'Repita a senha',
              validate: validaSenha,
            })}
          />
          {errors.senhaVerificada && <ErrorMessage>{errors.senhaVerificada.message}</ErrorMessage>}
        </Fieldset>
        <Button type="submit">Avançar</Button>
      </Form>
    </>
  );
};

export default CadastroPessoal;
