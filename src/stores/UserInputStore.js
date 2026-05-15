import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInputStore = defineStore('inputStore', () => {
  const campos = ref({
    userInputNome: {
        type: 'text',
        label: '*Nome Completo',
        placeholder: 'Escreva o seu nome completo.',
        value: '',
        required: true,
        error: ''
    },

     userInputDataNascimento: {
      type: 'text',
      label: '*Data de nascimento',
      placeholder: 'Escreva a sua data de nascimento.',
      value: '',
      required: true,
      error: ''
    },

    userInputTelefone: {
      type: 'text',
      label: '*Telefone',
      placeholder: 'Escreva o seu telefone.',
      value: '',
      required: true,
      error: ''
    },

    userInputEmail: {
      type: 'email',
      label: '*Email',
      placeholder: 'Escreva o seu email.',
      value: '',
      required: true,
      error: ''
    },

    userInputSenha: {
      type: 'password',
      label: '*Senha',
      placeholder: 'Escreva a sua senha.',
      value: '',
      required: true,
      error: ''
    },

  })
  
 const resetForm = () => {
    Object.values(campos.value).forEach(campo => {
      campo.value = ''
    })
  }

  return {
    campos,
    resetForm
  }
})