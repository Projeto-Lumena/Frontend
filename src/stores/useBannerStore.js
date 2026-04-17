import { defineStore } from 'pinia'

export const useBannerStore = defineStore('banner', {
  state: () => ({
    banners: {
       home: [
        {
          mobile: '/img/banner1-mobile.svg',
          desktop: '/img/banner1-desktop.svg'
        },
        {
          mobile: '/img/banner2-mobile.svg',
          desktop: '/img/banner2-desktop.svg'
        },
        {
          mobile: '/img/banner3-mobile.svg',
          desktop: '/img/banner3-desktop.svg'
        }
      ]}
  }),

  getters: {
    getBanners: (state) => {
      return (pagina) => state.banners[pagina] || []
    }
  }
})