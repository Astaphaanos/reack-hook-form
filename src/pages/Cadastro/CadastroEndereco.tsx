import { useForm } from "react-hook-form";
import {
  Button,
  Fieldset,
  Form,
  FormContainer,
  Input,
  Label,
  Titulo,
} from "../../components";
import { ErrorMessage } from "../../components";

//! Vai validar do mesmo jeito do CadastroPessoal

interface FormInputEndereco {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  localidade: string;
}

const CadastroEndereco = () => {

  const { register, handleSubmit, setError, setValue, watch, formState: {errors}} = useForm<FormInputEndereco>({
      mode: 'all', //* revalide os campos quando o foco sair dele para tirar os erros quando o usuario preencher o cep correto
      defaultValues: { //* Os campos tem o valor inicial "" (começa vazio)
        cep: '',
        rua: '',
        bairro: '',
        numero: '',
        localidade: ''
      }
  });
  
  const aoSubmeter = (dados: FormInputEndereco) => {
    console.log(dados);
  }

  //* Assistir o campo cep
  const cepDigitado = watch('cep');

  //* Função que vai retornar a API de CEP
    const fethEndereco = async (cep: string) => {
      if (!cep) {
        setError("cep", { //! setError é do useForm para fazer error customizados
          type: "manual", 
          message: "Cep Inválido"
        });
        return
      }

      try {
        const response = await fetch(`http://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json();

        //* Preenchimento automático dos campos se o cep for válido
        if(response.ok) {
          setValue('rua', data.logradouro);
          setValue('localidade', `${data.localidade}, ${data.uf}`); //* Dessa forma consigo pegar dos valores (localidade e uf)
          setValue('bairro', data.bairro);
        } else {
          throw new Error("Cep inválido") //* Passar o error
        }

      } catch (error) {
        console.error(error);
      }
    };


  return (
    <>
      <Titulo>Agora, mais alguns dados sobre você:</Titulo>

      <Form onSubmit={handleSubmit(aoSubmeter)}>
        <Fieldset>
          <Label htmlFor="campo-cep">CEP</Label>
          <Input 
          id="campo-cep" 
          placeholder="Insira seu CEP" 
          type="text"
          {...register("cep",{
            required: "O campo é obrigatório"
          })}
          $error={!!errors.cep}
          onBlur={() => fethEndereco(cepDigitado)}     
          />
          {errors.cep && <ErrorMessage>{errors.cep.message}</ErrorMessage>}
        </Fieldset>

        <Fieldset>
          <Label htmlFor="campo-rua">Rua</Label>
          <Input 
          id="campo-rua" 
          placeholder="Rua Agarikov" 
          type="text" 
          $error={!!errors.rua}
          {...register("rua", {
            required: "O campo é obrigatório"
          })}
          />
          {errors.rua && <ErrorMessage>{errors.rua.message}</ErrorMessage>}
        </Fieldset>

        <FormContainer>
          <Fieldset>
            <Label htmlFor="campo-numero-rua">Número</Label>
            <Input 
            id="campo-numero-rua" 
            placeholder="Ex: 1440" 
            type="text" 
            $error={!!errors.numero}
            {...register("numero",{
              required: "O campo é obrigatório"
            })}
            />
            {errors.numero && <ErrorMessage>{errors.numero.message}</ErrorMessage>}
          </Fieldset>

          <Fieldset>
            <Label htmlFor="campo-bairro">Bairro</Label>
            <Input 
            id="campo-bairro" 
            placeholder="Vila Mariana" 
            type="text" 
            $error={!!errors.bairro}
            {...register("bairro", {
              required: "O campo é obrigatório"
            })}
            />
            {errors.bairro && <ErrorMessage>{errors.bairro.message}</ErrorMessage>}
          </Fieldset>
        </FormContainer>

        <Fieldset>
          <Label htmlFor="campo-localidade">Localidade</Label>
          <Input
            id="campo-localidade"
            placeholder="São Paulo, SP"
            type="text"
            $error={!!errors.localidade}
            {...register("localidade", {
              required: "O campo é obrigatório"
            })}
          />
          {errors.localidade && <ErrorMessage>{errors.localidade.message}</ErrorMessage>}
        </Fieldset>

        <Button type="submit">Cadastrar</Button>
      </Form>
    </>
  );
};

export default CadastroEndereco;
