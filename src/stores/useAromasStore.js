import { defineStore } from 'pinia'

export const useAromasStore = defineStore('aromas', {
  state: () => ({
    aromas: [
      {
        nome: 'Bergamota',
        subtitulo: 'Citrus bergamia',
        imagem: 'public/img/aromas/bergamota.jpg',
        descricao: `
        A bergamota é um óleo essencial cítrico extraído por expressão das cascas dos frutos, o que garante um aroma idêntico ao frescor da fruta viva. É classificada como um óleo suave e seguro, pertencente à família dos monoterpenos, o que lhe confere propriedades antioxidantes e energéticas. Além de seu frescor, é amplamente reconhecida na aromaterapia por seu efeito sedativo, calmante e equilibrante para o sistema nervoso. `,
      },
      {
        nome: 'Capim Limão',
        subtitulo: 'Erva-príncipe',
        imagem: 'public/img/aromas/capimlimao.jpg',
        descricao: `
        Este aroma é descrito nas fontes como "Erva-príncipe" e é rico em aldeídos, componentes que possuem potentes propriedades antibacterianas e antifúngicas. Na difusão, atua como um excelente ansiolítico e anti-inflamatório, sendo ideal para criar um ambiente de relaxamento e purificação. Sua natureza é energética e estimulante, ajudando a renovar as energias do ambiente.`,
      },
      {
        nome: 'Flor de Laranjeira',
        subtitulo: 'Néroli',
        imagem: 'public/img/aromas/flordelaranjeira.jpg',
        descricao: `
        Frequentemente chamada de Néroli, esta essência é obtida a partir de flores delicadas que, devido à sua fragilidade, podem ser processadas como absolutos para preservar seu aroma natural e fiel. É uma fragrância altamente concentrada e sofisticada, valorizada por sua afinidade com o sistema dérmico e por promover uma sensação de paz e regeneração.`,
      },

      {
        nome: 'Jasmim',
        subtitulo: 'Jasminum officinale',
        imagem: 'public/img/aromas/jasmim.jpg',
        descricao: `
        As flores de jasmim são tão delicadas que seu aroma é extraído através de solventes para criar o que chamamos de "absoluto". O resultado é uma substância aromática rica e viscosa que captura a essência floral profunda da planta. Na aromaterapia, o jasmim é celebrado por sua forte conexão com o equilíbrio emocional e o sistema reprodutivo, sendo um aroma envolvente e confortante. `,
      },
      {
        nome: 'Lavanda Francesa',
        subtitulo: 'Lavandula angustifolia',
        imagem: 'public/img/aromas/lavanda.jpg',
        descricao: `
        A lavanda é o pilar da aromaterapia, classificada como um dos óleos mais suaves e seguros para uso contínuo. Seu aroma é rico em álcoois monoterpenos, que proporcionam propriedades antiespasmódicas, sedativas e tranquilizantes. É a escolha perfeita para velas destinadas ao relaxamento profundo, combate ao stress e promoção de um sono reparador.`,
      },
      {
        nome: 'Limão Siciliano',
        subtitulo: 'Citrus limon',
        imagem: 'public/img/aromas/limaosiciliano.jpg',
        descricao: `
        Extraído mecanicamente das cascas frescas, o aroma do limão siciliano é vibrante e energizante. Composto majoritariamente por d-limoneno, este aroma possui ação antimicrobiana e antioxidante. É um perfume que promove a clareza mental e a limpeza do ambiente, trazendo a sensação de frescor e vivacidade típica dos pomares cítricos.`,
      },
      {
        nome: 'Baunilha',
        subtitulo: 'Vanilla planifolia',
        imagem: 'public/img/aromas/baunilha.png',
        descricao: `
        A baunilha é um aroma amplamente reconhecido por sua fragrância quente, doce e extremamente acolhedora. Na aromaterapia, é utilizada para promover o equilíbrio emocional, sendo associada ao combate ao estresse, à ansiedade e à insônia, ajudando a proporcionar uma sensação de relaxamento profundo. Além de suas propriedades calmantes, é celebrada por seu caráter afrodisíaco, estimulando a sensualidade e criando uma atmosfera romântica e reconfortante no ambiente.`,
      },
      {
        nome: 'Flor de Cerejeira',
        subtitulo: 'Prunus serrulata',
        imagem: 'public/img/aromas/flordecerejeira.jpg',
        descricao: `
        Este aroma elegante e sofisticado pertence à família olfativa floral-frutal e é ideal para quem busca um ambiente de serenidade e harmonia. A essência de flor de cerejeira está ligada ao estímulo do amor pessoal e à paz interior, ajudando também na concentração. Por ser uma fragrância neutra e suave, é perfeita para uso em ambientes corporativos ou em qualquer cômodo da casa, sendo apreciada por seu frescor agradável.`,
      },
      {
        nome: 'Maçã e Canela',
        subtitulo: 'Malus domestica + Cinnamomum verum',
        imagem: 'public/img/aromas/macaecanela.jpg',
        descricao: `
        Esta combinação clássica une a vivacidade refrescante da maçã com o calor especiado da canela, resultando em uma fragrância envolvente e cheia de personalidade. Enquanto a maçã traz notas de saída vibrantes que remetem ao otimismo, à alegria e à sensação de renovação e limpeza, a canela adiciona uma camada de sofisticação e conforto. O resultado é uma vela que cria uma atmosfera convidativa e memorável, ideal para transformar salas e quartos em refúgios de puro aconchego.`,
      },
    ],
  }),
})
