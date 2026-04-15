import { defineStore } from 'pinia'

export const useBannerStore = defineStore('banner', {
  state: () => ({
    banners: {
      home: [
        '/img/banner1.svg',
        '/img/banner2.svg',
        '/img/banner3.svg'
    ]}
  }),

  getters: {
    getBanners: (state) => {
      return (pagina) => state.banners[pagina] || []
    }
  }
})