import { defineStore } from 'pinia'

export const useBannerStore = defineStore('banner', {
  state: () => ({
    banners: {
       home: [
        {
          mobile: '/img/banners/banner1-mobile.png',
          desktop: '/img/banners/banner1-desktop.svg'
        },
        {
          mobile: '/img/banners/banner2-mobile.svg',
          desktop: '/img/banners/banner2-desktop.svg'
        },
        {
          mobile: '/img/banners/banner3-mobile.svg',
          desktop: '/img/banners/banner3-desktop.svg'
        }
      ]}
  }),

  getters: {
    getBanners: (state) => {
      return (pagina) => state.banners[pagina] || []
    }
  }
})